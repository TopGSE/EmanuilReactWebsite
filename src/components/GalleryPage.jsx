import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/GalleryPage.css";

function GalleryPage() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState({
    galleryView: false,
    featured: false,
  });

  // Track the currently featured/selected image
  const [featuredImageIndex, setFeaturedImageIndex] = useState(0);

  // All gallery images in a flat array
  const galleryImages = [
    {
      src: "/picture-emanuil-kids-hero.jpg",
      caption: "Sunday Worship",
      date: "April 2023",
    },
    {
      src: "/picture-emanuil-kids-aleks.jpg",
      caption: "Youth Group",
      date: "May 2023",
    },
    {
      src: "/picture-emanuil-kids-kartiza8mimart.jpg",
      caption: "Easter Celebration",
      date: "March 2023",
    },
    {
      src: "/picture-leader-aleks.jpg",
      caption: "Pastor's Message",
      date: "June 2023",
    },
    {
      src: "/church-hero.jpg",
      caption: "Our Church Building",
      date: "January 2023",
    },
    {
      src: "/picture-emanuil-kids-hero.jpg",
      caption: "Praise & Worship",
      date: "July 2023",
    },
    {
      src: "/picture-emanuil-kids-aleks.jpg",
      caption: "Children's Ministry",
      date: "August 2023",
    },
    {
      src: "/picture-emanuil-kids-kartiza8mimart.jpg",
      caption: "Community Outreach",
      date: "September 2023",
    },
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

    const sections = document.querySelectorAll(".gallery-section");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setFeaturedImageIndex(index);
  };

  // Navigation for featured image
  const handlePrevImage = () => {
    setFeaturedImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setFeaturedImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="gallery-container no-hero">
      {/* Content starts immediately - no hero section */}
      <div className="gallery-intro">
        <h1>{t("gallery.title")}</h1>
        <p className="gallery-description">{t("gallery.subtitle")}</p>
      </div>

      {/* Main Gallery View with Featured Image and Thumbnails */}
      <section
        className={`gallery-section gallery-view-section ${
          isVisible.galleryView ? "fade-in" : ""
        }`}
        data-section="galleryView"
      >
        <div className="container">
          <h2>{t("gallery.mainGallery.title")}</h2>

          <div className="gallery-layout">
            {/* Featured large image on the left */}
            <div className="featured-image-container">
              <div className="featured-image-wrapper">
                <img
                  src={galleryImages[featuredImageIndex].src}
                  alt={galleryImages[featuredImageIndex].caption}
                  className="featured-image"
                />

                <div className="featured-navigation">
                  <button className="nav-button prev" onClick={handlePrevImage}>
                    &lsaquo;
                  </button>
                  <button className="nav-button next" onClick={handleNextImage}>
                    &rsaquo;
                  </button>
                </div>

                <div className="featured-caption">
                  <h3>{galleryImages[featuredImageIndex].caption}</h3>
                  <p>{galleryImages[featuredImageIndex].date}</p>
                </div>
              </div>
            </div>

            {/* Thumbnails on the right */}
            <div className="thumbnails-container">
              <div className="thumbnails-grid">
                {galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${
                      featuredImageIndex === index ? "active" : ""
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img src={image.src} alt={image.caption} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GalleryPage;
