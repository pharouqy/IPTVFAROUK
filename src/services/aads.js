/**
 * Service A-Ads (Anonymous Ads) - Réseau publicitaire crypto
 * Utilisé comme fallback si AdMaven échoue
 */

export const AADS_CONFIG = {
  // ⚠️ REMPLACEZ par votre vrai ID A-Ads
  // Pour l'obtenir : https://a-ads.com → Create Ad Unit
  bannerAdUnitId: import.meta.env.VITE_AADS_BANNER_ID, // Ex: '7891234'

  sizes: {
    leaderboard: "728x90",
    banner: "468x60",
    square: "300x250",
    mobile: "320x50",
    rectangle: "300x100",
  },

  refreshInterval: 60000,
  fallbackEnabled: true,
};

/**
 * Charger une publicité A-Ads
 * @param {string} adUnitId - ID de l'unité publicitaire A-Ads
 * @param {string} size - Taille (ex: '728x90')
 * @param {string} containerId - ID du container DOM
 * @returns {Promise}
 */
export const loadAadsAd = (adUnitId, size = "728x90", containerId) => {
  // Use default config id if none provided
  const effectiveId = adUnitId || AADS_CONFIG.bannerAdUnitId;

  return new Promise((resolve, reject) => {
    // Check if ID is configured
    if (!effectiveId) {
      console.warn("⚠️ A-Ads adUnitId manquant, affichage du fallback");
      console.info("💡 Configurez VITE_AADS_BANNER_ID dans votre fichier .env");
      createFallbackAd(containerId);
      reject(new Error("Missing A-Ads adUnitId"));
      return;
    }

    // Warn if using default/example ID
    if (effectiveId === "1234567") {
      console.warn("⚠️ A-Ads utilise l'ID d'exemple par défaut (1234567)");
      console.info("💡 Remplacez VITE_AADS_BANNER_ID dans .env avec votre vrai ID");
      console.info("📖 Voir SETUP_ADS.md pour les instructions");
    }

    console.log(`🪙 Tentative de chargement A-Ads: ${effectiveId}`);

    const container = document.getElementById(containerId);

    if (!container) {
      console.error(`❌ Container ${containerId} introuvable`);
      reject(new Error(`Container ${containerId} not found`));
      return;
    }

    // Nettoyer l'ancien contenu
    container.innerHTML = "";

    // Créer le script A-Ads
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://ad.a-ads.com/${effectiveId}?size=${size}`;
    script.setAttribute("data-aa", effectiveId);
    script.type = "text/javascript";
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "no-referrer";

    // Timeout de 5 secondes
    const timeout = setTimeout(() => {
      console.warn("⏱️ Timeout A-Ads (5s) - Possible ad blocker ou problème réseau");
      // cleanup
      if (script.parentNode) script.parentNode.removeChild(script);
      // fallback automatique si activé
      if (AADS_CONFIG.fallbackEnabled) {
        createFallbackAd(containerId);
        markAadsShown("banner_fallback_timeout");
      }
      reject(new Error("A-Ads load timeout"));
    }, 5000);

    script.onload = () => {
      clearTimeout(timeout);
      console.log(`✅ A-Ads chargé: ${effectiveId}`);
      // on considère l'annonce affichée (statistiques)
      markAadsShown("banner");
      resolve();
    };

    script.onerror = (error) => {
      clearTimeout(timeout);
      
      // Detect if it's likely an ad blocker
      const isLikelyAdBlocker = 
        error.type === 'error' && 
        !navigator.onLine === false; // online but failed
      
      if (isLikelyAdBlocker) {
        console.info("🛡️ A-Ads bloqué (probablement un ad blocker) - Affichage du fallback");
        console.info("💡 C'est normal, ~50% des utilisateurs ont un ad blocker");
      } else {
        console.error(`❌ Erreur chargement A-Ads: ${effectiveId}`);
      }
      
      // fallback automatique si activé
      if (AADS_CONFIG.fallbackEnabled) {
        createFallbackAd(containerId);
        markAadsShown(isLikelyAdBlocker ? "banner_fallback_blocked" : "banner_fallback_error");
      }
      reject(new Error("Failed to load A-Ads script"));
    };

    container.appendChild(script);
  });
};


/**
 * Vérifier si A-Ads est disponible
 * @returns {Promise<boolean>}
 */
export const checkAadsAvailability = async (timeoutMs = 3000) => {
  // Try a non-CORS approach using an Image ping (more reliable in browsers)
  return new Promise((resolve) => {
    try {
      let finished = false;
      const img = new Image();
      const timer = setTimeout(() => {
        if (finished) return;
        finished = true;
        img.src = ""; // abort
        console.warn("⚠️ A-Ads availability check timeout");
        resolve(false);
      }, timeoutMs);

      img.onload = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        resolve(true);
      };

      img.onerror = () => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        console.warn("⚠️ A-Ads semble indisponible (image error)");
        resolve(false);
      };

      // test endpoint (simple resource on a-ads domain)
      img.src = `https://ad.a-ads.com/ping?v=${Date.now()}`;
    } catch (error) {
      console.warn("⚠️ A-Ads semble indisponible", error);
      resolve(false);
    }
  });
};

/**
 * Enregistrer qu'une pub A-Ads a été affichée
 * @param {string} adType - Type de pub (banner, video, etc.)
 */
export const markAadsShown = (adType) => {
  const key = `aads_${adType}_shown`;
  const count = parseInt(localStorage.getItem(key) || "0") + 1;
  localStorage.setItem(key, count.toString());
  localStorage.setItem(`${key}_last`, Date.now().toString());

  console.log(`📊 A-Ads ${adType} affiché ${count} fois`);
};

/**
 * Obtenir les statistiques A-Ads
 * @returns {Object}
 */
export const getAadsStats = () => {
  return {
    banner: parseInt(localStorage.getItem("aads_banner_shown") || "0"),
    lastBanner: localStorage.getItem("aads_banner_shown_last"),
  };
};

/**
 * Créer une publicité de secours (fallback)
 * @param {string} containerId - ID du container
 */
export const createFallbackAd = (containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const fallbackAds = [
    {
      emoji: "💎",
      title: "Passez Premium",
      subtitle: "Profitez sans publicité pour 2€/mois",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      buttonText: "Découvrir",
      action: () => window.dispatchEvent(new CustomEvent("openPremiumModal")),
    },
    {
      emoji: "⭐",
      title: "Partagez avec vos amis",
      subtitle: "Aidez-nous à grandir en partageant l'application",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      buttonText: "Partager",
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: "IPTV Player",
            text: "Découvre cette super app IPTV !",
            url: window.location.href,
          });
        } else {
          alert("Partage: " + window.location.href);
        }
      },
    },
    {
      emoji: "🎯",
      title: "Annoncez sur notre plateforme",
      subtitle: "Touchons des milliers d'utilisateurs quotidiens",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      buttonText: "Contact",
      action: () => (window.location.href = "mailto:pharouky@gmail.com"),
    },
  ];

  const randomAd = fallbackAds[Math.floor(Math.random() * fallbackAds.length)];

  // Use a stable id to bind the click handler properly
  const adId = `fallback-ad-${Date.now()}`;

  container.innerHTML = `
    <div 
      id="${adId}"
      style="
        width: 100%;
        max-width: 728px;
        min-height: 90px;
        background: ${randomAd.gradient};
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.25rem 2rem;
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        margin: 0 auto;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      "
      onmouseover="
        this.style.transform='translateY(-4px) scale(1.02)'; 
        this.style.boxShadow='0 12px 28px rgba(0,0,0,0.25)';
      "
      onmouseout="
        this.style.transform='translateY(0) scale(1)'; 
        this.style.boxShadow='0 8px 20px rgba(0,0,0,0.15)';
      "
    >
      <!-- Effet de brillance -->
      <div style="
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          45deg,
          transparent,
          rgba(255,255,255,0.1),
          transparent
        );
        transform: rotate(45deg);
        animation: shine 3s infinite;
      "></div>
      
      <!-- Contenu -->
      <div style="display: flex; align-items: center; gap: 1.25rem; position: relative; z-index: 1;">
        <div style="
          font-size: 40px; 
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          animation: bounce 2s infinite;
        ">
          ${randomAd.emoji}
        </div>
        <div>
          <h3 style="
            font-size: 19px; 
            font-weight: bold; 
            margin: 0 0 4px 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">
            ${randomAd.title}
          </h3>
          <p style="
            font-size: 13px; 
            margin: 0; 
            opacity: 0.95;
            line-height: 1.4;
          ">
            ${randomAd.subtitle}
          </p>
        </div>
      </div>
      
      <!-- Bouton -->
      <button style="
        background: white;
        color: #333;
        padding: 12px 28px;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.2s;
        position: relative;
        z-index: 1;
      "
      onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)';"
      onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';"
      >
        ${randomAd.buttonText} →
      </button>
    </div>
    
    <style>
      @keyframes shine {
        0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
        100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
    </style>
  `;

  // Ajouter l'événement click (recherche avec le même id)
  const adElement = container.querySelector(`#${adId}`);
  if (adElement) {
    adElement.addEventListener("click", randomAd.action);
  }

  console.log("🎨 Pub fallback créative affichée");
};

/**
 * Réinitialiser les stats A-Ads
 */
export const resetAadsStats = () => {
  localStorage.removeItem("aads_banner_shown");
  localStorage.removeItem("aads_banner_shown_last");
  console.log("🔄 Stats A-Ads réinitialisées");
};
