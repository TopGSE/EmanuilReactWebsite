import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/PaymentSuccess.css";

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("");

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
            setStatus("success");
            setMessage(t("payment.success.completed"));
          } else {
            setStatus("warning");
            setMessage(t("payment.success.processing"));
          }
        } else {
          setStatus("success");
          setMessage(t("payment.success.completed"));
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

  return (
    <div className="payment-success">
      <div className="payment-success-container">
        <div className={`payment-success-icon ${status}`}>
          {status === "success" && <span>✓</span>}
          {status === "processing" && <span>⏳</span>}
          {status === "warning" && <span>⚠</span>}
        </div>

        <h1 className="payment-success-title">
          {status === "success" && t("payment.success.title")}
          {status === "processing" && t("payment.success.processing_title")}
          {status === "warning" && t("payment.success.processing_title")}
        </h1>

        <p className="payment-success-message">{message}</p>

        <div className="payment-success-actions">
          <button onClick={goHome} className="btn-primary">
            {t("payment.success.back_home")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
