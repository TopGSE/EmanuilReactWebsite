import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/AboutUs.css";
// Import icons
import {
  FaHeart,
  FaGlobeAmericas,
  FaBook,
  FaHandsHelping,
} from "react-icons/fa";

function AboutUs() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState({
    mission: false,
    history: false,
    team: false,
    beliefs: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.dataset.section]: true,
            }));
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll(".about-section");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="about-container no-hero">
      {/* Mission Section - Starting immediately without intro */}
      <section
        className={`about-section ${isVisible.mission ? "fade-in" : ""}`}
        data-section="mission"
      >
        <div className="section-container reverse">
          <div className="section-image mission-image"></div>
          <div className="section-content">
            <h2>{t("about.mission.title")}</h2>
            <p>{t("about.mission.p1")}</p>
            <p>{t("about.mission.p2")}</p>
          </div>
        </div>
      </section>

      {/* History Section - Timeline removed */}
      <section
        className={`about-section ${isVisible.history ? "fade-in" : ""}`}
        data-section="history"
      >
        <div className="section-container">
          <div className="section-content">
            <h2>{t("about.history.title")}</h2>
            <p>{t("about.history.p1")}</p>
            <p>{t("about.history.p2")}</p>
            <p>{t("about.history.p3")}</p>
          </div>
          <div className="section-image history-image"></div>
        </div>
      </section>

      {/* Leadership Team */}
      <section
        className={`about-section team-section ${
          isVisible.team ? "fade-in" : ""
        }`}
        data-section="team"
      >
        <h2>{t("about.team.title")}</h2>
        <p className="team-intro">{t("about.team.intro")}</p>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-image pastor"></div>
            <h3>{t("about.team.pastor.name")}</h3>
            <p className="member-role">{t("about.team.pastor.role")}</p>
            <p>{t("about.team.pastor.description")}</p>
          </div>
          <div className="team-member">
            <div className="member-image elder1"></div>
            <h3>{t("about.team.deacon.name")}</h3>
            <p className="member-role">{t("about.team.deacon.role")}</p>
            <p>{t("about.team.deacon.description")}</p>
          </div>
          <div className="team-member">
            <div className="member-image elder2"></div>
            <h3>{t("about.team.worship.name")}</h3>
            <p className="member-role">{t("about.team.worship.role")}</p>
            <p>{t("about.team.worship.description")}</p>
          </div>
        </div>
      </section>

      {/* Core Beliefs */}
      <section
        className={`about-section beliefs-section ${
          isVisible.beliefs ? "fade-in" : ""
        }`}
        data-section="beliefs"
      >
        <h2>{t("about.beliefs.title")}</h2>
        <div className="beliefs-grid">
          <div className="belief-card">
            <div className="belief-icon">
              <FaHeart />
            </div>
            <h3>{t("about.beliefs.cards.love.title")}</h3>
            <p>{t("about.beliefs.cards.love.description")}</p>
          </div>
          <div className="belief-card">
            <div className="belief-icon">
              <FaGlobeAmericas />
            </div>
            <h3>{t("about.beliefs.cards.community.title")}</h3>
            <p>{t("about.beliefs.cards.community.description")}</p>
          </div>
          <div className="belief-card">
            <div className="belief-icon">
              <FaBook />
            </div>
            <h3>{t("about.beliefs.cards.scripture.title")}</h3>
            <p>{t("about.beliefs.cards.scripture.description")}</p>
          </div>
          <div className="belief-card">
            <div className="belief-icon">
              <FaHandsHelping />
            </div>
            <h3>{t("about.beliefs.cards.service.title")}</h3>
            <p>{t("about.beliefs.cards.service.description")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
