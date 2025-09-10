import { useState, useEffect } from "react";
import "../styles/Toast.css";

function Toast({ message, isVisible, onClose, type = "info" }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto-hide after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === "warning" && "⚠️"}
          {type === "info" && "ℹ️"}
          {type === "error" && "❌"}
          {type === "success" && "✅"}
        </span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;
