import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/KidsPage.css";
import {
  FaStar,
  FaPuzzlePiece,
  FaMusic,
  FaBook,
  FaHandPaper,
  FaQuoteLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaUsers,
} from "react-icons/fa";

function KidsPage() {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [dailyVerseIndex, setDailyVerseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Sample images for the gallery
  const galleryImages = [
    "/picture-emanuil-kids-hero.jpg",
    "/picture-emanuil-kids-kartiza8mimart.jpg",
    "/picture-emanuil-kids-aleks.jpg",
    "/picture-emanuil-kids-hero.jpg",
    "/picture-emanuil-kids-aleks.jpg",
  ];

  // Intersection Observer for scroll animations
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
      { threshold: 0.1 }
    );

    document.querySelectorAll("[data-section]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();

    // Get daily Bible verse based on the current date
    const bibleVerses = t("kids.intro.bibleVerses", { returnObjects: true });
    const verseCount = bibleVerses.length;

    // Use current date to generate a consistent index for the day
    const today = new Date();
    const dayOfYear = getDayOfYear(today);

    // Use the day of the year modulo the number of verses to get today's verse
    const todayVerseIndex = dayOfYear % verseCount;
    setDailyVerseIndex(todayVerseIndex);
  }, [t]);

  // Helper function to get the day of the year (1-366)
  const getDayOfYear = (date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

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
    <div className="kids-page-energetic">
      {/* Hero Section - Modern Vibrant */}
      <section className="hero-section-modern">
        <div className="hero-wave-bg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#8B5CF6"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,154.7C384,149,480,107,576,101.3C672,96,768,128,864,144C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>

        <div className="container-energetic">
          <div className="hero-content-wrapper">
            <div className="hero-text-section">
              <div className="hero-badge-modern">
                <FaStar className="badge-star" />
                <span>{t("kidsPage.hero.label", "Kids Ministry")}</span>
              </div>

              <h1 className="hero-main-title">{t("kids.title")}</h1>
              <p className="hero-main-description">{t("kids.subtitle")}</p>

              <div className="hero-info-cards">
                <div className="info-card purple-card">
                  <FaCalendarAlt />
                  <div>
                    <span className="info-label">
                      {t("kidsPage.hero.whenLabel", "When")}
                    </span>
                    <span className="info-value">
                      {t("kidsPage.hero.badge1", "Every Sunday")}
                    </span>
                  </div>
                </div>
                <div className="info-card pink-card">
                  <FaClock />
                  <div>
                    <span className="info-label">
                      {t("kidsPage.hero.timeLabel", "Time")}
                    </span>
                    <span className="info-value">
                      {t("kidsPage.hero.badge2", "10:00 AM")}
                    </span>
                  </div>
                </div>
                <div className="info-card blue-card">
                  <FaUsers />
                  <div>
                    <span className="info-label">
                      {t("kidsPage.hero.ageLabel", "Ages")}
                    </span>
                    <span className="info-value">
                      {t("kidsPage.hero.badge3", "4-12 Years")}
                    </span>
                  </div>
                </div>
              </div>

              <button className="hero-cta-btn">
                <span>{t("kidsPage.hero.cta", "Join Our Kids Club")}</span>
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section
        className={`welcome-section-energetic ${
          isVisible.welcome ? "visible" : ""
        }`}
        data-section="welcome"
      >
        <div className="container-energetic">
          <div className="welcome-layout">
            <div className="welcome-text-side">
              <h2 className="section-heading">{t("kids.intro.title")}</h2>
              <p className="section-text">{t("kids.intro.description1")}</p>
              <p className="section-text">{t("kids.intro.description2")}</p>
            </div>
            <div className="welcome-verse-card">
              <div className="verse-icon">
                <FaQuoteLeft />
              </div>
              <p className="verse-label">{t("kids.intro.funFactTitle")}</p>
              <p className="verse-text">
                {t(`kids.intro.bibleVerses.${dailyVerseIndex}`)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section - Colorful Grid */}
      <section
        className={`activities-section-energetic ${
          isVisible.activities ? "visible" : ""
        }`}
        data-section="activities"
      >
        <div className="container-energetic">
          <h2 className="section-heading centered">
            {t("kids.activities.title")}
          </h2>

          <div className="activities-grid-energetic">
            <div className="activity-tile purple">
              <div className="tile-icon">
                <FaBook />
              </div>
              <h3>{t("kids.activities.bible.title")}</h3>
              <p>{t("kids.activities.bible.description")}</p>
              <div className="tile-number">01</div>
            </div>

            <div className="activity-tile pink">
              <div className="tile-icon">
                <FaPuzzlePiece />
              </div>
              <h3>{t("kids.activities.crafts.title")}</h3>
              <p>{t("kids.activities.crafts.description")}</p>
              <div className="tile-number">02</div>
            </div>

            <div className="activity-tile blue">
              <div className="tile-icon">
                <FaHandPaper />
              </div>
              <h3>{t("kids.activities.games.title")}</h3>
              <p>{t("kids.activities.games.description")}</p>
              <div className="tile-number">03</div>
            </div>

            <div className="activity-tile orange">
              <div className="tile-icon">
                <FaMusic />
              </div>
              <h3>{t("kids.activities.music.title")}</h3>
              <p>{t("kids.activities.music.description")}</p>
              <div className="tile-number">04</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section-energetic">
        <div className="cta-background-circles">
          <div className="circle-decoration c1"></div>
          <div className="circle-decoration c2"></div>
          <div className="circle-decoration c3"></div>
        </div>

        <div className="cta-content">
          <h2>Come Join the Adventure!</h2>
          <p>
            Be part of our vibrant community where kids learn, play, and grow in
            faith together
          </p>
          <div className="cta-buttons">
            <button className="cta-btn primary">
              Register Now
              <FaArrowRight />
            </button>
            <button className="cta-btn secondary">Contact Us</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default KidsPage;
