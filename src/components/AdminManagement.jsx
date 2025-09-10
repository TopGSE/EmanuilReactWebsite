import { useState } from "react";
import "../styles/AdminManagement.css";
import { adminAPI } from "../lib/api";

function AdminManagement() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter an email address" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const data = await adminAPI.createRegistrationToken(email);

      if (data.success) {
        setMessage({
          type: "success",
          text: `Registration link created! Send this to ${email}:\n${data.registrationLink}`,
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to create registration link",
        });
      }
    } catch (error) {
      console.error("Error creating registration link:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Registration link copied to clipboard!");
    });
  };

  return (
    <div className="admin-management">
      <div className="management-header">
        <h2>👑 Super Admin - User Management</h2>
        <p>Create registration links for new admin users</p>
      </div>

      <div className="create-admin-card">
        <h3>Create New Admin Registration Link</h3>
        <form onSubmit={handleSubmit} className="create-admin-form">
          <div className="form-group">
            <label htmlFor="email">Email Address for New Admin</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="form-input"
            />
          </div>

          <button type="submit" disabled={isLoading} className="create-btn">
            {isLoading ? "Creating Link..." : "Create Registration Link"}
          </button>
        </form>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === "success" ? (
              <div>
                <p>✅ {message.text.split("\n")[0]}</p>
                <div className="link-container">
                  <input
                    type="text"
                    value={message.text.split("\n")[1]}
                    readOnly
                    className="link-input"
                  />
                  <button
                    onClick={() => copyToClipboard(message.text.split("\n")[1])}
                    className="copy-btn"
                  >
                    📋 Copy
                  </button>
                </div>
                <p className="instructions">
                  Send this link to the user via email. The link expires in 24
                  hours.
                </p>
              </div>
            ) : (
              <p>❌ {message.text}</p>
            )}
          </div>
        )}
      </div>

      <div className="instructions-card">
        <h3>📋 Instructions</h3>
        <ol>
          <li>
            Enter the email address of the person you want to make an admin
          </li>
          <li>
            Click "Create Registration Link" to generate a unique registration
            URL
          </li>
          <li>Copy the generated link and send it to them via email</li>
          <li>They click the link and create their own admin credentials</li>
          <li>Once registered, they can login with their chosen password</li>
        </ol>

        <div className="security-note">
          <h4>🔒 Security Notes:</h4>
          <ul>
            <li>Registration links expire in 24 hours</li>
            <li>Each link can only be used once</li>
            <li>Only you (the website creator) can access this page</li>
            <li>Admin passwords are securely hashed in the database</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminManagement;
