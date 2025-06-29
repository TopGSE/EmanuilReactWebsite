import { useTranslation } from "react-i18next";
import "../styles/Welcome.css";

function Welcome({ onNavigate }) {
  const { t } = useTranslation();

  // Add a navigation handler function
  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      // Fallback if onNavigate isn't available
      window.history.pushState({}, "", path);
      // Trigger a navigation event so App.jsx can detect it
      window.dispatchEvent(new Event("pushstate"));
    }
  };

  return (
    <section className="welcome-section">
      <div className="welcome-container">
        {/* Title, subtitle, and video section removed */}

        <div className="welcome-content">
          <div className="welcome-card">
            <h2>{t("welcome.cards.service.title")}</h2>
            <p>{t("welcome.cards.service.description")}</p>
            <button
              className="btn-primary"
              onClick={() => handleNavigation("/services")}
            >
              {t("welcome.cards.service.button")}
            </button>
          </div>
          <div className="welcome-card">
            <h2>{t("welcome.cards.mission.title")}</h2>
            <p>{t("welcome.cards.mission.description")}</p>
            <button
              className="btn-primary"
              onClick={() => handleNavigation("/about")}
            >
              {t("welcome.cards.mission.button")}
            </button>
          </div>
          <div className="welcome-card">
            <h2>{t("welcome.cards.involved.title")}</h2>
            <p>{t("welcome.cards.involved.description")}</p>
            <button
              className="btn-primary"
              onClick={() => handleNavigation("/kids")}
            >
              {t("welcome.cards.involved.button")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Welcome;
