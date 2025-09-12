import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/AdminDashboard.css";
import { contactAPI } from "../lib/api";
import AdminPayments from "./AdminPayments";

function AdminDashboard() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("payments");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in or has super admin access
    const adminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    const superAdminAccess =
      localStorage.getItem("superAdminAccess") === "true";
    const hasAccess = adminLoggedIn || superAdminAccess;

    setIsAuthenticated(hasAccess);

    if (hasAccess) {
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch contact submissions
      const contactResponse = await contactAPI.getAll();
      if (contactResponse.success && contactResponse.contacts) {
        setContacts(Array.isArray(contactResponse.contacts) ? contactResponse.contacts : []);
      } else {
        console.error("Invalid contact response:", contactResponse);
        setContacts([]);
      }
    } catch (error) {
      console.error("Failed to load admin data:", error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show authentication required message if not logged in
  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard">
        <div className="auth-required">
          <div className="auth-message">
            <h2>🔐 {t("admin.auth.required")}</h2>
            <p>{t("admin.auth.message")}</p>
            <p>{t("admin.auth.instruction")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">{t("admin.dashboard.loading")}</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🏛️ {t("admin.dashboard.title")}</h1>
        <p>{t("admin.dashboard.subtitle")}</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === "payments" ? "active" : ""}`}
          onClick={() => setActiveTab("payments")}
        >
          {t("admin.tabs.payments")}
        </button>
        <button
          className={`tab-button ${activeTab === "contacts" ? "active" : ""}`}
          onClick={() => setActiveTab("contacts")}
        >
          {t("admin.tabs.contacts")} ({contacts.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "payments" && <AdminPayments />}

        {activeTab === "contacts" && (
          <div className="submissions-grid">
            <h2>{t("admin.contacts.title")}</h2>
            {contacts.length === 0 ? (
              <p>{t("admin.contacts.noSubmissions")}</p>
            ) : (
              <div className="cards-grid">
                {contacts.map((contact) => (
                  <div key={contact.id} className="submission-card">
                    <div className="card-header">
                      <h3>{contact.name}</h3>
                      <span className={`status-badge ${contact.status}`}>
                        {contact.status}
                      </span>
                    </div>
                    <div className="card-details">
                      <p>
                        <strong>{t("admin.contacts.fields.email")}:</strong>{" "}
                        {contact.email}
                      </p>
                      {contact.phone && (
                        <p>
                          <strong>{t("admin.contacts.fields.phone")}:</strong>{" "}
                          {contact.phone}
                        </p>
                      )}
                      <p>
                        <strong>{t("admin.contacts.fields.subject")}:</strong>{" "}
                        {contact.subject}
                      </p>
                      <p>
                        <strong>{t("admin.contacts.fields.message")}:</strong>{" "}
                        {contact.message}
                      </p>
                      <p>
                        <strong>{t("admin.contacts.fields.language")}:</strong>{" "}
                        {contact.language}
                      </p>
                      <p>
                        <strong>{t("admin.contacts.fields.submitted")}:</strong>{" "}
                        {formatDate(contact.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="admin-actions">
        <button onClick={loadData} className="refresh-button">
          🔄 {t("admin.dashboard.refreshData")}
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
