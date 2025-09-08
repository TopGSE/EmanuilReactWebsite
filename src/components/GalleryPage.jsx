import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/GalleryPageModern.css";

function GalleryPage() {
  const { t } = useTranslation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState("all");
  const [imageLoaded, setImageLoaded] = useState({});

  // Gallery images organized by categories
  const galleryImages = [
    {
      src: "/picture-emanuil-kids-hero.jpg",
      caption: "Sunday Worship Service",
      date: "April 2023",
      category: "worship",
      tags: ["worship", "community", "sunday"],
    },
    {
      src: "/picture-emanuil-kids-aleks.jpg",
      caption: "Youth Ministry",
      date: "May 2023",
      category: "youth",
      tags: ["youth", "ministry", "kids"],
    },
    {
      src: "/picture-emanuil-kids-kartiza8mimart.jpg",
      caption: "Easter Celebration",
      date: "March 2023",
      category: "events",
      tags: ["easter", "celebration", "community"],
    },
    {
      src: "/picture-leader-aleks.jpg",
      caption: "Pastor's Message",
      date: "June 2023",
      category: "leadership",
      tags: ["pastor", "leadership", "teaching"],
    },
    {
      src: "/church-hero.jpg",
      caption: "Our Church Building",
      date: "January 2023",
      category: "building",
      tags: ["church", "building", "architecture"],
    },
    {
      src: "/picture-emanuil-kids-hero.jpg",
      caption: "Praise & Worship",
      date: "July 2023",
      category: "worship",
      tags: ["praise", "worship", "music"],
    },
    {
      src: "/picture-emanuil-kids-aleks.jpg",
      caption: "Children's Ministry",
      date: "August 2023",
      category: "youth",
      tags: ["children", "ministry", "education"],
    },
    {
      src: "/picture-emanuil-kids-kartiza8mimart.jpg",
      caption: "Community Outreach",
      date: "September 2023",
      category: "events",
      tags: ["outreach", "community", "service"],
    },
  ];

  const categories = [
    { id: "all", label: "All Photos" },
    { id: "worship", label: "Worship" },
    { id: "youth", label: "Youth & Kids" },
    { id: "events", label: "Events" },
    { id: "leadership", label: "Leadership" },
    { id: "building", label: "Our Church" },
  ];

  // Filter images based on selected category
  const filteredImages =
    filter === "all"
      ? galleryImages
      : galleryImages.filter((image) => image.category === filter);

  // Animation when page comes into view
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle image loading
  const handleImageLoad = (index) => {
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };

  // Open lightbox
  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = "hidden";
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = "auto";
  };

  // Navigate in lightbox
  const navigateLightbox = (direction) => {
    const currentIndex = filteredImages.findIndex(
      (_, index) => index === selectedImageIndex
    );
    let newIndex;

    if (direction === "prev") {
      newIndex =
        currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    } else {
      newIndex =
        currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
    }

    setSelectedImageIndex(newIndex);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedImageIndex !== null) {
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") navigateLightbox("prev");
        if (e.key === "ArrowRight") navigateLightbox("next");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedImageIndex]);

  return (
    <div className="gallery-container">
      {/* Hero Section */}
      <div className={`gallery-hero ${isVisible ? "fade-in" : ""}`}>
        <div className="gallery-hero-content">
          <h1>{t("gallery.title")}</h1>
          <p>{t("gallery.subtitle")}</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className={`gallery-filters ${isVisible ? "fade-in" : ""}`}>
        <div className="container">
          <div className="filter-buttons">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`filter-btn ${
                  filter === category.id ? "active" : ""
                }`}
                onClick={() => setFilter(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className={`gallery-grid-section ${isVisible ? "fade-in" : ""}`}>
        <div className="container">
          <div className="gallery-grid">
            {filteredImages.map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className={`gallery-item ${imageLoaded[index] ? "loaded" : ""}`}
                onClick={() => openLightbox(index)}
              >
                <div className="gallery-item-inner">
                  <img
                    src={image.src}
                    alt={image.caption}
                    onLoad={() => handleImageLoad(index)}
                  />
                  <div className="gallery-item-overlay">
                    <div className="gallery-item-content">
                      <h3>{image.caption}</h3>
                      <p>{image.date}</p>
                      <div className="gallery-item-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {!imageLoaded[index] && (
                    <div className="gallery-item-skeleton">
                      <div className="skeleton-shimmer"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container">
            <button className="lightbox-close" onClick={closeLightbox}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              className="lightbox-nav prev"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("prev");
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              className="lightbox-nav next"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox("next");
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              className="lightbox-content"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[selectedImageIndex]?.src}
                alt={filteredImages[selectedImageIndex]?.caption}
              />
              <div className="lightbox-info">
                <h3>{filteredImages[selectedImageIndex]?.caption}</h3>
                <p>{filteredImages[selectedImageIndex]?.date}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleryPage;
