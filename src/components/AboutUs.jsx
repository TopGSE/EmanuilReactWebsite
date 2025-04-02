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
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>{t("about.title")}</h1>
          <p>{t("about.subtitle")}</p>
        </div>
      </section>

      {/* Mission Section */}
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

      {/* History Section */}
      <section
        className={`about-section ${isVisible.history ? "fade-in" : ""}`}
        data-section="history"
      >
        <div className="section-container">
          <div className="section-content">
            <h2>{t("about.history.title")}</h2>
            <p>{t("about.history.p1")}</p>
            <p>{t("about.history.p2")}</p>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2011</h4>
                  <p>Church foundation</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2015</h4>
                  <p>Building our current sanctuary</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2020</h4>
                  <p>Community outreach expansion</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Today</h4>
                  <p>Continuing our mission</p>
                </div>
              </div>
            </div>
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
            <h3>Pastor Angel Ekov</h3>
            <p className="member-role">Lead Pastor</p>
            <p>
              Leading our congregation with 10+ years of experience and a heart
              for community service.
            </p>
          </div>
          <div className="team-member">
            <div className="member-image elder1"></div>
            <h3>Jane Smith</h3>
            <p className="member-role">Worship Director</p>
            <p>
              Bringing our worship services to life with passion and musical
              talent since 2010.
            </p>
          </div>
          <div className="team-member">
            <div className="member-image elder2"></div>
            <h3>Michael Johnson</h3>
            <p className="member-role">Youth Pastor</p>
            <p>
              Dedicated to guiding our youth through their faith journey with
              energy and understanding.
            </p>
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

      {/* Call to Action */}
      <section className="about-cta">
        <div className="cta-content">
          <h2>{t("about.cta.title")}</h2>
          <p>{t("about.cta.text")}</p>
          <button className="cta-button">{t("about.cta.button")}</button>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
