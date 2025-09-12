import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/AdminPayments.css";

function AdminPayments() {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, donation, membership
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/stripe/payments");
      const data = await response.json();
      if (data.success && data.payments) {
        setPayments(data.payments);
      } else {
        console.error("Invalid payments response:", data);
        setPayments([]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stripe/payments/stats");
      const data = await response.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      } else {
        console.error("Invalid stats response:", data);
        setStats({});
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return `€${(amount / 100).toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#48bb78";
      case "pending":
        return "#ed8936";
      case "failed":
        return "#f56565";
      case "refunded":
        return "#a0aec0";
      default:
        return "#a0aec0";
    }
  };

  const filteredPayments = payments.filter((payment) => {
    // Filter by type
    const matchesType = filter === "all" || payment.type === filter;

    // Filter by search term (donor name, email, or stripe ID)
    const matchesSearch =
      searchTerm === "" ||
      (payment.donorName &&
        payment.donorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.donorEmail &&
        payment.donorEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.stripePaymentId &&
        payment.stripePaymentId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    return matchesType && matchesSearch;
  });

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="admin-payments-loading">
        {t("admin.dashboard.loading")}
      </div>
    );
  }

  return (
    <div className="admin-payments">
      <h2>{t("admin.payments.title")}</h2>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{t("admin.payments.stats.totalDonations")}</h3>
          <p className="stat-amount">
            €{stats.totalDonations?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="stat-card">
          <h3>{t("admin.payments.stats.totalMembership")}</h3>
          <p className="stat-amount">
            €{stats.totalMemberships?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="stat-card">
          <h3>{t("admin.payments.stats.totalRevenue")}</h3>
          <p className="stat-amount">
            €
            {(
              (stats.totalDonations || 0) + (stats.totalMemberships || 0)
            ).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          {t("admin.payments.filters.all", { count: payments.length })}
        </button>
        <button
          className={`filter-btn ${filter === "donation" ? "active" : ""}`}
          onClick={() => setFilter("donation")}
        >
          {t("admin.payments.filters.donations", {
            count: payments.filter((p) => p.type === "donation").length,
          })}
        </button>
        <button
          className={`filter-btn ${filter === "membership" ? "active" : ""}`}
          onClick={() => setFilter("membership")}
        >
          {t("admin.payments.filters.membership", {
            count: payments.filter((p) => p.type === "membership").length,
          })}
        </button>
      </div>

      {/* Search Container */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            placeholder={t("admin.payments.search.placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="search-clear"
              aria-label="Clear search"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-info">
            {filteredPayments.length === 1
              ? t("admin.payments.search.results", {
                  count: filteredPayments.length,
                  term: searchTerm,
                })
              : t("admin.payments.search.resultsPlural", {
                  count: filteredPayments.length,
                  term: searchTerm,
                })}
          </div>
        )}
      </div>

      {/* Payments Table - Desktop */}
      <div className="payments-table-container desktop-table">
        <table className="payments-table">
          <thead>
            <tr>
              <th>{t("admin.payments.table.date")}</th>
              <th>{t("admin.payments.table.type")}</th>
              <th>{t("admin.payments.table.amount")}</th>
              <th>{t("admin.payments.table.donor")}</th>
              <th>{t("admin.payments.table.email")}</th>
              <th>{t("admin.payments.table.status")}</th>
              <th>{t("admin.payments.table.stripeId")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{formatDate(payment.createdAt)}</td>
                <td>
                  <span className={`type-badge ${payment.type}`}>
                    {payment.type === "donation" ? "🎁" : "👥"}{" "}
                    {t(`admin.payments.types.${payment.type}`)}
                  </span>
                </td>
                <td className="amount-cell">{formatAmount(payment.amount)}</td>
                <td>{payment.donorName || "Anonymous"}</td>
                <td>{payment.donorEmail || "-"}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(payment.status) }}
                  >
                    {t(`admin.payments.status.${payment.status}`)}
                  </span>
                </td>
                <td className="stripe-id">{payment.stripePaymentId}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <div className="no-payments">{t("admin.payments.noPayments")}</div>
        )}
      </div>

      {/* Payments Cards - Mobile */}
      <div className="payments-cards-container mobile-cards">
        {filteredPayments.length === 0 ? (
          <div className="no-payments">{t("admin.payments.noPayments")}</div>
        ) : (
          <div className="payments-cards">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="payment-card">
                <div className="payment-card-header">
                  <span className={`type-badge ${payment.type}`}>
                    {payment.type === "donation" ? "🎁" : "👥"}{" "}
                    {t(`admin.payments.types.${payment.type}`)}
                  </span>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(payment.status) }}
                  >
                    {t(`admin.payments.status.${payment.status}`)}
                  </span>
                </div>
                <div className="payment-card-amount">
                  {formatAmount(payment.amount)}
                </div>
                <div className="payment-card-details">
                  <div className="payment-detail">
                    <strong>{t("admin.payments.table.donor")}:</strong>{" "}
                    {payment.donorName || "Anonymous"}
                  </div>
                  <div className="payment-detail">
                    <strong>{t("admin.payments.table.email")}:</strong>{" "}
                    {payment.donorEmail || "-"}
                  </div>
                  <div className="payment-detail">
                    <strong>{t("admin.payments.table.date")}:</strong>{" "}
                    {formatDate(payment.createdAt)}
                  </div>
                  <div className="payment-detail stripe-detail">
                    <strong>{t("admin.payments.table.stripeId")}:</strong>
                    <span className="stripe-id-mobile">
                      {payment.stripePaymentId}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Membership Stats */}
      {stats.monthlyStats && stats.monthlyStats.length > 0 && (
        <div className="monthly-stats">
          <h3>📊 {t("admin.payments.monthlyStats")}</h3>
          <div className="monthly-grid">
            {stats.monthlyStats.map((month) => (
              <div key={month.month} className="month-card">
                <h4>{month.month}</h4>
                <p className="month-amount">€{month.amount.toFixed(2)}</p>
                <p className="month-count">{month.count} members</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPayments;
