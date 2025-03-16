import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Contact.css";

function Contact() {
  const { t } = useTranslation();
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
          message: t("contact.form.success"),
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
      console.error("Formspree error:", error);
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
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
              </svg>
            </div>
            <h3>{t("contact.visit")}</h3>
            <p>{t("footer.address")}</p>
            <p>{t("footer.city")}</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4h-16c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm0 4l-8 5-8-5v-2l8 5 8-5v2z" />
              </svg>
            </div>
            <h3>{t("contact.email")}</h3>
            <p>
              <a href="mailto:info@churchname.org">info@churchname.org</a>
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 22.621l-3.521-6.795c-.008.004-1.974.97-2.064 1.011-2.24 1.086-6.799-7.82-4.609-8.994l2.083-1.026-3.493-6.817-2.106 1.039c-7.202 3.755 4.233 25.982 11.6 22.615.121-.055 2.102-1.029 2.11-1.033z" />
              </svg>
            </div>
            <h3>{t("contact.call")}</h3>
            <p>
              <a href="tel:+11234567890">
                {t("footer.phone").replace("Phone: ", "")}
              </a>
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
              </svg>
            </div>
            <h3>{t("contact.follow")}</h3>
            <div className="social-links-contact">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>{t("contact.form.title")}</h2>
          <form className="contact-form" ref={form} onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">{t("contact.form.name")}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder={t("contact.form.namePlace")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{t("contact.form.email")}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={t("contact.form.emailPlace")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t("contact.form.phone")}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("contact.form.phonePlace")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">{t("contact.form.subject")}</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder={t("contact.form.subjectPlace")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">{t("contact.form.message")}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                required
                placeholder={t("contact.form.messagePlace")}
              ></textarea>
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
      </section>

      <section className="map-section">
        <h2>{t("contact.find")}</h2>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.0!2d-73.9!3d40.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM0LCsDQzJzM5LjMiTiA3M8KwNTQnNDAuMiJX!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Church Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
}

export default Contact;
