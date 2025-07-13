import { useTranslation } from "react-i18next";
import "../styles/Hero.css";

function Hero() {
  const { t } = useTranslation();

  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>{t("main.welcome")}</h1>
          <p>{t("main.join")}</p>
          <button
            className="hero-button"
            onClick={() => (window.location.href = "/about")}
          >
            {t("main.learnMore")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
