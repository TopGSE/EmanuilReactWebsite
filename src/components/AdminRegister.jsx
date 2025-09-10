import { useState, useEffect } from "react";
import "../styles/AdminRegister.css";
import { adminAPI } from "../lib/api";

function AdminRegister() {
  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("form"); // 'form', 'success', 'error', 'invalid_token'
  const [tokenInfo, setTokenInfo] = useState(null);

  // Get token and verify on component mount
  useEffect(() => {
    // Get token from URL search params using vanilla JavaScript
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    setToken(urlToken);

    if (!urlToken) {
      setRegistrationStatus("invalid_token");
      return;
    }

    verifyToken(urlToken);
  }, []);

  const verifyToken = async (tokenToVerify) => {
    try {
      const data = await adminAPI.verifyToken(tokenToVerify);

      if (data.success) {
        setTokenInfo(data.tokenInfo);
        setFormData((prev) => ({ ...prev, email: data.tokenInfo.email }));
      } else {
        setRegistrationStatus("invalid_token");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      setRegistrationStatus("invalid_token");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const data = await adminAPI.register({
        token,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (data.success) {
        setRegistrationStatus("success");
      } else {
        setErrors({ submit: data.message || "Registration failed" });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationStatus === "invalid_token") {
    return (
      <div className="register-container">
        <div className="register-card error-card">
          <div className="error-content">
            <h2>❌ Invalid Registration Link</h2>
            <p>This registration link is invalid or has expired.</p>
            <p>
              Please contact the website administrator for a new registration
              link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (registrationStatus === "success") {
    return (
      <div className="register-container">
        <div className="register-card success-card">
          <div className="success-content">
            <h2>✅ Registration Successful!</h2>
            <p>Your admin account has been created successfully.</p>
            <p>You can now close this page and login with your credentials.</p>
            <a href="/" className="home-link">
              Return to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>🏛️ Admin Registration</h2>
          <p>Create your admin account for Emanuil Church</p>
          {tokenInfo && (
            <p className="token-info">
              Registration email: <strong>{tokenInfo.email}</strong>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={errors.email ? "error" : ""}
              readOnly={!!tokenInfo}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Choose a secure password"
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? "error" : ""}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          <button type="submit" disabled={isLoading} className="register-btn">
            {isLoading ? "Creating Account..." : "Create Admin Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminRegister;
