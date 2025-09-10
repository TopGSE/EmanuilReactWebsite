import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaHeart } from "react-icons/fa";
import "../styles/FloatingDonateButton.css";

function FloatingDonateButton({ onNavigate }) {
  const { t } = useTranslation();
  const [isHovering, setIsHovering] = useState(false);

  // Donate function
  const handleDonate = () => {
    if (onNavigate) {
      onNavigate("/donate");
    } else {
      window.location.href = "/donate";
    }
  };

  return (
    <button
      className="floating-donate-button visible"
      onClick={handleDonate}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      aria-label={t("navbar.donate")}
      title={t("navbar.donate")}
    >
      <FaHeart
        className="donate-heart-icon"
        style={{
          animation: isHovering ? "heartbeat 0.8s infinite" : "none",
        }}
      />
      <span className="donate-button-text">{t("navbar.donate")}</span>
    </button>
  );
}

export default FloatingDonateButton;
