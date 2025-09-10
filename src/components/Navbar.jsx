import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Navbar.css";
import LanguageSwitcher from "./LanguageSwitcher";
import LoginModal from "./LoginModal";

function Navbar({ onNavigate, currentPage }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    const superAdminAccess =
      localStorage.getItem("superAdminAccess") === "true";
    setIsLoggedIn(adminLoggedIn || superAdminAccess);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminLoginTime");
    // Note: We don't remove superAdminAccess as it's meant to be persistent for development
    // If you want to remove super admin access too, uncomment the next line:
    // localStorage.removeItem("superAdminAccess");

    const superAdminAccess =
      localStorage.getItem("superAdminAccess") === "true";
    setIsLoggedIn(superAdminAccess); // Keep logged in state if super admin access is still active

    // Redirect to home if currently on admin page and no super admin access
    if (currentPage === "/admin" && !superAdminAccess) {
      onNavigate("/");
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

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

          {/* Admin link - only visible when logged in */}
          {isLoggedIn && (
            <li className="nav-item">
              <a
                href="/admin"
                className={`nav-links ${
                  currentPage === "/admin" ? "active" : ""
                }`}
                onClick={(e) => handleNavClick("/admin", e)}
                style={{ fontSize: "0.9rem", opacity: "0.8" }}
              >
                🏛️ Admin
              </a>
            </li>
          )}
        </ul>

        {/* Hamburger menu and LanguageSwitcher on the right */}
        <div className="navbar-right">
          <div className="nav-lang-always-visible">
            <LanguageSwitcher />
          </div>

          {/* Admin Login/Logout Button */}
          <div className="admin-auth-btn">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="logout-btn"
                title="Logout from admin"
              >
                👤 Logout
              </button>
            ) : (
              <button
                onClick={handleLoginClick}
                className="login-btn-nav"
                title="Admin login"
              >
                Login
              </button>
            )}
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

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </nav>
  );
}

export default Navbar;
