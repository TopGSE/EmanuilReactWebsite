import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Contact.css";
import { contactAPI, prayerAPI } from "../lib/api";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

function Contact() {
  const { t, i18n } = useTranslation();
  const form = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({
      submitted: true,
      error: false,
      message: t("contact.form.sending"),
    });

    try {
      // Prepare form data with language info
      const submissionData = {
        ...formData,
        language: i18n.language || "en",
      };

      // Save to database via API
      let dbResult = null;
      try {
        const isPrayerRequest =
          formData.subject.toLowerCase().includes("prayer") ||
          formData.message.toLowerCase().includes("pray");

        if (isPrayerRequest) {
          // Handle prayer request
          dbResult = await prayerAPI.create({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            requestText: formData.message,
            isAnonymous: false,
            language: i18n.language,
          });
        } else {
          // Handle contact submission
          dbResult = await contactAPI.create(submissionData);
        }

        if (dbResult.success) {
          console.log("✅ Saved to database:", dbResult);
        } else {
          console.warn("Database save failed, continuing with Formspree");
        }
      } catch (dbError) {
        console.warn(
          "Database save failed, continuing with Formspree:",
          dbError
        );
      }

      // Also send to Formspree as backup
      const response = await fetch("https://formspree.io/f/mkgjndnl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus({
          submitted: true,
          error: false,
          message: dbResult
            ? t("contact.form.success") + ` (DB ID: ${dbResult.id})`
            : t("contact.form.success"),
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      setFormStatus({
        submitted: true,
        error: true,
        message: t("contact.form.error"),
      });
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="contact-container">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>{t("contact.title")}</h1>
          <p>{t("contact.subtitle")}</p>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-form-container">
          <h2>{t("contact.form.title")}</h2>
          <form className="contact-form" ref={form} onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label htmlFor="name">{t("contact.form.name")}</label>
            </div>

            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label htmlFor="email">{t("contact.form.email")}</label>
            </div>

            <div className="form-group">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder=" "
              />
              <label htmlFor="phone">{t("contact.form.phone")}</label>
            </div>

            <div className="form-group">
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder=" "
              />
              <label htmlFor="subject">{t("contact.form.subject")}</label>
            </div>

            <div className="form-group full-width">
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
                placeholder=" "
              ></textarea>
              <label htmlFor="message">{t("contact.form.message")}</label>
            </div>

            {formStatus.submitted && (
              <div
                className={`form-status ${
                  formStatus.error ? "error" : "success"
                }`}
              >
                {formStatus.message}
              </div>
            )}

            <button type="submit" className="submit-button">
              {t("contact.form.button")}
            </button>
          </form>
        </div>

        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="info-content">
              <h3>{t("contact.visit")}</h3>
              <p>{t("footer.address")}</p>
              <p>{t("footer.city")}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaPhoneAlt />
            </div>
            <div className="info-content">
              <h3>{t("contact.call")}</h3>
              <p>
                <a href="tel:+11234567890">
                  {t("footer.phone").replace("Phone: ", "")}
                </a>
              </p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <div className="info-content">
              <h3>{t("contact.email")}</h3>
              <p>
                <a href="mailto:info@churchname.org">
                  bec.emanuil.gent@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="info-card">
            <div
              className="info-icon"
              style={{
                backgroundColor: "rgba(59, 89, 152, 0.1)",
                color: "#3b5998",
              }}
            >
              <FaFacebook />
            </div>
            <div className="info-content">
              <h3>{t("contact.follow")}</h3>
              <div className="social-links-contact">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="map-section">
        <h2>{t("contact.find")}</h2>
        <div
          className="map-container"
          style={{
            width: "100%",
            height: "350px",
            maxWidth: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2507.4722146391275!2d3.744343576899598!3d51.05951204744881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c37179db47ab6f%3A0xb7f0e793429bc01b!2sLand%20van%20Waaslaan%2076%2C%209040%20Gent!5e0!3m2!1sen!2sbe!4v1719651633592!5m2!1sen!2sbe"
            width="100%"
            height="100%"
            style={{
              border: 0,
              width: "100%",
              height: "100%",
              minHeight: "350px",
              display: "block",
            }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Church Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

export default Contact;
