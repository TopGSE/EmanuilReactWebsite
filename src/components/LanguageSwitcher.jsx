import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../styles/LanguageSwitcher.css";

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get the current language label
  const getCurrentLanguageLabel = () => {
    switch (i18n.language) {
      case "bg":
        return "БГ";
      case "en":
        return "EN";
      default:
        return "EN";
    }
  };

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <div
        className={`language-current ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{getCurrentLanguageLabel()}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      <div className={`language-options ${isOpen ? "open" : ""}`}>
        <div
          className={`language-option ${
            i18n.language === "en" ? "active" : ""
          }`}
          onClick={() => changeLanguage("en")}
        >
          English
        </div>
        <div
          className={`language-option ${
            i18n.language === "bg" ? "active" : ""
          }`}
          onClick={() => changeLanguage("bg")}
        >
          Български
        </div>
      </div>
    </div>
  );
}

export default LanguageSwitcher;
