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
          <div className="language-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2>Choose Language</h2>
          <p>Select your preferred language</p>
        </div>
        <div className="language-popup-content">
          <button
            className="language-option-modern"
            onClick={() => onSelectLanguage("en")}
          >
            <div className="language-flag">
              <svg
                width="20"
                height="15"
                viewBox="0 0 60 30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <clipPath id="s">
                  <path d="M0,0 v30 h60 v-30 z" />
                </clipPath>
                <clipPath id="t">
                  <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
                </clipPath>
                <g clipPath="url(#s)">
                  <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                  <path
                    d="M0,0 L60,30 M60,0 L0,30"
                    stroke="#fff"
                    strokeWidth="6"
                  />
                  <path
                    d="M0,0 L60,30 M60,0 L0,30"
                    clipPath="url(#t)"
                    stroke="#C8102E"
                    strokeWidth="4"
                  />
                  <path
                    d="M30,0 v30 M0,15 h60"
                    stroke="#fff"
                    strokeWidth="10"
                  />
                  <path
                    d="M30,0 v30 M0,15 h60"
                    stroke="#C8102E"
                    strokeWidth="6"
                  />
                </g>
              </svg>
            </div>
            <span className="language-text">English</span>
            <div className="language-check">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </button>
          <button
            className="language-option-modern"
            onClick={() => onSelectLanguage("bg")}
          >
            <div className="language-flag">
              <svg
                width="20"
                height="15"
                viewBox="0 0 300 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="300" height="200" fill="#fff" />
                <rect width="300" height="67" fill="#fff" />
                <rect y="67" width="300" height="66" fill="#00966E" />
                <rect y="133" width="300" height="67" fill="#D62612" />
              </svg>
            </div>
            <span className="language-text">Български</span>
            <div className="language-check">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </button>
        </div>
        <div className="language-popup-footer">
          <p>You can change this later in settings</p>
        </div>
      </div>
    </div>
  );
}

export default LanguagePopup;
