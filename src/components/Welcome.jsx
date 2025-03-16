import { useTranslation } from "react-i18next";
import "../styles/Welcome.css";
import FacebookVideo from "./FacebookVideo";

function Welcome() {
  const { t } = useTranslation();

  // Replace this URL with your most recent Facebook video URL
  const latestVideoUrl = "https://fb.watch/yj95JNTSZ_/";

  return (
    <section className="welcome-section">
      <div className="welcome-container">
        <h1 className="welcome-title">{t("welcome.title")}</h1>
        <p className="welcome-subtitle">{t("welcome.subtitle")}</p>

        {/* Facebook Video */}
        <div className="welcome-video-section">
          <h2>{t("welcome.latestVideo")}</h2>
          <FacebookVideo videoUrl={latestVideoUrl} />
        </div>

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
