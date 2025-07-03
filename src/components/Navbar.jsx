import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Navbar.css";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar({ onNavigate }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  // Add state to track current page
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const handleNavClick = (path, e) => {
    e.preventDefault();
    onNavigate(path);
    setCurrentPath(path); // Update current path when navigating
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

  // Update current path if URL changes externally
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo on the left */}
        <div className="navbar-logo" onClick={(e) => handleNavClick("/", e)}>
          <h1>{t("navbar.title")}</h1>
        </div>

        {/* Nav links in the center (desktop) */}
        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <a
              href="/"
              className={`nav-links ${currentPath === "/" ? "active" : ""}`}
              onClick={(e) => handleNavClick("/", e)}
            >
              {t("navbar.home")}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/about"
              className={`nav-links ${
                currentPath === "/about" ? "active" : ""
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
                currentPath === "/services" ? "active" : ""
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
                currentPath === "/gallery" ? "active" : ""
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
                currentPath === "/events" ? "active" : ""
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
                currentPath === "/contact" ? "active" : ""
              }`}
              onClick={(e) => handleNavClick("/contact", e)}
            >
              {t("navbar.contact")}
            </a>
          </li>
        </ul>

        {/* Language switcher & hamburger menu on the far right */}
        <div className="navbar-right">
          <LanguageSwitcher />

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
