import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Navbar.css";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar({ onNavigate, currentPage }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (path, e) => {
    e.preventDefault();
    onNavigate(path);
    setIsOpen(false);
  };

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo on the left */}
        <div className="navbar-logo" onClick={(e) => handleNavClick("/", e)}>
          <img
            src="/church-logo.png"
            alt={t("navbar.title") + " logo"}
            className="navbar-logo-img"
            style={{ height: "48px", width: "auto" }}
          />
        </div>

        {/* Nav links in the center (desktop) */}
        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <a
              href="/"
              className={`nav-links ${currentPage === "/" ? "active" : ""}`}
              onClick={(e) => handleNavClick("/", e)}
            >
              {t("navbar.home")}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/about"
              className={`nav-links ${
                currentPage === "/about" ? "active" : ""
              }`}
              onClick={(e) => handleNavClick("/about", e)}
            >
              {t("navbar.about")}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/services"
              className={`nav-links ${
                currentPage === "/services" ? "active" : ""
              }`}
              onClick={(e) => handleNavClick("/services", e)}
            >
              {t("navbar.services")}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/gallery"
              className={`nav-links ${
                currentPage === "/gallery" ? "active" : ""
              }`}
              onClick={(e) => handleNavClick("/gallery", e)}
            >
              {t("navbar.gallery")}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/events"
              className={`nav-links ${
                currentPage === "/events" ? "active" : ""
              }`}
              onClick={(e) => handleNavClick("/events", e)}
            >
              {t("navbar.events")}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/contact"
              className={`nav-links ${
                currentPage === "/contact" ? "active" : ""
              }`}
              onClick={(e) => handleNavClick("/contact", e)}
            >
              {t("navbar.contact")}
            </a>
          </li>
        </ul>

        {/* Hamburger menu and LanguageSwitcher on the right */}
        <div className="navbar-right">
          <div className="nav-lang-always-visible">
            <LanguageSwitcher />
          </div>
          <div
            className={`menu-icon ${isOpen ? "active" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={isOpen ? "menu-icon-bar open" : "menu-icon-bar"}
            ></span>
            <span
              className={isOpen ? "menu-icon-bar open" : "menu-icon-bar"}
            ></span>
            <span
              className={isOpen ? "menu-icon-bar open" : "menu-icon-bar"}
            ></span>
          </div>
        </div>

        {/* Backdrop for mobile menu */}
        <div
          className={isOpen ? "menu-backdrop active" : "menu-backdrop"}
          onClick={() => setIsOpen(false)}
        ></div>
      </div>
    </nav>
  );
}

export default Navbar;
