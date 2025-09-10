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
    <div className="payment-page">
      <div className="payment-container">
        <h1>{t("payment.membershipTitle")}</h1>

        <div className="membership-price">
          <span className="price-amount">€{membershipAmount}</span>
          <span className="price-period">/{t("payment.month")}</span>
        </div>

        {/* Member Information */}
        <div className="member-info-section">
          <h3>{t("payment.memberInfo")}</h3>
          <div className="form-group">
            <label>{t("payment.name")} *</label>
            <input
              type="text"
              value={memberInfo.name}
              onChange={(e) =>
                setMemberInfo({ ...memberInfo, name: e.target.value })
              }
              placeholder={t("payment.namePlaceholder")}
              required
            />
          </div>
          <div className="form-group">
            <label>{t("payment.email")} *</label>
            <input
              type="email"
              value={memberInfo.email}
              onChange={(e) =>
                setMemberInfo({ ...memberInfo, email: e.target.value })
              }
              placeholder={t("payment.emailPlaceholder")}
              required
            />
          </div>
          <div className="form-group">
            <label>{t("payment.phone")}</label>
            <input
              type="tel"
              value={memberInfo.phone}
              onChange={(e) =>
                setMemberInfo({ ...memberInfo, phone: e.target.value })
              }
              placeholder={t("payment.phonePlaceholder")}
            />
          </div>
        </div>

        <button
          className="checkout-button"
          onClick={handleCheckout}
          disabled={!memberInfo.name || !memberInfo.email || loading}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              {t("payment.processing")}
            </>
          ) : (
            <>🔒 {t("payment.proceedToCheckout")}</>
          )}
        </button>

        <div className="payment-info">
          <p className="secure-note">🔐 {t("payment.secureStripeCheckout")}</p>
          <div className="trust-badges">
            <span className="trust-item">🔐 SSL</span>
            <span className="trust-item">💳 Stripe</span>
            <span className="trust-item">✅ PCI DSS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
