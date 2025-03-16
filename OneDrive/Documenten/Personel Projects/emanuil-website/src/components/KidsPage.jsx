import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/KidsPage.css";

function KidsPage() {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({
    intro: false,
    whatWeDo: false,
    gallery: false,
    schedule: false,
    team: false,
  });

  // Sample images for the gallery - replace with your actual images
  const galleryImages = [
    "/picture-emanuil-kids-hero.jpg",
    "/picture-emanuil-kids-kartiza8mimart.jpg",
    "/picture-emanuil-kids-aleks.jpg",
    "/kids-gallery-4.jpg",
    "/kids-gallery-5.jpg",
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

    const sections = document.querySelectorAll(".kids-section");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Auto advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) =>
        current === galleryImages.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const nextSlide = () => {
    setActiveSlide((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setActiveSlide((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1
    );
  };

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  return (
    <div className="kids-container">
      {/* Hero Section */}
      <section className="kids-hero">
        <div className="kids-hero-overlay">
          <div className="kids-hero-content">
            <h1 className="animated-title">{t("kids.title")}</h1>
            <p className="subtitle-animation">{t("kids.subtitle")}</p>
            <div className="floating-balloons">
              <div className="balloon balloon-red"></div>
              <div className="balloon balloon-blue"></div>
              <div className="balloon balloon-yellow"></div>
              <div className="balloon balloon-green"></div>
              <div className="balloon balloon-purple"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section
        className={`kids-section intro-section ${
          isVisible.intro ? "fade-in" : ""
        }`}
        data-section="intro"
      >
        <div className="section-container">
          <div className="section-content">
            <h2>{t("kids.intro.title")}</h2>
            <p>{t("kids.intro.description1")}</p>
            <p>{t("kids.intro.description2")}</p>
          </div>
          <div className="section-image happy-kids-image">
          </div>
        </div>
      </section>

      {/* What We Did This Week Gallery */}
      <section
        className={`kids-section gallery-section ${
          isVisible.gallery ? "fade-in" : ""
        }`}
        data-section="gallery"
      >
        <h2 className="gallery-title">{t("kids.gallery.title")}</h2>
        <p className="gallery-description">{t("kids.gallery.description")}</p>

        <div className="carousel-container">
          <div className="carousel-wrapper">
            <button className="carousel-btn prev" onClick={prevSlide}>
              &#10094;
            </button>

            <div className="carousel-content">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className={`carousel-slide ${
                    index === activeSlide ? "active" : ""
                  }`}
                >
                  <img src={image} alt={`Kids activity ${index + 1}`} />
                  <div className="slide-caption">
                    <h3>{t(`kids.gallery.slides.${index}.title`)}</h3>
                    <p>{t(`kids.gallery.slides.${index}.description`)}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="carousel-btn next" onClick={nextSlide}>
              &#10095;
            </button>
          </div>

          <div className="carousel-dots">
            {galleryImages.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === activeSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section
        className={`kids-section what-we-do-section ${
          isVisible.whatWeDo ? "fade-in" : ""
        }`}
        data-section="whatWeDo"
      >
        <h2>{t("kids.activities.title")}</h2>
        <div className="activities-grid">
          <div className="activity-card">
            <div className="activity-icon bible"></div>
            <h3>{t("kids.activities.bible.title")}</h3>
            <p>{t("kids.activities.bible.description")}</p>
          </div>

          <div className="activity-card">
            <div className="activity-icon crafts"></div>
            <h3>{t("kids.activities.crafts.title")}</h3>
            <p>{t("kids.activities.crafts.description")}</p>
          </div>

          <div className="activity-card">
            <div className="activity-icon games"></div>
            <h3>{t("kids.activities.games.title")}</h3>
            <p>{t("kids.activities.games.description")}</p>
          </div>

          <div className="activity-card">
            <div className="activity-icon music"></div>
            <h3>{t("kids.activities.music.title")}</h3>
            <p>{t("kids.activities.music.description")}</p>
          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section
        className={`kids-section schedule-section ${
          isVisible.schedule ? "fade-in" : ""
        }`}
        data-section="schedule"
      >
        <div className="clouds-background">
          <div className="cloud cloud1"></div>
          <div className="cloud cloud2"></div>
          <div className="cloud cloud3"></div>
        </div>

        <div className="schedule-content">
          <h2>{t("kids.schedule.title")}</h2>
          <div className="schedule-grid">
            <div className="schedule-card">
              <div className="day-icon sunday"></div>
              <h3>{t("kids.schedule.sunday.title")}</h3>
              <p>{t("kids.schedule.sunday.time")}</p>
              <p>{t("kids.schedule.sunday.description")}</p>
            </div>

            <div className="schedule-card">
              <div className="day-icon wednesday"></div>
              <h3>{t("kids.schedule.wednesday.title")}</h3>
              <p>{t("kids.schedule.wednesday.time")}</p>
              <p>{t("kids.schedule.wednesday.description")}</p>
            </div>

            <div className="schedule-card">
              <div className="day-icon special"></div>
              <h3>{t("kids.schedule.special.title")}</h3>
              <p>{t("kids.schedule.special.time")}</p>
              <p>{t("kids.schedule.special.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section
        className={`kids-section team-section ${
          isVisible.team ? "fade-in" : ""
        }`}
        data-section="team"
      >
        <h2>{t("kids.team.title")}</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="team-image-wrapper">
              <img
                src="/picture-leader-aleks.jpg"
                alt="Алекс Михайлов"
                className="team-photo"
              />
            </div>
            <h3>Алекс Михайлов</h3>
            <p className="team-role">{t("kids.team.leader")}</p>
            <p>{t("kids.team.leader1Description")}</p>
          </div>

          <div className="team-member">
            <div className="team-image leader2"></div>
            <h3>Денис</h3>
            <p className="team-role">{t("kids.team.assistant")}</p>
            <p>{t("kids.team.leader2Description")}</p>
          </div>

          <div className="team-member">
            <div className="team-image leader3"></div>
            <h3>Фани Михова</h3>
            <p className="team-role">{t("kids.team.volunteer")}</p>
            <p>{t("kids.team.leader3Description")}</p>
          </div>
        </div>
      </section>

      {/* Contact / Sign Up Section */}
      <section className="kids-cta">
        <div className="cta-content">
          <h2>{t("kids.cta.title")}</h2>
          <p>{t("kids.cta.description")}</p>
          <div className="cta-buttons">
            <button className="cta-button register">
              {t("kids.cta.register")}
            </button>
            <button className="cta-button contact">
              {t("kids.cta.contact")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default KidsPage;
