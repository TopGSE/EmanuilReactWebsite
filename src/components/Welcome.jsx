import { useTranslation } from "react-i18next";
import "../styles/Welcome.css";

function Welcome() {
  const { t } = useTranslation();

  return (
    <section className="welcome-section">
      <div className="welcome-container">
        {/* Title, subtitle, and video section removed */}

        <div className="welcome-content">
          <div className="welcome-card">
            <h2>{t("welcome.cards.service.title")}</h2>
            <p>{t("welcome.cards.service.description")}</p>
            <button className="btn-primary">
              {t("welcome.cards.service.button")}
            </button>
          </div>
          <div className="welcome-card">
            <h2>{t("welcome.cards.mission.title")}</h2>
            <p>{t("welcome.cards.mission.description")}</p>
            <button className="btn-primary">
              {t("welcome.cards.mission.button")}
            </button>
          </div>
          <div className="welcome-card">
            <h2>{t("welcome.cards.involved.title")}</h2>
            <p>{t("welcome.cards.involved.description")}</p>
            <button className="btn-primary">
              {t("welcome.cards.involved.button")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Welcome;
