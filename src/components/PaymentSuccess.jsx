import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/PaymentSuccess.css";

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("");
  const [membershipDetails, setMembershipDetails] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get("session_id");
        const autoComplete = urlParams.get("auto_complete");

        if (sessionId && autoComplete === "true") {
          // Call our API to mark the payment as completed
          const response = await fetch(
            "/api/stripe/payment-success?" +
              new URLSearchParams({
                session_id: sessionId,
              })
          );

          if (response.ok) {
            const data = await response.json();
            setStatus("success");
            setMessage(t("payment.success.completed"));
            setMembershipDetails(data);
          } else {
            setStatus("warning");
            setMessage(t("payment.success.processing"));
          }
        } else {
          setStatus("success");
          setMessage(t("payment.success.completed"));
          // Mock membership details for demo
          setMembershipDetails({
            customerName: "John Doe",
            amount: 25,
            currency: "EUR",
          });
        }
      } catch (error) {
        console.error("Error processing payment success:", error);
        setStatus("warning");
        setMessage(t("payment.success.processing"));
      }
    };

    processPayment();
  }, [t]);

  const goHome = () => {
    window.location.href = "/";
  };

  const goToDashboard = () => {
    window.location.href = "/dashboard";
  };

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return (
          <svg className="status-icon" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="currentColor"
              fillOpacity="0.1"
            />
            <path
              d="M8 12.5l3 3 5-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "processing":
        return (
          <svg
            className="status-icon processing"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeOpacity="0.3"
            />
            <path
              d="M12 2v4m0 12v4m8-10h-4M6 12H2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "warning":
        return (
          <svg className="status-icon" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="currentColor"
              fillOpacity="0.1"
            />
            <path
              d="M12 8v4m0 4h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case "success":
        return t("payment.success.title") || "Payment Successful!";
      case "processing":
        return t("payment.success.processing_title") || "Processing Payment...";
      case "warning":
        return t("payment.success.processing_title") || "Payment Processing";
      default:
        return "";
    }
  };

  return (
    <div className="success-app">
      {/* Header */}
      <header className="success-header">
        <div className="header-content">
          <div className="church-branding">
            <div className="church-icon">✝</div>
            <div className="church-info">
              <h1 className="church-name">Christian Center Emmanuel</h1>
              <p className="church-subtitle">Payment Confirmation</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="success-main">
        <div className="success-container">
          {/* Status Section */}
          <div className={`status-section ${status}`}>
            <div className="status-icon-container">{getStatusIcon()}</div>

            <h2 className="status-title">{getStatusTitle()}</h2>
            <p className="status-message">{message}</p>
          </div>

          {/* Details Section */}
          {status === "success" && membershipDetails && (
            <div className="details-section">
              <h3>Membership Details</h3>

              <div className="detail-row">
                <span className="detail-label">Member</span>
                <span className="detail-value">
                  {membershipDetails.customerName || "John Doe"}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Monthly Amount</span>
                <span className="detail-value">
                  €{membershipDetails.amount || 25}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Next Billing</span>
                <span className="detail-value">
                  {new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="detail-row total">
                <span className="detail-label">Status</span>
                <span className="detail-value">
                  <span className="status-badge active">Active</span>
                </span>
              </div>
            </div>
          )}

          {/* What's Next Section */}
          {status === "success" && (
            <div className="next-steps">
              <h3>What's Next?</h3>
              <div className="steps-grid">
                <div className="step-item">
                  <div className="step-icon">📧</div>
                  <div>
                    <div className="step-title">Confirmation Email</div>
                    <div className="step-description">
                      Check your email for membership confirmation
                    </div>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-icon">🏠</div>
                  <div>
                    <div className="step-title">Visit Our Church</div>
                    <div className="step-description">
                      Join us for Sunday service this week
                    </div>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-icon">👥</div>
                  <div>
                    <div className="step-title">Connect with Community</div>
                    <div className="step-description">
                      Meet fellow members and get involved
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-section">
            {status === "success" ? (
              <>
                <button onClick={goToDashboard} className="primary-btn">
                  <svg
                    className="btn-icon"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span>Go to Dashboard</span>
                </button>

                <button onClick={goHome} className="secondary-btn">
                  <span>Back to Home</span>
                </button>
              </>
            ) : (
              <button onClick={goHome} className="primary-btn">
                <span>{t("payment.success.back_home") || "Back to Home"}</span>
              </button>
            )}
          </div>

          {/* Support Section */}
          <div className="support-section">
            <p className="support-text">
              Need help? Contact us at{" "}
              <a
                href="mailto:support@emmanuelcenter.com"
                className="support-link"
              >
                support@emmanuelcenter.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess;
