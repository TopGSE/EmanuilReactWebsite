import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/KidsPage.css";
import {
  FaStar,
  FaPuzzlePiece,
  FaMusic,
  FaBook,
  FaHandPaper,
} from "react-icons/fa";

function KidsPage() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState({
    intro: false,
    whatWeDo: false,
    schedule: false,
    gallery: false,
    team: false,
  });

  // Interactive elements state
  const [bubblePositions, setBubblePositions] = useState([]);
  const [showStar, setShowStar] = useState(false);
  // Add the missing activeSlide state
  const [activeSlide, setActiveSlide] = useState(0);

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

  // Generate random bubbles on load
  useEffect(() => {
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

  const handleBubblePop = (index) => {
    // Create a copy of the bubblePositions array
    const updatedBubbles = [...bubblePositions];
    // Mark the bubble as popped by setting a popped property
    updatedBubbles[index] = { ...updatedBubbles[index], popped: true };
    setBubblePositions(updatedBubbles);

    // Play pop sound
    const popSound = new Audio("/sounds/pop.mp3");
    popSound.play();

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

            {/* Interactive element */}
            <div className="fun-fact-container">
              <div className="fun-fact-icon">
                <FaStar className="star-icon spin" />
              </div>
              <p className="fun-fact">{t("kids.intro.funFact")}</p>
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
        <h2 className="gallery-title crayon-text">{t("kids.gallery.title")}</h2>
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
          <h2 className="crayon-text">{t("kids.activities.title")}</h2>
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

      {/* Weekly Schedule with Enhanced Clouds */}
      <section
        className={`kids-section schedule-section ${
          isVisible.schedule ? "fade-in" : ""
        }`}
        data-section="schedule"
      >
        <div className="clouds-background">
          <div className="cloud cloud1 move"></div>
          <div className="cloud cloud2 move"></div>
          <div className="cloud cloud3 move"></div>
          <div className="sun"></div>
        </div>

        <div className="schedule-content">
          <h2 className="rainbow-text">{t("kids.schedule.title")}</h2>
          <div className="schedule-grid">
            <div className="schedule-card flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="day-icon sunday"></div>
                  <h3>{t("kids.schedule.sunday.title")}</h3>
                </div>
                <div className="flip-card-back">
                  <p className="time-text">{t("kids.schedule.sunday.time")}</p>
                  <p>{t("kids.schedule.sunday.description")}</p>
                </div>
              </div>
            </div>

            <div className="schedule-card flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="day-icon wednesday"></div>
                  <h3>{t("kids.schedule.wednesday.title")}</h3>
                </div>
                <div className="flip-card-back">
                  <p className="time-text">
                    {t("kids.schedule.wednesday.time")}
                  </p>
                  <p>{t("kids.schedule.wednesday.description")}</p>
                </div>
              </div>
            </div>

            <div className="schedule-card flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div className="day-icon special"></div>
                  <h3>{t("kids.schedule.special.title")}</h3>
                </div>
                <div className="flip-card-back">
                  <p className="time-text">{t("kids.schedule.special.time")}</p>
                  <p>{t("kids.schedule.special.description")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team with Cartoon-style Images */}
      <section
        className={`kids-section team-section ${
          isVisible.team ? "fade-in" : ""
        }`}
        data-section="team"
      >
        <div className="confetti-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
              }}
            ></div>
          ))}
        </div>

        <h2 className="chalk-text">{t("kids.team.title")}</h2>
        <div className="team-grid">
          <div className="team-member tilt-on-hover">
            <div className="team-image-wrapper cartoon-border">
              <img
                src="/picture-leader-aleks.jpg"
                alt="Алекс Михайлов"
                className="team-photo"
              />
              <div className="character-accessory hat"></div>
            </div>
            <h3 className="marker-text">Алекс Михайлов</h3>
            <p className="team-role">{t("kids.team.leader")}</p>
            <p>{t("kids.team.leader1Description")}</p>
            <div className="team-speech-bubble">
              <p>"I love helping kids discover Jesus!"</p>
            </div>
          </div>

          <div className="team-member tilt-on-hover">
            <div className="team-image-wrapper cartoon-border">
              <div className="team-image leader2"></div>
              <div className="character-accessory glasses"></div>
            </div>
            <h3 className="marker-text">Денис</h3>
            <p className="team-role">{t("kids.team.assistant")}</p>
            <p>{t("kids.team.leader2Description")}</p>
            <div className="team-speech-bubble">
              <p>"Games are my favorite way to teach!"</p>
            </div>
          </div>

          <div className="team-member tilt-on-hover">
            <div className="team-image-wrapper cartoon-border">
              <div className="team-image leader3"></div>
              <div className="character-accessory bow"></div>
            </div>
            <h3 className="marker-text">Фани Михова</h3>
            <p className="team-role">{t("kids.team.volunteer")}</p>
            <p>{t("kids.team.leader3Description")}</p>
            <div className="team-speech-bubble">
              <p>"Let's make crafts and have fun!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Sign Up Section with Playful Buttons */}
      <section className="kids-cta">
        <div className="cta-content">
          <h2 className="bouncy-text">{t("kids.cta.title")}</h2>
          <p className="handwritten-style">{t("kids.cta.description")}</p>
          <div className="crayon-line"></div>
          <div className="cta-buttons">
            <button className="cta-button register crayon-button">
              <span className="btn-face">{t("kids.cta.register")}</span>
            </button>
            <button className="cta-button contact crayon-button">
              <span className="btn-face">{t("kids.cta.contact")}</span>
            </button>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="grass-decoration"></div>
        <div className="flower flower1"></div>
        <div className="flower flower2"></div>
        <div className="flower flower3"></div>
      </section>
    </div>
  );
}

export default KidsPage;
