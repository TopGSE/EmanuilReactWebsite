import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BankingQRCode from "./BankingQRCode";
import "../styles/Payment.css";

function Payment() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Your actual ING bank details
  const bankDetails = {
    iban: "BE61 3630 6515 2617",
    beneficiaryName: "Christian Center Emmanuel",
    bic: "BBRUBEBB",
    reference: "Donation - Church Support",
  };

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Copy IBAN to clipboard
  const copyIBAN = () => {
    navigator.clipboard.writeText(bankDetails.iban.replace(/\s/g, ""));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Try to open banking app
  const openBankingApp = () => {
    const cleanIban = bankDetails.iban.replace(/\s/g, "");
    const beneficiary = encodeURIComponent(bankDetails.beneficiaryName);
    const ref = encodeURIComponent(bankDetails.reference);

    // Try different banking app deep links
    const deepLinks = [
      `ing://payment?iban=${cleanIban}&name=${beneficiary}&reference=${ref}`,
      `kbc://payment?iban=${cleanIban}&name=${beneficiary}&reference=${ref}`,
      `belfius://payment?iban=${cleanIban}&name=${beneficiary}&reference=${ref}`,
    ];

    // Try to open, fallback to copying IBAN
    window.location.href = deepLinks[0];

    // Fallback: copy IBAN after short delay
    setTimeout(() => {
      copyIBAN();
      alert(
        "💡 If your banking app didn't open, we've copied the IBAN. Open your banking app manually and paste it!"
      );
    }, 1500);
  };

  return (
    <div className="payment-app">
      <div className="payment-container">
        {/* Simple Header */}
        <div className="payment-header">
          <h1>{t("payment.title")}</h1>
          <p className="subtitle">{t("payment.supportMission")}</p>
          <p className="description">{t("payment.donationDescription")}</p>
        </div>

        {/* Single Centered Card */}
        <div className="payment-main-card">
          {/* Mobile: Show primary action buttons */}
          {isMobile ? (
            <div className="mobile-actions">
              <h3 className="mobile-title">💳 {t("payment.quickDonation")}</h3>
              <p className="mobile-subtitle">{t("payment.chooseMethod")}</p>

              {/* Primary: Open Banking App */}
              <button className="primary-action-btn" onClick={openBankingApp}>
                <span className="btn-icon">🏦</span>
                <span className="btn-content">
                  <span className="btn-title">
                    {t("payment.openBankingApp")}
                  </span>
                  <span className="btn-subtitle">
                    {t("payment.bankingAppSubtitle")}
                  </span>
                </span>
              </button>

              {/* Secondary: Copy IBAN */}
              <button className="secondary-action-btn" onClick={copyIBAN}>
                <span className="btn-icon">📋</span>
                <span className="btn-content">
                  <span className="btn-title">
                    {copySuccess ? t("payment.copied") : t("payment.copyIBAN")}
                  </span>
                  <span className="btn-subtitle">{bankDetails.iban}</span>
                </span>
              </button>

              <div className="mobile-instructions">
                <p className="instruction-title">
                  📱 {t("payment.howItWorks")}
                </p>
                <ol>
                  <li>{t("payment.step1")}</li>
                  <li>{t("payment.step2")}</li>
                  <li>{t("payment.step3")}</li>
                  <li>{t("payment.step4")}</li>
                </ol>
              </div>

              {/* Show bank details */}
              <div className="mobile-details-toggle">
                <details>
                  <summary>{t("payment.viewBankDetails")}</summary>
                  <div className="bank-details-mobile">
                    <div className="detail-row">
                      <span>{t("payment.bank")}:</span>
                      <strong>{t("payment.bankName")}</strong>
                    </div>
                    <div className="detail-row">
                      <span>{t("payment.accountName")}:</span>
                      <strong>{t("payment.accountNameValue")}</strong>
                    </div>
                    <div className="detail-row">
                      <span>{t("payment.iban")}:</span>
                      <strong>{bankDetails.iban}</strong>
                    </div>
                    <div className="detail-row">
                      <span>{t("payment.bicSwift")}:</span>
                      <strong>{bankDetails.bic}</strong>
                    </div>
                    <div className="detail-row">
                      <span>{t("payment.reference")}:</span>
                      <strong>{t("payment.referenceValue")}</strong>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          ) : (
            /* Desktop: Show QR Code */
            <>
              <div className="qr-section-simple">
                <div className="qr-label">{t("payment.scanToDonate")}</div>
                <div className="qr-display">
                  <BankingQRCode
                    iban={bankDetails.iban}
                    beneficiaryName={bankDetails.beneficiaryName}
                    reference={bankDetails.reference}
                    size={200}
                  />
                </div>
                <p className="qr-hint">{t("payment.openBankingAppHint")}</p>
              </div>

              {/* Divider */}
              <div className="section-divider">
                <span>{t("payment.orDivider")}</span>
              </div>

              {/* Bank Details Section */}
              <div className="bank-section-simple">
                <div className="bank-label">{t("payment.manualTransfer")}</div>

                <div className="bank-grid">
                  <div className="bank-item">
                    <span className="item-label">{t("payment.bank")}</span>
                    <span className="item-value">{t("payment.bankName")}</span>
                  </div>

                  <div className="bank-item">
                    <span className="item-label">
                      {t("payment.accountName")}
                    </span>
                    <span className="item-value">
                      {t("payment.accountNameValue")}
                    </span>
                  </div>

                  <div className="bank-item featured">
                    <span className="item-label">{t("payment.iban")}</span>
                    <span className="item-value">
                      {bankDetails.iban}
                      <button
                        className="copy-icon"
                        onClick={copyIBAN}
                        title={t("payment.copyIBAN")}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </span>
                  </div>

                  <div className="bank-item">
                    <span className="item-label">{t("payment.bicSwift")}</span>
                    <span className="item-value">{bankDetails.bic}</span>
                  </div>

                  <div className="bank-item">
                    <span className="item-label">{t("payment.reference")}</span>
                    <span className="item-value">
                      {t("payment.referenceValue")}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Message */}
        <div className="payment-footer">
          <p className="footer-thanks">
            {t("payment.thankYouTitle")} {t("payment.thankYouMessage")}
          </p>
          <p className="footer-contact">
            {t("payment.questionsContact")}{" "}
            <a href="mailto:info@cce.be">info@cce.be</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Payment;
