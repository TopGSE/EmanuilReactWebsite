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

function App() {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(window.location.pathname);

  // Always show the popup on refresh for testing purposes
  const [showLanguagePopup, setShowLanguagePopup] = useState(true);

  useEffect(() => {
    // Remove the localStorage check so popup always appears
    // (The original code is commented out below for reference)

    // const hasSelectedLanguage = localStorage.getItem("hasSelectedLanguage");
    // if (!hasSelectedLanguage) {
    //   setShowLanguagePopup(true);
    // }

    const handleLocation = () => {
      setCurrentPage(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocation);
    window.addEventListener("pushstate", handleLocation);

    return () => {
      window.removeEventListener("popstate", handleLocation);
      window.removeEventListener("pushstate", handleLocation);
    };
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPage(path);
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
      <LanguagePopup
        isOpen={showLanguagePopup}
        onClose={() => setShowLanguagePopup(false)}
        onSelectLanguage={handleLanguageSelect}
      />

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
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} {t("footer.church")}.{" "}
            {t("footer.rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
