import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import AppWrapper from "./AppWrapper.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LegalNotice from "./pages/LegalNotice.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
import { LanguageProvider } from "./i18n/LanguageContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppWrapper />} />
          <Route path="/mentions-legales" element={<LegalNotice />} />
          <Route
            path="/politique-confidentialite"
            element={<PrivacyPolicy />}
          />
          <Route path="/conditions-utilisation" element={<TermsOfService />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>
);
