import { useTranslation } from "react-i18next";
import "../styles/Payment.css";

function Payment() {
  const { t } = useTranslation();

  // Mock QR code - in production, replace with actual QR code image
  const qrCodeUrl =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZmZmZmZmIi8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxNjAiIGZpbGw9IiMwMDAwMDAiLz4KPHJlY3QgeD0iNDAiIHk9IjQwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2ZmZmZmZiIvPgo8cmVjdCB4PSI2MCIgeT0iNjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzAwMDAwMCIvPgo8cmVjdCB4PSI4MCIgeT0iOCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZmZmZmZmIi8+CjxyZWN0IHg9IjEyMCIgeT0iMTIwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNmZmZmZmYiLz4KPHRleHQgeD0iMTAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UUggQ29kZTwvdGV4dD4KPC9zdmc+";

  return (
    <div className="payment-app">
      <div className="payment-container">
        <h2>{t("payment.title")}</h2>

        <div className="donation-section">
          <div className="donation-intro">
            <h3>🙏 {t("payment.supportMission")}</h3>
            <p>{t("payment.donationDescription")}</p>
          </div>

          <div className="qr-section">
            <div className="qr-code-container">
              <h4>{t("payment.scanQRCode")}</h4>
              <div className="qr-code">
                <img
                  src={qrCodeUrl}
                  alt="Donation QR Code"
                  className="qr-image"
                />
              </div>
              <p className="qr-instruction">{t("payment.scanInstruction")}</p>
            </div>

            <div className="bank-details">
              <h4>{t("payment.bankTransferDetails")}</h4>
              <div className="bank-info">
                <div className="info-row">
                  <span className="label">{t("payment.bank")}:</span>
                  <span className="value">ING Belgium</span>
                </div>
                <div className="info-row">
                  <span className="label">{t("payment.accountName")}:</span>
                  <span className="value">Christian Center Emmanuel</span>
                </div>
                <div className="info-row">
                  <span className="label">{t("payment.iban")}:</span>
                  <span className="value">BE12 3456 7890 1234</span>
                </div>
                <div className="info-row">
                  <span className="label">{t("payment.bicSwift")}:</span>
                  <span className="value">BBRUBEBB</span>
                </div>
                <div className="info-row">
                  <span className="label">{t("payment.reference")}:</span>
                  <span className="value">{t("payment.referenceValue")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="thank-you-message">
            <h4>🙏 {t("payment.thankYouTitle")}</h4>
            <p>{t("payment.thankYouMessage")}</p>
            <p>
              {t("payment.contactInfo")}: <strong>info@cce.be</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
