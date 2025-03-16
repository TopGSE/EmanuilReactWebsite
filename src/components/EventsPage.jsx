import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/EventsPage.css";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCalendarDay,
} from "react-icons/fa";

function EventsPage() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState({
    featured: false,
    upcoming: false,
    regular: false,
    past: false,
    calendar: false,
  });

  const [activeTab, setActiveTab] = useState("all");

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

    const sections = document.querySelectorAll(".events-section");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Sample upcoming events data - replace with your real events
  const upcomingEvents = [
    {
      id: 1,
      title: t("events.upcoming.event1.title"),
      date: t("events.upcoming.event1.date"),
      time: t("events.upcoming.event1.time"),
      location: t("events.upcoming.event1.location"),
      description: t("events.upcoming.event1.description"),
      image: "/picture-emanuil-kids-hero.jpg", // Using existing image
      category: "worship",
    },
    {
      id: 2,
      title: t("events.upcoming.event2.title"),
      date: t("events.upcoming.event2.date"),
      time: t("events.upcoming.event2.time"),
      location: t("events.upcoming.event2.location"),
      description: t("events.upcoming.event2.description"),
      image: "/picture-emanuil-kids-aleks.jpg", // Using existing image
      category: "bible",
    },
    {
      id: 3,
      title: t("events.upcoming.event3.title"),
      date: t("events.upcoming.event3.date"),
      time: t("events.upcoming.event3.time"),
      location: t("events.upcoming.event3.location"),
      description: t("events.upcoming.event3.description"),
      image: "/picture-emanuil-kids-kartiza8mimart.jpg", // Using existing image
      category: "community",
    },
    {
      id: 4,
      title: t("events.upcoming.event4.title"),
      date: t("events.upcoming.event4.date"),
      time: t("events.upcoming.event4.time"),
      location: t("events.upcoming.event4.location"),
      description: t("events.upcoming.event4.description"),
      image: "/picture-leader-aleks.jpg", // Using existing image
      category: "youth",
    },
  ];

  // Filter events based on active tab
  const filteredEvents =
    activeTab === "all"
      ? upcomingEvents
      : upcomingEvents.filter((event) => event.category === activeTab);

  return (
    <div className="events-container">
      {/* Hero Section */}
      <section className="events-hero">
        <div className="events-hero-overlay">
          <div className="events-hero-content">
            <h1>{t("events.title")}</h1>
            <p>{t("events.subtitle")}</p>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      <section
        className={`events-section featured-section ${
          isVisible.featured ? "fade-in" : ""
        }`}
        data-section="featured"
      >
        <div className="featured-container">
          <div className="featured-content">
            <div className="featured-label">{t("events.featured.label")}</div>
            <h2>{t("events.featured.title")}</h2>
            <p className="featured-date">
              <FaCalendarAlt className="event-icon" />
              {t("events.featured.date")}
            </p>
            <p className="featured-time">
              <FaClock className="event-icon" />
              {t("events.featured.time")}
            </p>
            <p className="featured-location">
              <FaMapMarkerAlt className="event-icon" />
              {t("events.featured.location")}
            </p>
            <p className="featured-description">
              {t("events.featured.description")}
            </p>
            <button className="featured-button">{t("events.register")}</button>
          </div>
          <div className="featured-image"></div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section
        className={`events-section upcoming-section ${
          isVisible.upcoming ? "fade-in" : ""
        }`}
        data-section="upcoming"
      >
        <h2 className="section-title">{t("events.upcoming.title")}</h2>
        <p className="section-description">
          {t("events.upcoming.description")}
        </p>

        {/* Category Filter Tabs */}
        <div className="events-filter">
          <button
            className={`filter-button ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            {t("events.filters.all")}
          </button>
          <button
            className={`filter-button ${
              activeTab === "worship" ? "active" : ""
            }`}
            onClick={() => setActiveTab("worship")}
          >
            {t("events.filters.worship")}
          </button>
          <button
            className={`filter-button ${activeTab === "bible" ? "active" : ""}`}
            onClick={() => setActiveTab("bible")}
          >
            {t("events.filters.bible")}
          </button>
          <button
            className={`filter-button ${
              activeTab === "community" ? "active" : ""
            }`}
            onClick={() => setActiveTab("community")}
          >
            {t("events.filters.community")}
          </button>
          <button
            className={`filter-button ${activeTab === "youth" ? "active" : ""}`}
            onClick={() => setActiveTab("youth")}
          >
            {t("events.filters.youth")}
          </button>
        </div>

        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div className="event-card" key={event.id}>
              <div
                className="event-image"
                style={{ backgroundImage: `url(${event.image})` }}
              ></div>
              <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-info">
                  <FaCalendarAlt className="event-icon" /> {event.date}
                </p>
                <p className="event-info">
                  <FaClock className="event-icon" /> {event.time}
                </p>
                <p className="event-info">
                  <FaMapMarkerAlt className="event-icon" /> {event.location}
                </p>
                <p className="event-description">{event.description}</p>
                <button className="event-button">
                  {t("events.learnMore")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Regular Events */}
      <section
        className={`events-section regular-section ${
          isVisible.regular ? "fade-in" : ""
        }`}
        data-section="regular"
      >
        <h2 className="section-title">{t("events.regular.title")}</h2>
        <p className="section-description">{t("events.regular.description")}</p>

        <div className="regular-events-grid">
          <div className="regular-event-card">
            <div className="regular-event-day">
              {t("events.regular.sunday.day")}
            </div>
            <h3>{t("events.regular.sunday.title")}</h3>
            <div className="regular-event-time">
              {t("events.regular.sunday.time")}
            </div>
            <p>{t("events.regular.sunday.description")}</p>
          </div>

          <div className="regular-event-card">
            <div className="regular-event-day">
              {t("events.regular.wednesday.day")}
            </div>
            <h3>{t("events.regular.wednesday.title")}</h3>
            <div className="regular-event-time">
              {t("events.regular.wednesday.time")}
            </div>
            <p>{t("events.regular.wednesday.description")}</p>
          </div>

          <div className="regular-event-card">
            <div className="regular-event-day">
              {t("events.regular.friday.day")}
            </div>
            <h3>{t("events.regular.friday.title")}</h3>
            <div className="regular-event-time">
              {t("events.regular.friday.time")}
            </div>
            <p>{t("events.regular.friday.description")}</p>
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section
        className={`events-section past-section ${
          isVisible.past ? "fade-in" : ""
        }`}
        data-section="past"
      >
        <h2 className="section-title">{t("events.past.title")}</h2>
        <p className="section-description">{t("events.past.description")}</p>

        <div className="past-events-gallery">
          <div className="gallery-item gallery-item-1">
            <div className="gallery-overlay">
              <h4>{t("events.past.event1")}</h4>
            </div>
          </div>
          <div className="gallery-item gallery-item-2">
            <div className="gallery-overlay">
              <h4>{t("events.past.event2")}</h4>
            </div>
          </div>
          <div className="gallery-item gallery-item-3">
            <div className="gallery-overlay">
              <h4>{t("events.past.event3")}</h4>
            </div>
          </div>
          <div className="gallery-item gallery-item-4">
            <div className="gallery-overlay">
              <h4>{t("events.past.event4")}</h4>
            </div>
          </div>
          <div className="gallery-item gallery-item-5">
            <div className="gallery-overlay">
              <h4>{t("events.past.event5")}</h4>
            </div>
          </div>
          <div className="gallery-item gallery-item-6">
            <div className="gallery-overlay">
              <h4>{t("events.past.event6")}</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section
        className={`events-section calendar-section ${
          isVisible.calendar ? "fade-in" : ""
        }`}
        data-section="calendar"
      >
        <div className="calendar-container">
          <h2 className="section-title">{t("events.calendar.title")}</h2>
          <p className="section-description">
            {t("events.calendar.description")}
          </p>

          <div className="calendar-embed">
            <div className="calendar-placeholder">
              <FaCalendarDay className="calendar-icon" />
              <h3>{t("events.calendar.embed")}</h3>
              <p>{t("events.calendar.instruction")}</p>
              <a
                href="#"
                className="calendar-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("events.calendar.view")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="events-cta">
        <div className="cta-content">
          <h2>{t("events.cta.title")}</h2>
          <p>{t("events.cta.description")}</p>
          <div className="cta-buttons">
            <a href="#" className="cta-button primary">
              {t("events.cta.subscribe")}
            </a>
            <a href="#" className="cta-button secondary">
              {t("events.cta.contact")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EventsPage;
