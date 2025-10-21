import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/AdminDashboard.css";
import { contactAPI } from "../lib/api";

function AdminDashboard() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setContacts(
          Array.isArray(contactResponse.contacts)
            ? contactResponse.contacts
            : []
        );
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
        <button className="tab-button active">
          {t("admin.tabs.contacts")} ({contacts.length})
        </button>
      </div>

      <div className="admin-content">
        <div className="submissions-section">
          <div className="section-header">
            <h2>{t("admin.contacts.title")}</h2>
            <span className="count-badge">{contacts.length} submissions</span>
          </div>

          {contacts.length === 0 ? (
            <div className="empty-state">
              <p>📭 {t("admin.contacts.noSubmissions")}</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="submissions-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Language</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className={`row-${contact.status}`}>
                      <td>
                        <span className={`status-badge ${contact.status}`}>
                          {contact.status === "new" ? "🆕" : "✓"}
                        </span>
                      </td>
                      <td className="name-cell">{contact.name}</td>
                      <td className="email-cell">
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </td>
                      <td>{contact.phone || "-"}</td>
                      <td className="subject-cell">{contact.subject}</td>
                      <td className="message-cell">
                        <div
                          className="message-preview"
                          title={contact.message}
                        >
                          {contact.message}
                        </div>
                      </td>
                      <td>
                        <span className="lang-badge">{contact.language}</span>
                      </td>
                      <td className="date-cell">
                        {formatDate(contact.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
