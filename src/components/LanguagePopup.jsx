import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/LanguagePopup.css";

function LanguagePopup({ isOpen, onClose, onSelectLanguage }) {
  const { t } = useTranslation();

  // Prevent scrolling when popup is open
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

  if (!isOpen) return null;

  return (
    <div className="language-popup-overlay" onClick={onClose}>
      <div
        className="language-popup-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="language-popup-header">
          <h2>Select Language</h2>
          <p>Изберете език</p>
        </div>
        <div className="language-popup-content">
          <button
            className="language-option"
            onClick={() => onSelectLanguage("en")}
          >
            <span className="flag-emoji">🇬🇧</span>
            <span>English</span>
          </button>
          <button
            className="language-option"
            onClick={() => onSelectLanguage("bg")}
          >
            <span className="flag-emoji">🇧🇬</span>
            <span>Български</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LanguagePopup;
