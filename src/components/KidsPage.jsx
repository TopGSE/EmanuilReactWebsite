import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/KidsPage.css";
import {
  FaStar,
  FaPuzzlePiece,
  FaMusic,
  FaBook,
  FaHandPaper,
  FaQuoteLeft,
} from "react-icons/fa";

function KidsPage() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState({
    intro: false,
    whatWeDo: false,
    gallery: false,
  });

  // Interactive elements state
  const [bubblePositions, setBubblePositions] = useState([]);
  const [showStar, setShowStar] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Daily Bible verse
  const [dailyVerseIndex, setDailyVerseIndex] = useState(0);

  // Sample images for the gallery - replace with your actual images
  const galleryImages = [
    "/picture-emanuil-kids-hero.jpg",
    "/picture-emanuil-kids-kartiza8mimart.jpg",
    "/picture-emanuil-kids-aleks.jpg",
    "/picture-emanuil-kids-hero.jpg",
    "/picture-emanuil-kids-aleks.jpg",
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

  // Generate random bubbles and select daily Bible verse on load
  useEffect(() => {
    // Generate random bubbles
    const bubbles = Array.from({ length: 15 }, () => ({
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 70 + 15}%`,
      size: `${Math.random() * 30 + 20}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 5 + 5}s`,
    }));

    setBubblePositions(bubbles);

    // Show star after a delay
    setTimeout(() => {
      setShowStar(true);
    }, 2000);

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

  const handleBubblePop = (index) => {
    // Create a copy of the bubblePositions array
    const updatedBubbles = [...bubblePositions];
    // Mark the bubble as popped by setting a popped property
    updatedBubbles[index] = { ...updatedBubbles[index], popped: true };
    setBubblePositions(updatedBubbles);

    // After animation, remove the bubble
    setTimeout(() => {
      const filtered = bubblePositions.filter((_, i) => i !== index);
      setBubblePositions(filtered);
    }, 500);
  };

  return (
    <div className="kids-container no-hero">
      {/* Content starts immediately - no hero section */}
      <div className="kids-intro">
        <h1>{t("kids.title")}</h1>
        <p className="kids-description">{t("kids.subtitle")}</p>
      </div>

      {/* Introduction Section with Playful Elements */}
      <section
        className={`kids-section intro-section ${
          isVisible.intro ? "fade-in" : ""
        }`}
        data-section="intro"
      >
        <div className="crayon-border"></div>
        <div className="section-container">
          <div className="section-content">
            <h2 className="wiggle-text">{t("kids.intro.title")}</h2>
            <p className="handwritten-style">{t("kids.intro.description1")}</p>
            <p className="handwritten-style">{t("kids.intro.description2")}</p>

            {/* Bible verse box - updated with daily verse */}
            <div className="fun-fact-container bible-verse-container">
              <div className="fun-fact-icon">
                <FaQuoteLeft className="quote-icon" />
              </div>
              <div className="bible-verse">
                <p className="verse-title">{t("kids.intro.funFactTitle")}</p>
                <p className="verse-text">
                  {t(`kids.intro.bibleVerses.${dailyVerseIndex}`)}
                </p>
              </div>
            </div>
          </div>
          <div className="section-image happy-kids-image jump-animation">
            <div className="image-decoration top-left"></div>
            <div className="image-decoration top-right"></div>
            <div className="image-decoration bottom-left"></div>
            <div className="image-decoration bottom-right"></div>
          </div>
        </div>
      </section>

      {/* What We Did This Week Gallery with Playful Controls */}
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
            <button
              className="carousel-btn prev crayon-button"
              onClick={prevSlide}
            >
              <span className="btn-face">&#10094;</span>
            </button>

            <div className="carousel-content">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className={`carousel-slide ${
                    index === activeSlide ? "active" : ""
                  }`}
                >
                  <div className="polaroid-frame">
                    <img src={image} alt={`Kids activity ${index + 1}`} />
                  </div>
                  <div className="slide-caption">
                    <h3>{t(`kids.gallery.slides.${index}.title`)}</h3>
                    <p>{t(`kids.gallery.slides.${index}.description`)}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="carousel-btn next crayon-button"
              onClick={nextSlide}
            >
              <span className="btn-face">&#10095;</span>
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

      {/* What We Do Section with Animated Icons */}
      <section
        className={`kids-section what-we-do-section ${
          isVisible.whatWeDo ? "fade-in" : ""
        }`}
        data-section="whatWeDo"
      >
        <div className="paper-background">
          <div className="paper-holes"></div>
          <h2>{t("kids.activities.title")}</h2>
          <div className="activities-grid">
            <div className="activity-card pop-on-hover">
              <div className="activity-icon-wrapper">
                <FaBook className="activity-icon-react" />
              </div>
              <h3 className="marker-text">
                {t("kids.activities.bible.title")}
              </h3>
              <p>{t("kids.activities.bible.description")}</p>
            </div>

            <div className="activity-card pop-on-hover">
              <div className="activity-icon-wrapper">
                <FaPuzzlePiece className="activity-icon-react" />
              </div>
              <h3 className="marker-text">
                {t("kids.activities.crafts.title")}
              </h3>
              <p>{t("kids.activities.crafts.description")}</p>
            </div>

            <div className="activity-card pop-on-hover">
              <div className="activity-icon-wrapper">
                <FaHandPaper className="activity-icon-react" />
              </div>
              <h3 className="marker-text">
                {t("kids.activities.games.title")}
              </h3>
              <p>{t("kids.activities.games.description")}</p>
            </div>

            <div className="activity-card pop-on-hover">
              <div className="activity-icon-wrapper">
                <FaMusic className="activity-icon-react" />
              </div>
              <h3 className="marker-text">
                {t("kids.activities.music.title")}
              </h3>
              <p>{t("kids.activities.music.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Removed sections: 
         - Weekly Schedule section
         - Team section with Cartoon-style Images
         - Contact / Sign Up Section with Playful Buttons
      */}
    </div>
  );
}

export default KidsPage;
