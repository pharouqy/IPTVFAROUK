/**
 * Service A-Ads (Anonymous Ads) - Réseau publicitaire crypto
 * Utilisé comme fallback si AdMaven échoue
 */

export const AADS_CONFIG = {
  // ⚠️ REMPLACEZ par votre vrai ID A-Ads
  // Pour l'obtenir : https://a-ads.com → Create Ad Unit
  bannerAdUnitId: import.meta.env.VITE_AADS_BANNER_ID || "YOUR_AADS_BANNER_ID", // Ex: '7891234'

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
  return new Promise((resolve, reject) => {
    console.log(`🪙 Tentative de chargement A-Ads: ${adUnitId}`);

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
    script.src = `https://ad.a-ads.com/${adUnitId}?size=${size}`;
    script.setAttribute("data-ad-network", "aads");

    // Timeout de 5 secondes
    const timeout = setTimeout(() => {
      console.warn("⏱️ Timeout A-Ads (5s)");
      reject(new Error("A-Ads load timeout"));
    }, 5000);

    script.onload = () => {
      clearTimeout(timeout);
      console.log(`✅ A-Ads chargé: ${adUnitId}`);
      resolve();
    };

    script.onerror = () => {
      clearTimeout(timeout);
      console.error(`❌ Erreur chargement A-Ads: ${adUnitId}`);
      reject(new Error("Failed to load A-Ads script"));
    };

    container.appendChild(script);
  });
};

/**
 * Vérifier si A-Ads est disponible
 * @returns {Promise<boolean>}
 */
export const checkAadsAvailability = async () => {
  try {
    const response = await fetch("https://a-ads.com/check", {
      method: "HEAD",
      mode: "no-cors",
    });
    return true;
  } catch (error) {
    console.warn("⚠️ A-Ads semble indisponible");
    return false;
  }
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
      emoji: "🪙",
      title: "Soutenez-nous en crypto",
      subtitle: "Bitcoin, Ethereum et autres cryptos acceptés",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      buttonText: "Contribuer",
      action: () => alert("Fonctionnalité crypto bientôt disponible !"),
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

  container.innerHTML = `
    <div 
      id="fallback-ad-${Date.now()}"
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

  // Ajouter l'événement click
  const adElement = container.querySelector(`#fallback-ad-${Date.now()}`);
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
