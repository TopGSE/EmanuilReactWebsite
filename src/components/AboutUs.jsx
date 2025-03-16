import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/AboutUs.css";

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
                  <h4>1995</h4>
                  <p>Church foundation</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2005</h4>
                  <p>Building our current sanctuary</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>2015</h4>
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
            <h3>Pastor John Doe</h3>
            <p className="member-role">Lead Pastor</p>
            <p>
              Leading our congregation with 20+ years of experience and a heart
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z" />
              </svg>
            </div>
            <h3>{t("about.beliefs.cards.love.title")}</h3>
            <p>{t("about.beliefs.cards.love.description")}</p>
          </div>
          <div className="belief-card">
            <div className="belief-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z" />
              </svg>
            </div>
            <h3>{t("about.beliefs.cards.community.title")}</h3>
            <p>{t("about.beliefs.cards.community.description")}</p>
          </div>
          <div className="belief-card">
            <div className="belief-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.513 7.119c.958-1.143 1.487-2.577 1.487-4.036v-3.083h-16v3.083c0 1.459.528 2.892 1.487 4.035l3.087 3.68c.566.677.57 1.625.009 2.306l-3.13 3.794c-.937 1.136-1.453 2.555-1.453 3.992v3.11h16v-3.11c0-1.437-.517-2.856-1.453-3.992l-3.13-3.794c-.562-.681-.558-1.629.009-2.306l3.087-3.679zm-.513-4.12c0 1.101-.363 2.05-1.02 2.834l-.978 1.167h-8.004l-.978-1.167c-.66-.785-1.02-1.736-1.02-2.834h12zm-.996 15.172c.652.791.996 1.725.996 2.829h-1.061c-1.939-2-4.939-2-4.939-2s-3 0-4.939 2h-1.061c0-1.104.344-2.039.996-2.829l3.129-3.793c.342-.415.571-.886.711-1.377h.164v1h2v-1h.163c.141.491.369.962.711 1.376l3.13 3.794zm-6.004-1.171h2v1h-2v-1zm0-2h2v1h-2v-1z" />
              </svg>
            </div>
            <h3>{t("about.beliefs.cards.scripture.title")}</h3>
            <p>{t("about.beliefs.cards.scripture.description")}</p>
          </div>
          <div className="belief-card">
            <div className="belief-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 4.419c-2.826-5.695-11.999-4.064-11.999 3.27 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-7.327-9.17-8.972-12-3.27z" />
              </svg>
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
