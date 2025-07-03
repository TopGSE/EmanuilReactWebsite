import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import "../styles/Welcome.css";
import { FaChurch, FaHeart, FaChild, FaChevronRight } from "react-icons/fa";

function Welcome({ onNavigate }) {
  const { t } = useTranslation();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimated(true);
  }, []);

  // Navigation handler function
  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, "", path);
      window.dispatchEvent(new Event("pushstate"));
    }
  };

  return (
    <section className="welcome-section">
      <div className="welcome-background-overlay"></div>
      <div className="welcome-container">
        <div className="welcome-header">
          <h2 className={`welcome-subtitle ${animated ? "animate-in" : ""}`}>
            {t("welcome.subtitle")}
          </h2>
        </div>

        <div
          className={`welcome-content ${animated ? "cards-animate-in" : ""}`}
        >
          <div className="welcome-card service-card">
            <div className="card-icon">
              <FaChurch />
            </div>
            <div className="card-content">
              <h2>{t("welcome.cards.service.title")}</h2>
              <p>{t("welcome.cards.service.description")}</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => handleNavigation("/services")}
            >
              {t("welcome.cards.service.button")}
              <FaChevronRight className="btn-icon" />
            </button>
          </div>

          <div className="welcome-card mission-card">
            <div className="card-icon">
              <FaHeart />
            </div>
            <div className="card-content">
              <h2>{t("welcome.cards.mission.title")}</h2>
              <p>{t("welcome.cards.mission.description")}</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => handleNavigation("/about")}
            >
              {t("welcome.cards.mission.button")}
              <FaChevronRight className="btn-icon" />
            </button>
          </div>

          <div className="welcome-card involved-card">
            <div className="card-icon">
              <FaChild />
            </div>
            <div className="card-content">
              <h2>{t("welcome.cards.involved.title")}</h2>
              <p>{t("welcome.cards.involved.description")}</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => handleNavigation("/kids")}
            >
              {t("welcome.cards.involved.button")}
              <FaChevronRight className="btn-icon" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Welcome;
