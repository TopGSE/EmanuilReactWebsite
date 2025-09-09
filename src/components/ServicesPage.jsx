import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/ServicesPage.css";
import HeroCarousel from "./HeroCarousel";
import {
  FaClock,
  FaMapMarkerAlt,
  FaBible,
  FaPray,
  FaUsers,
  FaMusic,
  FaHandsHelping,
  FaHands,
} from "react-icons/fa";

function ServicesPage({ onNavigate }) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState({
    sunday: false,
    midweek: false,
    special: false,
    participate: false,
  });

  const handleNavigateToContact = () => {
    if (onNavigate) {
      onNavigate("/contact");
    }
  };

  // Images for the hero carousel
  const carouselImages = [
    { src: "/Photo Church Closeup People.jpg", alt: "Church Community" },
    { src: "/Photo Kids Easter.jpg", alt: "Kids Easter Celebration" },
    { src: "/Photo Worship Team_3.jpg", alt: "Worship Team" },
  ];

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
      {/* Hero Carousel */}
      <HeroCarousel images={carouselImages} />

      {/* Sunday Service Section */}
      <section
        className={`services-section sunday-section ${
          isVisible.sunday ? "fade-in" : ""
        }`}
        data-section="sunday"
      >
        <div className="sunday-section-wrapper">
          <div className="sunday-content-grid">
            <div className="sunday-main-content">
              <h2>{t("services.sunday.title")}</h2>
              <p className="services-tagline">{t("services.sunday.tagline")}</p>
              <p>{t("services.sunday.description")}</p>
            </div>

            <div className="sunday-details-grid">
              <div className="schedule-card">
                <h3>{t("services.sunday.schedule")}</h3>
                <div className="schedule-timeline">
                  <div className="schedule-item">
                    <span className="schedule-time">11:00 AM</span>
                    <span className="schedule-activity">
                      {t("services.sunday.scheduleItems.worship")}
                    </span>
                  </div>
                  <div className="schedule-item">
                    <span className="schedule-time">12:00 PM</span>
                    <span className="schedule-activity">
                      {t("services.sunday.scheduleItems.message")}
                    </span>
                  </div>
                  <div className="schedule-item">
                    <span className="schedule-time">13:00 PM</span>
                    <span className="schedule-activity">
                      {t("services.sunday.scheduleItems.fellowship")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Midweek Services */}
      <section
        className={`services-section midweek-section ${
          isVisible.midweek ? "fade-in" : ""
        }`}
        data-section="midweek"
      >
        <div className="midweek-section-wrapper">
          <div className="midweek-content-grid">
            <div className="midweek-main-content">
              <h2>{t("services.midweek.title")}</h2>
              <p className="services-tagline">
                {t("services.midweek.tagline")}
              </p>
              <p>{t("services.midweek.description")}</p>
            </div>

            <div className="midweek-details-grid">
              <div className="bible-verse">
                <blockquote>{t("services.midweek.verse")}</blockquote>
                <cite>- {t("services.midweek.verseReference")}</cite>
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
            <div className="special-service-image communion-image">
              <img
                src="\Photo Kids Vodno.jpg"
                alt="Church Full Communion Service"
              />
            </div>
            <div className="special-service-content">
              <h3>{t("services.special.communion.title")}</h3>
              <p>{t("services.special.communion.description")}</p>
              <p className="special-service-time">
                {t("services.special.communion.time")}
              </p>
            </div>
          </div>

          <div className="special-service-card">
            <div className="special-service-image baptism-image">
              <img
                src="/Photo Hristofor Vodno.jpg"
                alt="Baptism at Hristofor Vodno"
              />
            </div>
            <div className="special-service-content">
              <h3>{t("services.special.baptism.title")}</h3>
              <p>{t("services.special.baptism.description")}</p>
              <p className="special-service-time">
                {t("services.special.baptism.time")}
              </p>
            </div>
          </div>

          <div className="special-service-card">
            <div className="special-service-image holiday-image">
              <img
                src="/Photo Kids Rojdestvo.jpg"
                alt="Kids Christmas Service"
              />
            </div>
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
              <FaMusic className="service-icon-react" />
              <h3>{t("services.participate.worship.title")}</h3>
              <p>{t("services.participate.worship.description")}</p>
              <button
                className="participate-button"
                onClick={handleNavigateToContact}
              >
                {t("services.participate.worship.button")}
              </button>
            </div>

            <div className="participate-card">
              <FaHandsHelping className="service-icon-react" />
              <h3>{t("services.participate.volunteer.title")}</h3>
              <p>{t("services.participate.volunteer.description")}</p>
              <button
                className="participate-button"
                onClick={handleNavigateToContact}
              >
                {t("services.participate.volunteer.button")}
              </button>
            </div>

            <div className="participate-card">
              <FaHands className="service-icon-react" />
              <h3>{t("services.participate.prayer.title")}</h3>
              <p>{t("services.participate.prayer.description")}</p>
              <button
                className="participate-button"
                onClick={handleNavigateToContact}
              >
                {t("services.participate.prayer.button")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action section removed */}
    </div>
  );
}

export default ServicesPage;
