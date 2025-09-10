import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/HeroCarousel.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function HeroCarousel({ images }) {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotation functionality
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  // Navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Play/Pause removed

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Slides */}
      <div className="carousel-slides">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${
              index === currentImageIndex ? "active" : ""
            }`}
          >
            <img src={image.src} alt={image.alt} className="carousel-image" />
            <div className="carousel-overlay"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="hero-content">
        <div className="hero-content-wrapper">
          <h1 className="hero-title">{t("services.hero.title")}</h1>
          <p className="hero-subtitle">{t("services.hero.subtitle")}</p>
          <div className="hero-cta">
            <button className="hero-btn secondary">
              {t("services.hero.visitUs")}
            </button>
            <button className="hero-btn primary">
              {t("services.hero.joinUs")}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        className="carousel-nav carousel-nav-prev"
        onClick={prevImage}
        aria-label="Previous image"
      >
        <FaChevronLeft className="nav-icon" />
      </button>

      <button
        className="carousel-nav carousel-nav-next"
        onClick={nextImage}
        aria-label="Next image"
      >
        <FaChevronRight className="nav-icon" />
      </button>

      {/* Play/Pause removed */}
    </div>
  );
}

export default HeroCarousel;
