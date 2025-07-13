import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./App.css";
import "./styles/shared.css";
import "./i18n/i18n"; // Import i18n configuration
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Welcome from "./components/Welcome";
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";
import KidsPage from "./components/KidsPage";
import ServicesPage from "./components/ServicesPage";
import EventsPage from "./components/EventsPage";
import GalleryPage from "./components/GalleryPage";
import LanguagePopup from "./components/LanguagePopup"; // Import the new component
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(window.location.pathname);

  // Show the popup only if the user hasn't selected a language
  const [showLanguagePopup, setShowLanguagePopup] = useState(() => {
    return !localStorage.getItem("hasSelectedLanguage");
  });

  // No need for language popup logic here, handled in useState and handleLanguageSelect

  // Simplify your useEffect hooks to avoid duplication

  // Keep only one useEffect for handling navigation and scroll behavior
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setCurrentPage(path);
      // Scroll to top on navigation change
      window.scrollTo(0, 0);
    };

    // Listen for navigation events
    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("pushstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("pushstate", handleLocationChange);
    };
  }, []);

  const navigate = (path) => {
    // Scroll to top when navigating
    window.scrollTo(0, 0);

    // Update the current page
    setCurrentPage(path);

    // Update browser history
    window.history.pushState({}, "", path);
  };

  const handleLanguageSelect = (language) => {
    i18n.changeLanguage(language);

    // Still save the preference, but don't check it on load
    localStorage.setItem("hasSelectedLanguage", "true");
    localStorage.setItem("preferredLanguage", language);

    setShowLanguagePopup(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "/about":
        return <AboutUs />;
      case "/contact":
        return <Contact />;
      case "/kids":
        return <KidsPage />;
      case "/gallery":
        return <GalleryPage />;
      case "/services":
        return <ServicesPage />;
      case "/events":
        return <EventsPage />;
      case "/terms":
        return (
          <div className="legal-page">
            <h1>{t("legal.terms.title")}</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: t("legal.terms.content"),
              }}
            />
          </div>
        );
      case "/privacy":
        return (
          <div className="legal-page">
            <h1>{t("legal.privacy.title")}</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: t("legal.privacy.content"),
              }}
            />
          </div>
        );
      default:
        return (
          <>
            <Hero />
            <Welcome onNavigate={navigate} />
          </>
        );
    }
  };

  return (
    <div className="app">
      <header>
        <Navbar onNavigate={navigate} />
      </header>

      <main>{renderPage()}</main>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>{t("footer.church")}</h3>
            <p>{t("footer.address")}</p>
            <p>{t("footer.city")}</p>
            <p>{t("footer.phone")}</p>
          </div>

          <div className="footer-section">
            <h3>{t("footer.services")}</h3>
            <p>{t("footer.sunday")}</p>
            <p>{t("footer.wednesday")}</p>
          </div>

          <div className="footer-section">
            <h3>{t("footer.connect")}</h3>
            <div className="social-links">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="footer-legal">
          <div className="legal-links">
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                navigate("/terms");
              }}
            >
              {t("footer.terms")}
            </a>
            <span className="separator">|</span>
            <a
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                navigate("/privacy");
              }}
            >
              {t("footer.privacy")}
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} {t("footer.church")}.{" "}
            {t("footer.rights")}
          </p>
        </div>
      </footer>

      {showLanguagePopup && (
        <LanguagePopup
          isOpen={showLanguagePopup}
          onClose={() => setShowLanguagePopup(false)}
          onSelectLanguage={handleLanguageSelect}
        />
      )}
      <ScrollToTop />
    </div>
  );
}

export default App;
