import { useEffect, useRef } from "react";
import QRCode from "qrcode";

const BankingQRCode = ({
  iban,
  beneficiaryName,
  amount = "",
  reference = "",
  size = 256,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    generateQRCode();
  }, [iban, beneficiaryName, amount, reference]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      // Create EPC QR Code (European Payments Council Quick Response Code)
      // This is the official standard for SEPA payments in Europe
      const epcData = createEPCQRData({
        iban,
        beneficiaryName,
        amount,
        reference,
      });

      await QRCode.toCanvas(canvasRef.current, epcData, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const createEPCQRData = ({ iban, beneficiaryName, amount, reference }) => {
    // EPC QR Code specification version 002
    // https://www.europeanpaymentscouncil.eu/document-library/guidance-documents/quick-response-code-guidelines-enable-data-capture-initiation

    const cleanIban = iban.replace(/\s/g, "");

    // Build EPC QR code data according to specification
    const lines = [
      "BCD", // Service Tag
      "002", // Version
      "1", // Character set (1 = UTF-8)
      "SCT", // Identification (SCT = SEPA Credit Transfer)
      "BBRUBEBB", // BIC (ING Belgium)
      beneficiaryName.substring(0, 70), // Beneficiary Name (max 70 chars)
      cleanIban, // Beneficiary Account (IBAN)
      amount ? `EUR${amount}` : "", // Amount (optional: EUR prefix + amount)
      "", // Purpose (optional)
      reference.substring(0, 140), // Remittance Information (max 140 chars)
      "", // Beneficiary to Originator Information (optional)
    ];

    // Join with line feed character as per EPC specification
    return lines.join("\n");
  };

  const copyIBAN = () => {
    const cleanIban = iban.replace(/\s/g, "");
    navigator.clipboard
      .writeText(cleanIban)
      .then(() => alert("IBAN copied to clipboard!"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <div style={{ textAlign: "center", display: "inline-block" }}>
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: "100%",
          height: "auto",
          display: "block",
        }}
      />
      <button
        onClick={copyIBAN}
        style={{
          marginTop: "16px",
          padding: "12px 24px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "600",
          transition: "all 0.2s",
          width: "100%",
          boxShadow: "0 2px 8px rgba(0, 123, 255, 0.2)",
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#0056b3";
          e.target.style.transform = "translateY(-1px)";
          e.target.style.boxShadow = "0 4px 12px rgba(0, 123, 255, 0.3)";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#007bff";
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 2px 8px rgba(0, 123, 255, 0.2)";
        }}
      >
        📋 Copy IBAN
      </button>
    </div>
  );
};

export default BankingQRCode;
