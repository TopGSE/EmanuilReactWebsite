import { useState } from "react";
import "../styles/LoginModal.css";
import { adminAPI } from "../lib/api";

function LoginModal({ isOpen, onClose, onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Authenticate with database using API utility
      const data = await adminAPI.login({
        email: credentials.username, // Using username field as email
        password: credentials.password,
      });

      if (data.success) {
        // Store login status and admin info in localStorage
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminLoginTime", new Date().toISOString());
        localStorage.setItem("adminInfo", JSON.stringify(data.admin));
        onLogin();
        onClose();
        // Reset form
        setCredentials({ username: "", password: "" });
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCredentials({ username: "", password: "" });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay" onClick={handleClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <h2>🏛️ Admin Login</h2>
          <button className="close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder=" "
              autoComplete="username"
            />
            <label htmlFor="username">Email Address</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder=" "
              autoComplete="current-password"
            />
            <label htmlFor="password">Password</label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="login-actions">
            <button type="button" onClick={handleClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="login-btn">
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default LoginModal;
