import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/EventsPage.css";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCalendarDay,
  FaTimes,
  FaChevronDown,
  FaArrowLeft,
} from "react-icons/fa";

function EventsPage() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState({
    featured: false,
    upcoming: false,
    regular: false,
    calendar: false,
  });

  const [activeTab, setActiveTab] = useState("all");
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);

  // Sample events data
  const sampleEvents = {
    // September 2025 Events
    "2025-09-07": {
      title: "Sunday Morning Service",
      time: "10:00 AM",
      description:
        "Regular Sunday worship service with communion and fellowship.",
      image: "/church-hero.jpg",
      category: "Worship Service",
      location: "Main Sanctuary",
    },
    "2025-09-10": {
      title: "Wednesday Prayer Meeting",
      time: "7:00 PM",
      description: "Midweek prayer meeting and Bible study session.",
      image: "/picture-leader-aleks.jpg",
      category: "Prayer Meeting",
      location: "Fellowship Hall",
    },
    "2025-09-14": {
      title: "Youth Group Meeting",
      time: "6:00 PM",
      description:
        "Monthly youth ministry meeting with activities and discussion.",
      image: "/picture-emanuil-kids-aleks.jpg",
      category: "Youth Ministry",
      location: "Youth Room",
    },
    "2025-09-21": {
      title: "Community Outreach",
      time: "9:00 AM",
      description: "Community service project and local outreach activities.",
      image: "/picture-emanuil-kids-hero.jpg",
      category: "Community Service",
      location: "Community Center",
    },
    "2025-09-28": {
      title: "Family Fellowship Dinner",
      time: "5:00 PM",
      description: "Monthly family dinner with fellowship and entertainment.",
      image: "/picture-emanuil-kids-kartiza8mimart.jpg",
      category: "Family Event",
      location: "Church Hall",
    },
  };

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

  // Calendar helper functions
  const openCalendarPopup = () => {
    setShowCalendarPopup(true);
    document.body.style.overflow = "hidden";

    // Check if today has an event and auto-select it
    const today = new Date();
    const todayKey = formatDateKey(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    if (sampleEvents[todayKey]) {
      setSelectedDate({
        day: today.getDate(),
        event: sampleEvents[todayKey],
      });
    }
  };

  const closeCalendarPopup = () => {
    setShowCalendarPopup(false);
    setSelectedDate(null);
    setShowMonthDropdown(false);
    setShowEventDetails(false);
    document.body.style.overflow = "unset";
  };

  const toggleMonthDropdown = () => {
    setShowMonthDropdown(!showMonthDropdown);
  };

  const selectMonthYear = (year, month) => {
    setCurrentDate(new Date(year, month, 1));
    setSelectedDate(null);
    setShowMonthDropdown(false);
  };

  const generateMonthOptions = () => {
    const options = [];

    // Generate options for 2025 only (focused on current year)
    const year = 2025;
    for (let month = 0; month < 12; month++) {
      options.push({
        year,
        month,
        label: new Date(year, month).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
      });
    }
    return options;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const hasEvent = (year, month, day) => {
    const dateKey = formatDateKey(year, month, day);
    return sampleEvents[dateKey] !== undefined;
  };

  const selectDate = (day) => {
    const dateKey = formatDateKey(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    if (sampleEvents[dateKey]) {
      setSelectedDate({
        day,
        event: sampleEvents[dateKey],
      });
      // On mobile, show event details view when a date with event is selected
      if (window.innerWidth <= 768) {
        setShowEventDetails(true);
      }
      // On desktop, the event details show in the right panel automatically
    } else {
      // If no event, clear selection
      setSelectedDate(null);
    }
  };

  // Function to go back from event details to calendar view
  const backToCalendar = () => {
    setShowEventDetails(false);
  };

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
    <div className="events-container no-hero">
      {/* Content starts immediately - no hero section */}
      <div className="events-intro">
        <h1>{t("events.title")}</h1>
        <p className="events-description">{t("events.subtitle")}</p>
      </div>

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
              <button onClick={openCalendarPopup} className="calendar-button">
                {t("events.calendar.view")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Popup */}
      {showCalendarPopup && (
        <div className="calendar-popup-overlay" onClick={closeCalendarPopup}>
          <div className="calendar-popup" onClick={(e) => e.stopPropagation()}>
            {showEventDetails && selectedDate ? (
              <>
                {/* Event Details View (Mobile) */}
                <div className="calendar-popup-header event-details-header">
                  <button className="back-button" onClick={backToCalendar}>
                    <FaArrowLeft />
                    <span>Back</span>
                  </button>

                  <h3 className="event-header-title">
                    {selectedDate.event.category}
                  </h3>

                  <button
                    className="calendar-close"
                    onClick={closeCalendarPopup}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="calendar-content event-details-fullscreen">
                  <div
                    className="event-card-image-full"
                    style={{
                      backgroundImage: `url(${selectedDate.event.image})`,
                    }}
                  ></div>
                  <div className="event-card-content-full">
                    <h4 className="event-title">{selectedDate.event.title}</h4>
                    <div className="event-meta">
                      <div className="event-time">
                        <FaClock className="meta-icon" />
                        <span>{selectedDate.event.time}</span>
                      </div>
                      <div className="event-location">
                        <FaMapMarkerAlt className="meta-icon" />
                        <span>{selectedDate.event.location}</span>
                      </div>
                      <div className="event-date">
                        <FaCalendarAlt className="meta-icon" />
                        <span>{`${currentDate.toLocaleString("default", {
                          month: "long",
                        })} ${
                          selectedDate.day
                        }, ${currentDate.getFullYear()}`}</span>
                      </div>
                    </div>
                    <p className="event-description">
                      {selectedDate.event.description}
                    </p>
                    <button className="event-register-btn">Register Now</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Calendar View */}
                <div className="calendar-popup-header">
                  <div className="calendar-dropdown-container">
                    <button
                      className="calendar-dropdown-trigger"
                      onClick={toggleMonthDropdown}
                    >
                      {currentDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                      <FaChevronDown
                        className={`dropdown-arrow ${
                          showMonthDropdown ? "open" : ""
                        }`}
                      />
                    </button>

                    {showMonthDropdown && (
                      <div className="calendar-dropdown-menu">
                        {generateMonthOptions().map((option) => (
                          <div
                            key={`${option.year}-${option.month}`}
                            className={`dropdown-option ${
                              currentDate.getFullYear() === option.year &&
                              currentDate.getMonth() === option.month
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              selectMonthYear(option.year, option.month)
                            }
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    className="calendar-close"
                    onClick={closeCalendarPopup}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="calendar-content calendar-only-view">
                  <div className="calendar-left-panel">
                    <div className="calendar-grid-container">
                      <div className="calendar-weekdays">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                      </div>

                      <div className="calendar-grid">
                        {Array.from(
                          { length: getFirstDayOfMonth(currentDate) },
                          (_, i) => (
                            <div
                              key={`empty-${i}`}
                              className="calendar-day empty"
                            ></div>
                          )
                        )}

                        {Array.from(
                          { length: getDaysInMonth(currentDate) },
                          (_, i) => {
                            const day = i + 1;
                            const hasEventToday = hasEvent(
                              currentDate.getFullYear(),
                              currentDate.getMonth(),
                              day
                            );
                            return (
                              <div
                                key={day}
                                className={`calendar-day ${
                                  hasEventToday ? "has-event" : ""
                                } ${
                                  selectedDate?.day === day ? "selected" : ""
                                }`}
                                onClick={() => selectDate(day)}
                              >
                                <span>{day}</span>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="calendar-right-panel">
                    <div
                      className={`calendar-event-details ${
                        selectedDate ? "has-event" : "no-event"
                      }`}
                    >
                      {selectedDate ? (
                        <>
                          <div
                            className="event-details-image"
                            style={{
                              backgroundImage: `url(${selectedDate.event.image})`,
                            }}
                          ></div>
                          <div className="event-details-content">
                            <h4>{selectedDate.event.title}</h4>
                            <div className="event-details-meta">
                              <div className="event-details-meta-item">
                                <FaClock className="meta-icon" />
                                <span>{selectedDate.event.time}</span>
                              </div>
                              <div className="event-details-meta-item">
                                <FaMapMarkerAlt className="meta-icon" />
                                <span>{selectedDate.event.location}</span>
                              </div>
                              <div className="event-details-meta-item">
                                <FaCalendarAlt className="meta-icon" />
                                <span>{`${currentDate.toLocaleString(
                                  "default",
                                  {
                                    month: "long",
                                  }
                                )} ${
                                  selectedDate.day
                                }, ${currentDate.getFullYear()}`}</span>
                              </div>
                            </div>
                            <p className="event-details-description">
                              {selectedDate.event.description}
                            </p>
                            <button className="event-details-register">
                              Register Now
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <FaCalendarDay className="calendar-icon" />
                          <h4>Select a Date</h4>
                          <p>Click on a date with an event to view details</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventsPage;
