import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/ServicesPage.css";

function ServicesPage() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState({
    sunday: false,
    midweek: false,
    special: false,
    participate: false,
    testimony: false,
  });

  // Animation when sections come into view
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

    const sections = document.querySelectorAll(".services-section");
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
    <div className="services-container">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="services-hero-overlay">
          <div className="services-hero-content">
            <h1>{t("services.title")}</h1>
            <p>{t("services.subtitle")}</p>
          </div>
        </div>
      </section>

      {/* Sunday Service Section */}
      <section
        className={`services-section sunday-section ${
          isVisible.sunday ? "fade-in" : ""
        }`}
        data-section="sunday"
      >
        <div className="services-section-container">
          <div className="services-section-content">
            <h2>{t("services.sunday.title")}</h2>
            <p className="services-tagline">{t("services.sunday.tagline")}</p>
            <p>{t("services.sunday.description")}</p>
            <div className="service-details">
              <div className="service-detail-item">
                <div className="service-icon time-icon"></div>
                <h3>{t("services.time")}</h3>
                <p>{t("services.sunday.time")}</p>
              </div>
              <div className="service-detail-item">
                <div className="service-icon location-icon"></div>
                <h3>{t("services.location")}</h3>
                <p>{t("services.address")}</p>
              </div>
            </div>
            <div className="service-schedule-list">
              <h3>{t("services.sunday.schedule")}</h3>
              <div className="schedule-item">
                <span className="schedule-time">9:30 AM</span>
                <span className="schedule-activity">
                  {t("services.sunday.scheduleItems.worship")}
                </span>
              </div>
              <div className="schedule-item">
                <span className="schedule-time">10:00 AM</span>
                <span className="schedule-activity">
                  {t("services.sunday.scheduleItems.message")}
                </span>
              </div>
              <div className="schedule-item">
                <span className="schedule-time">11:15 AM</span>
                <span className="schedule-activity">
                  {t("services.sunday.scheduleItems.fellowship")}
                </span>
              </div>
              <div className="schedule-item">
                <span className="schedule-time">11:30 AM</span>
                <span className="schedule-activity">
                  {t("services.sunday.scheduleItems.children")}
                </span>
              </div>
            </div>
          </div>
          <div className="services-section-image sunday-image"></div>
        </div>
      </section>

      {/* Midweek Services */}
      <section
        className={`services-section midweek-section ${
          isVisible.midweek ? "fade-in" : ""
        }`}
        data-section="midweek"
      >
        <div className="services-section-container reverse">
          <div className="services-section-image midweek-image"></div>
          <div className="services-section-content">
            <h2>{t("services.midweek.title")}</h2>
            <p className="services-tagline">{t("services.midweek.tagline")}</p>
            <p>{t("services.midweek.description")}</p>
            <div className="service-details">
              <div className="service-detail-item">
                <div className="service-icon time-icon"></div>
                <h3>{t("services.time")}</h3>
                <p>{t("services.midweek.time")}</p>
              </div>
              <div className="service-detail-item">
                <div className="service-icon location-icon"></div>
                <h3>{t("services.location")}</h3>
                <p>{t("services.address")}</p>
              </div>
            </div>
            <div className="service-topics-list">
              <h3>{t("services.midweek.topics")}</h3>
              <div className="topic-grid">
                <div className="topic-item">
                  <div className="topic-icon bible-study"></div>
                  <p>{t("services.midweek.topicItems.bibleStudy")}</p>
                </div>
                <div className="topic-item">
                  <div className="topic-icon prayer"></div>
                  <p>{t("services.midweek.topicItems.prayer")}</p>
                </div>
                <div className="topic-item">
                  <div className="topic-icon fellowship"></div>
                  <p>{t("services.midweek.topicItems.fellowship")}</p>
                </div>
                <div className="topic-item">
                  <div className="topic-icon worship"></div>
                  <p>{t("services.midweek.topicItems.worship")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Services */}
      <section
        className={`services-section special-section ${
          isVisible.special ? "fade-in" : ""
        }`}
        data-section="special"
      >
        <h2 className="section-title">{t("services.special.title")}</h2>
        <p className="section-description">
          {t("services.special.description")}
        </p>

        <div className="special-services-grid">
          <div className="special-service-card">
            <div className="special-service-image communion-image"></div>
            <div className="special-service-content">
              <h3>{t("services.special.communion.title")}</h3>
              <p>{t("services.special.communion.description")}</p>
              <p className="special-service-time">
                {t("services.special.communion.time")}
              </p>
            </div>
          </div>

          <div className="special-service-card">
            <div className="special-service-image baptism-image"></div>
            <div className="special-service-content">
              <h3>{t("services.special.baptism.title")}</h3>
              <p>{t("services.special.baptism.description")}</p>
              <p className="special-service-time">
                {t("services.special.baptism.time")}
              </p>
            </div>
          </div>

          <div className="special-service-card">
            <div className="special-service-image holiday-image"></div>
            <div className="special-service-content">
              <h3>{t("services.special.holiday.title")}</h3>
              <p>{t("services.special.holiday.description")}</p>
              <p className="special-service-time">
                {t("services.special.holiday.time")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Participation Section */}
      <section
        className={`services-section participate-section ${
          isVisible.participate ? "fade-in" : ""
        }`}
        data-section="participate"
      >
        <div className="participate-container">
          <h2 className="section-title">{t("services.participate.title")}</h2>
          <p className="section-description">
            {t("services.participate.description")}
          </p>

          <div className="participate-grid">
            <div className="participate-card">
              <div className="participate-icon worship-team"></div>
              <h3>{t("services.participate.worship.title")}</h3>
              <p>{t("services.participate.worship.description")}</p>
              <button className="participate-button">
                {t("services.participate.worship.button")}
              </button>
            </div>

            <div className="participate-card">
              <div className="participate-icon volunteering"></div>
              <h3>{t("services.participate.volunteer.title")}</h3>
              <p>{t("services.participate.volunteer.description")}</p>
              <button className="participate-button">
                {t("services.participate.volunteer.button")}
              </button>
            </div>

            <div className="participate-card">
              <div className="participate-icon prayer-team"></div>
              <h3>{t("services.participate.prayer.title")}</h3>
              <p>{t("services.participate.prayer.description")}</p>
              <button className="participate-button">
                {t("services.participate.prayer.button")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonies Section */}
      <section
        className={`services-section testimony-section ${
          isVisible.testimony ? "fade-in" : ""
        }`}
        data-section="testimony"
      >
        <div className="testimony-container">
          <h2 className="section-title">{t("services.testimonies.title")}</h2>
          <p className="section-description">
            {t("services.testimonies.description")}
          </p>

          <div className="testimonies-slider">
            <div className="testimony-card">
              <div className="testimony-quote">
                <blockquote>{t("services.testimonies.quote1")}</blockquote>
              </div>
              <div className="testimony-author">
                <div className="testimony-image author1"></div>
                <div className="testimony-info">
                  <h4>{t("services.testimonies.author1")}</h4>
                  <p>{t("services.testimonies.role1")}</p>
                </div>
              </div>
            </div>

            <div className="testimony-card">
              <div className="testimony-quote">
                <blockquote>{t("services.testimonies.quote2")}</blockquote>
              </div>
              <div className="testimony-author">
                <div className="testimony-image author2"></div>
                <div className="testimony-info">
                  <h4>{t("services.testimonies.author2")}</h4>
                  <p>{t("services.testimonies.role2")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="services-cta">
        <div className="cta-content">
          <h2>{t("services.cta.title")}</h2>
          <p>{t("services.cta.text")}</p>
          <button className="cta-button">{t("services.cta.button")}</button>
        </div>
      </section>
    </div>
  );
}

export default ServicesPage;
