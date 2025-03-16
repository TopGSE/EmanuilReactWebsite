import { useTranslation } from "react-i18next";
import "../styles/LanguageSwitcher.css";

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button
        className={i18n.language === "en" ? "active" : ""}
        onClick={() => changeLanguage("en")}
      >
        {t("language.english")}
      </button>
      <button
        className={i18n.language === "bg" ? "active" : ""}
        onClick={() => changeLanguage("bg")}
      >
        {t("language.bulgarian")}
      </button>
    </div>
  );
}

export default LanguageSwitcher;
