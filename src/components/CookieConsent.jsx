import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import "../styles/CookieConsent.css";
import {
  FaTimes,
  FaShieldAlt,
  FaCog,
  FaInfoCircle,
  FaCircle,
} from "react-icons/fa";

const CookieConsent = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const savedConsent = localStorage.getItem("cookieConsent");
    if (!savedConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      const parsedConsent = JSON.parse(savedConsent);
      setConsent(parsedConsent);

      // Apply saved consent settings
      applyCookieSettings(parsedConsent);
    }
  }, []);

  const applyCookieSettings = (consentSettings) => {
    // Apply analytics cookies (Google Analytics, etc.)
    if (consentSettings.analytics) {
      // Enable Google Analytics or other analytics tools
      console.log("Analytics cookies enabled");
      // Example: gtag('consent', 'update', { 'analytics_storage': 'granted' });
    } else {
      console.log("Analytics cookies disabled");
      // Example: gtag('consent', 'update', { 'analytics_storage': 'denied' });
    }

    // Apply marketing cookies (Facebook Pixel, etc.)
    if (consentSettings.marketing) {
      console.log("Marketing cookies enabled");
      // Example: gtag('consent', 'update', { 'ad_storage': 'granted' });
    } else {
      console.log("Marketing cookies disabled");
      // Example: gtag('consent', 'update', { 'ad_storage': 'denied' });
    }

    // Apply preference cookies
    if (consentSettings.preferences) {
      console.log("Preference cookies enabled");
    } else {
      console.log("Preference cookies disabled");
    }
  };

  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    setConsent(allConsent);
    localStorage.setItem("cookieConsent", JSON.stringify(allConsent));
    applyCookieSettings(allConsent);
    setShowBanner(false);
    setShowDetails(false);
  };

  const handleRejectAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    setConsent(minimalConsent);
    localStorage.setItem("cookieConsent", JSON.stringify(minimalConsent));
    applyCookieSettings(minimalConsent);
    setShowBanner(false);
    setShowDetails(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
    applyCookieSettings(consent);
    setShowBanner(false);
    setShowDetails(false);
  };

  const handleToggleConsent = (type) => {
    if (type === "necessary") return; // Cannot disable necessary cookies

    setConsent((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleShowSettings = () => {
    setShowBanner(true);
    setShowDetails(true);
  };

  // Expose the handleShowSettings function to parent components
  useImperativeHandle(ref, () => ({
    openSettings: handleShowSettings,
  }));

  if (!showBanner) {
    return null; // Don't render anything when banner is not shown
  }

  return (
    <>
      <div className="cookie-overlay" />
      <div className="cookie-consent-banner">
        <div className="cookie-banner-container">
          {!showDetails ? (
            // Simple Banner View
            <div className="cookie-simple-view">
              <div className="cookie-banner-content">
                <div className="cookie-banner-icon">🍪</div>
                <div className="cookie-banner-text">
                  <h3>{t("cookies.banner.title")}</h3>
                  <p>{t("cookies.banner.description")}</p>
                </div>
              </div>

              <div className="cookie-banner-actions">
                <button
                  className="cookie-btn cookie-btn-settings"
                  onClick={() => setShowDetails(true)}
                >
                  <FaCog /> {t("cookies.banner.settings")}
                </button>
                <button
                  className="cookie-btn cookie-btn-reject"
                  onClick={handleRejectAll}
                >
                  {t("cookies.banner.rejectAll")}
                </button>
                <button
                  className="cookie-btn cookie-btn-accept"
                  onClick={handleAcceptAll}
                >
                  {t("cookies.banner.acceptAll")}
                </button>
              </div>
            </div>
          ) : (
            // Detailed Settings View
            <div className="cookie-detailed-view">
              <div className="cookie-header">
                <div className="cookie-header-content">
                  <FaShieldAlt className="cookie-shield-icon" />
                  <h3>{t("cookies.preferences.title")}</h3>
                </div>
                <button
                  className="cookie-close-btn"
                  onClick={() => setShowDetails(false)}
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="cookie-content">
                <p className="cookie-description">
                  {t("cookies.preferences.description")}
                </p>

                <div className="cookie-categories">
                  <div className="cookie-category">
                    <div className="cookie-category-header">
                      <div className="cookie-category-info">
                        <h4>
                          <FaShieldAlt className="category-icon" />
                          {t("cookies.categories.necessary.title")}
                        </h4>
                        <p>{t("cookies.categories.necessary.description")}</p>
                      </div>
                      <div className="cookie-toggle">
                        <input
                          type="checkbox"
                          id="necessary"
                          checked={consent.necessary}
                          disabled={true}
                          readOnly
                        />
                        <label
                          htmlFor="necessary"
                          className="toggle-label disabled"
                        >
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="cookie-category">
                    <div className="cookie-category-header">
                      <div className="cookie-category-info">
                        <h4>
                          <FaInfoCircle className="category-icon" />
                          {t("cookies.categories.analytics.title")}
                        </h4>
                        <p>{t("cookies.categories.analytics.description")}</p>
                      </div>
                      <div className="cookie-toggle">
                        <input
                          type="checkbox"
                          id="analytics"
                          checked={consent.analytics}
                          onChange={() => handleToggleConsent("analytics")}
                        />
                        <label htmlFor="analytics" className="toggle-label">
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="cookie-category">
                    <div className="cookie-category-header">
                      <div className="cookie-category-info">
                        <h4>
                          <FaInfoCircle className="category-icon" />
                          {t("cookies.categories.marketing.title")}
                        </h4>
                        <p>{t("cookies.categories.marketing.description")}</p>
                      </div>
                      <div className="cookie-toggle">
                        <input
                          type="checkbox"
                          id="marketing"
                          checked={consent.marketing}
                          onChange={() => handleToggleConsent("marketing")}
                        />
                        <label htmlFor="marketing" className="toggle-label">
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="cookie-category">
                    <div className="cookie-category-header">
                      <div className="cookie-category-info">
                        <h4>
                          <FaInfoCircle className="category-icon" />
                          {t("cookies.categories.preferences.title")}
                        </h4>
                        <p>{t("cookies.categories.preferences.description")}</p>
                      </div>
                      <div className="cookie-toggle">
                        <input
                          type="checkbox"
                          id="preferences"
                          checked={consent.preferences}
                          onChange={() => handleToggleConsent("preferences")}
                        />
                        <label htmlFor="preferences" className="toggle-label">
                          <span className="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cookie-legal-info">
                  <p>
                    <strong>{t("cookies.legal.rightsTitle")}</strong>{" "}
                    {t("cookies.legal.rightsDescription")}{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("cookies.legal.privacyPolicyLink")}
                    </a>
                    .
                  </p>
                </div>
              </div>

              <div className="cookie-detailed-actions">
                <button
                  className="cookie-btn cookie-btn-reject"
                  onClick={handleRejectAll}
                >
                  {t("cookies.preferences.rejectAll")}
                </button>
                <button
                  className="cookie-btn cookie-btn-save"
                  onClick={handleSaveSettings}
                >
                  {t("cookies.preferences.saveSettings")}
                </button>
                <button
                  className="cookie-btn cookie-btn-accept"
                  onClick={handleAcceptAll}
                >
                  {t("cookies.preferences.acceptAll")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default CookieConsent;
