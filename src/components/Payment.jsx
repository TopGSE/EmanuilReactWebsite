import { useState } from "react";
import { useTranslation } from "react-i18next";
import { loadStripe } from "@stripe/stripe-js";
import "../styles/Payment.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function Payment() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [memberInfo, setMemberInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const membershipAmount = 25; // Monthly membership fee in euros

  const handleCheckout = async () => {
    if (!memberInfo.name || !memberInfo.email) {
      alert(t("payment.fillRequiredFields"));
      return;
    }

    setLoading(true);

    try {
      const stripe = await stripePromise;

      // Create checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceAmount: membershipAmount,
          customerName: memberInfo.name,
          customerEmail: memberInfo.email,
          customerPhone: memberInfo.phone,
          mode: "subscription", // For recurring monthly payments
        }),
      });

      const session = await response.json();

      if (session.id) {
        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (result.error) {
          alert(result.error.message);
        }
      } else {
        alert("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process payment");
    }

    setLoading(false);
  };

  return (
    <div className="payment-app">
      {/* Header */}
      <header className="payment-header">
        <div className="header-content">
          <div className="church-branding">
            <div className="church-icon">✝</div>
            <div className="church-info">
              <h1 className="church-name">Christian Center Emmanuel</h1>
              <p className="church-subtitle">Monthly Membership</p>
            </div>
          </div>
          <div className="secure-badge">
            <svg className="lock-icon" viewBox="0 0 12 16" fill="currentColor">
              <path d="M4 4v2h4V4c0-1.1-.9-2-2-2s-2 .9-2 2zm8 2V4c0-2.2-1.8-4-4-4S4 1.8 4 4v2c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h8c.6 0 1-.4 1-1V7c0-.6-.4-1-1-1z" />
            </svg>
            <span>Secure</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="payment-main">
        <div className="payment-container">
          {/* Membership Card */}
          <div className="membership-card">
            <div className="membership-header">
              <h2>Monthly Membership</h2>
              <div className="price-display">
                <span className="currency">€</span>
                <span className="amount">{membershipAmount}</span>
                <span className="period">/month</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="form-section">
            <h3>Personal Information</h3>

            <div className="form-fields">
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={memberInfo.name}
                  onChange={(e) =>
                    setMemberInfo({ ...memberInfo, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={memberInfo.email}
                  onChange={(e) =>
                    setMemberInfo({ ...memberInfo, email: e.target.value })
                  }
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone">
                  Phone Number <span className="optional">(optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={memberInfo.phone}
                  onChange={(e) =>
                    setMemberInfo({ ...memberInfo, phone: e.target.value })
                  }
                  placeholder="+32 XX XXX XX XX"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="payment-summary">
            <div className="summary-row">
              <span>Monthly Membership</span>
              <span>€{membershipAmount}</span>
            </div>
            <div className="summary-total">
              <span>Total per month</span>
              <span>€{membershipAmount}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            className={`checkout-btn ${loading ? "loading" : ""}`}
            onClick={handleCheckout}
            disabled={!memberInfo.name || !memberInfo.email || loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg
                  className="pay-icon"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 8H4V6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v2zm0 2v6c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-6h16zM8 17h2v-2H8v2zm4 0h6v-2h-6v2z" />
                </svg>
                <span>Complete Membership Registration</span>
              </>
            )}
          </button>

          {/* Trust Indicators */}
          <div className="trust-section">
            <div className="security-features">
              <div className="security-item">
                <svg
                  className="security-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>256-bit SSL</span>
              </div>

              <div className="security-item">
                <svg
                  className="security-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>PCI Compliant</span>
              </div>

              <div className="security-item">
                <svg
                  className="security-icon"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path
                    fillRule="evenodd"
                    d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure Payment</span>
              </div>
            </div>

            <div className="powered-by">
              <span>Powered by</span>
              <div className="stripe-logo">
                <span>stripe</span>
              </div>
            </div>

            <p className="disclaimer">
              Your payment information is secure and encrypted. We never store
              your card details.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Payment;
