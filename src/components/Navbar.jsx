import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Navbar.css";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar({ onNavigate }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (path, e) => {
    e.preventDefault();
    onNavigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>Църква Емануил</h1>
        </div>

        <div className="navbar-right">
          <LanguageSwitcher />

          <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
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

        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <a
              href="/"
              className="nav-links"
              onClick={(e) => handleNavClick("/", e)}
            >
              {t("navbar.home")}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/about"
              className="nav-links"
              onClick={(e) => handleNavClick("/about", e)}
            >
              {t("navbar.about")}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/services"
              className="nav-links"
              onClick={(e) => handleNavClick("/services", e)}
            >
              {t("navbar.services")}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/kids"
              className="nav-links"
              onClick={(e) => handleNavClick("/kids", e)}
            >
              {t("navbar.kids")}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/events"
              className="nav-links"
              onClick={(e) => handleNavClick("/events", e)}
            >
              {t("navbar.events")}
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/contact"
              className="nav-links"
              onClick={(e) => handleNavClick("/contact", e)}
            >
              {t("navbar.contact")}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
