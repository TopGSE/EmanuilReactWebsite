import { useState, useEffect } from "react";
import "../styles/AdminDashboard.css";
import { contactAPI, prayerAPI } from "../lib/api";

function AdminDashboard() {
  const [contacts, setContacts] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("contacts");
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

      // Fetch contact submissions and prayer requests
      const [contactData, prayerData] = await Promise.all([
        contactAPI.getAll(),
        prayerAPI.getAll(),
      ]);

      setContacts(Array.isArray(contactData) ? contactData : []);
      setPrayers(Array.isArray(prayerData) ? prayerData : []);
    } catch (error) {
      console.error("Failed to load admin data:", error);
      setContacts([]);
      setPrayers([]);
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
            <h2>🔐 Authentication Required</h2>
            <p>Please log in to access the admin dashboard.</p>
            <p>
              Click the "🔐 Login" button in the navigation bar to authenticate.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Loading admin data...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🏛️ Church Admin Dashboard</h1>
        <p>Manage contact submissions and prayer requests</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === "contacts" ? "active" : ""}`}
          onClick={() => setActiveTab("contacts")}
        >
          Contact Submissions ({contacts.length})
        </button>
        <button
          className={`tab-button ${activeTab === "prayers" ? "active" : ""}`}
          onClick={() => setActiveTab("prayers")}
        >
          Prayer Requests ({prayers.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "contacts" && (
          <div className="submissions-grid">
            <h2>Contact Submissions</h2>
            {contacts.length === 0 ? (
              <p>No contact submissions yet.</p>
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
                        <strong>Email:</strong> {contact.email}
                      </p>
                      {contact.phone && (
                        <p>
                          <strong>Phone:</strong> {contact.phone}
                        </p>
                      )}
                      <p>
                        <strong>Subject:</strong> {contact.subject}
                      </p>
                      <p>
                        <strong>Message:</strong> {contact.message}
                      </p>
                      <p>
                        <strong>Language:</strong> {contact.language}
                      </p>
                      <p>
                        <strong>Submitted:</strong>{" "}
                        {formatDate(contact.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "prayers" && (
          <div className="submissions-grid">
            <h2>Prayer Requests</h2>
            {prayers.length === 0 ? (
              <p>No prayer requests yet.</p>
            ) : (
              <div className="cards-grid">
                {prayers.map((prayer) => (
                  <div key={prayer.id} className="submission-card">
                    <div className="card-header">
                      <h3>{prayer.isAnonymous ? "Anonymous" : prayer.name}</h3>
                      <span className={`status-badge ${prayer.status}`}>
                        {prayer.status}
                      </span>
                    </div>
                    <div className="card-details">
                      {prayer.email && (
                        <p>
                          <strong>Email:</strong> {prayer.email}
                        </p>
                      )}
                      {prayer.phone && (
                        <p>
                          <strong>Phone:</strong> {prayer.phone}
                        </p>
                      )}
                      <p>
                        <strong>Prayer Request:</strong> {prayer.requestText}
                      </p>
                      <p>
                        <strong>Language:</strong> {prayer.language}
                      </p>
                      <p>
                        <strong>Submitted:</strong>{" "}
                        {formatDate(prayer.createdAt)}
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
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
