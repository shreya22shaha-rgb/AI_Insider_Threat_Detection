import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import api from "../services/api";
import { FaBell, FaEye, FaSearch, FaTimes } from "react-icons/fa";

function getSeverityStyle(severity) {
  switch (severity?.toLowerCase()) {
    case "critical":
      return { color: "#EF4444", bg: "#EF444420", label: "Critical" };
    case "high":
      return { color: "#F97316", bg: "#F9731620", label: "High" };
    case "medium":
      return { color: "#F59E0B", bg: "#F59E0B20", label: "Medium" };
    case "low":
      return { color: "#10B981", bg: "#10B98120", label: "Low" };
    default:
      return { color: "#94A3B8", bg: "#94A3B820", label: severity || "Unknown" };
  }
}

function getAlertStyle(alertText) {
  const key = alertText?.toLowerCase() || "";
  if (key.includes("suspicious")) {
    return { color: "#EF4444", bg: "#EF444420" };
  }
  if (key.includes("review")) {
    return { color: "#F59E0B", bg: "#F59E0B20" };
  }
  if (key.includes("normal")) {
    return { color: "#10B981", bg: "#10B98120" };
  }
  return { color: "#94A3B8", bg: "#94A3B820" };
}

function ThreatAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get("/alerts")
      .then((res) => {
        setAlerts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        setError("Failed to load threat alerts.");
      })
      .finally(() => setLoading(false));
  }, []);

  const alertsWithId = useMemo(() => {
    return alerts.map((a, idx) => ({
      ...a,
      alert_id: `ALT-${1001 + idx}`,
    }));
  }, [alerts]);

  const filtered = useMemo(() => {
    return alertsWithId.filter((alert) => {
      const matchFilter =
        filter === "All" || alert.risk_level?.toLowerCase() === filter.toLowerCase();

      const matchSearch =
        !search ||
        alert.alert_id.toLowerCase().includes(search.toLowerCase()) ||
        (alert.activity_type || "").toLowerCase().includes(search.toLowerCase()) ||
        (alert.employee_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (alert.alert || "").toLowerCase().includes(search.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [alertsWithId, search, filter]);

  const totalAlerts = alertsWithId.length;
  const criticalCount = alertsWithId.filter(
    (a) => a.risk_level?.toLowerCase() === "critical"
  ).length;
  const suspiciousCount = alertsWithId.filter((a) =>
    a.alert?.toLowerCase().includes("suspicious")
  ).length;

  const severityCounts = {
    critical: alertsWithId.filter((a) => a.risk_level?.toLowerCase() === "critical").length,
    high: alertsWithId.filter((a) => a.risk_level?.toLowerCase() === "high").length,
    medium: alertsWithId.filter((a) => a.risk_level?.toLowerCase() === "medium").length,
    low: alertsWithId.filter((a) => a.risk_level?.toLowerCase() === "low").length,
  };

  return (
    <>
      <Sidebar />
      <div className="dashboard-content">
        <Navbar user={currentUser} />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Threat Alerts</h1>
            <p className="dashboard-subtitle">
              Review recent security alerts, investigate suspicious activity, and monitor threat severity.
            </p>
          </div>
          <div className="dashboard-live-badge">
            <span className="live-dot"></span>
            ALERT FEED
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
            border: "1px solid #334155",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FaBell color="#F97316" size={16} />
                <h2 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 600, margin: 0 }}>
                  Recent Security Alerts
                </h2>
                <span
                  style={{
                    background: "#F9731620",
                    color: "#F97316",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 10px",
                    borderRadius: 999,
                  }}
                >
                  {suspiciousCount} Suspicious
                </span>
              </div>
              <p style={{ color: "#64748B", fontSize: 12, marginTop: 4 }}>
                Latest insider threat alerts and SOC events
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "TOTAL ALERTS", value: totalAlerts, color: "#F97316" },
                { label: "CRITICAL", value: criticalCount, color: "#EF4444" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#0F172A",
                    border: "1px solid #334155",
                    borderRadius: 10,
                    padding: "8px 16px",
                    textAlign: "center",
                    minWidth: 70,
                  }}
                >
                  <div style={{ color: stat.color, fontSize: 20, fontWeight: 700 }}>
                    {stat.value}
                  </div>
                  <div
                    style={{
                      color: "#64748B",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: 10,
              padding: "10px 16px",
              marginBottom: 16,
            }}
          >
            <FaSearch color="#64748B" size={13} />
            <input
              type="text"
              placeholder="Search by alert ID, type, user or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#F1F5F9",
                fontSize: 13,
                width: "100%",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["All", "Critical", "High", "Medium", "Low"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? "#3B82F620" : "#0F172A",
                  border: `1px solid ${filter === f ? "#3B82F6" : "#334155"}`,
                  color: filter === f ? "#3B82F6" : "#64748B",
                  borderRadius: 999,
                  padding: "5px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ color: "#64748B", padding: "32px 0", textAlign: "center" }}>
              Loading alerts...
            </div>
          ) : error ? (
            <div
              style={{
                color: "#FCA5A5",
                padding: "12px 16px",
                background: "#1f2937",
                borderRadius: 10,
                border: "1px solid #7f1d1d",
              }}
            >
              {error}
            </div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #1E293B" }}>
                      {["ALERT ID", "TYPE", "USER", "SEVERITY", "MESSAGE", "ACTION"].map(
                        (col) => (
                          <th
                            key={col}
                            style={{
                              color: "#475569",
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              padding: "10px 12px",
                              textAlign: "left",
                            }}
                          >
                            {col}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            color: "#64748B",
                            textAlign: "center",
                            padding: "32px 0",
                            fontSize: 14,
                          }}
                        >
                          No alerts found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((alert) => {
                        const sev = getSeverityStyle(alert.risk_level);
                        const msgStyle = getAlertStyle(alert.alert);

                        return (
                          <tr
                            key={alert.alert_id}
                            style={{ borderBottom: "1px solid #1E293B" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#1E293B")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <td
                              style={{
                                padding: "14px 12px",
                                color: "#38BDF8",
                                fontSize: 13,
                                fontWeight: 600,
                              }}
                            >
                              {alert.alert_id}
                            </td>

                            <td style={{ padding: "14px 12px" }}>
                              <div style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 500 }}>
                                {alert.activity_type || "Unknown"}
                              </div>
                            </td>

                            <td
                              style={{
                                padding: "14px 12px",
                                color: "#94A3B8",
                                fontSize: 13,
                              }}
                            >
                              {alert.employee_name || "—"}
                            </td>

                            <td style={{ padding: "14px 12px" }}>
                              <span
                                style={{
                                  background: sev.bg,
                                  color: sev.color,
                                  borderRadius: 999,
                                  padding: "4px 12px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                }}
                              >
                                {sev.label}
                              </span>
                            </td>

                            <td style={{ padding: "14px 12px" }}>
                              <span
                                style={{
                                  background: msgStyle.bg,
                                  color: msgStyle.color,
                                  borderRadius: 999,
                                  padding: "4px 12px",
                                  fontSize: 12,
                                  fontWeight: 700,
                                }}
                              >
                                {alert.alert || "—"}
                              </span>
                            </td>

                            <td style={{ padding: "14px 12px" }}>
                              <button
                                onClick={() => setSelectedAlert(alert)}
                                style={{
                                  background: "#1E40AF20",
                                  color: "#60A5FA",
                                  border: "1px solid #1E40AF",
                                  borderRadius: 8,
                                  padding: "6px 14px",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <FaEye size={11} /> View
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 16,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <span style={{ color: "#475569", fontSize: 12 }}>
                  Showing <strong style={{ color: "#94A3B8" }}>{filtered.length}</strong> of{" "}
                  <strong style={{ color: "#94A3B8" }}>{totalAlerts}</strong> alerts
                </span>

                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {[
                    { label: "Critical", color: "#EF4444", count: severityCounts.critical },
                    { label: "High", color: "#F97316", count: severityCounts.high },
                    { label: "Medium", color: "#F59E0B", count: severityCounts.medium },
                    { label: "Low", color: "#10B981", count: severityCounts.low },
                  ].map((s) => (
                    <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: s.color,
                          display: "inline-block",
                        }}
                      />
                      <span style={{ color: "#64748B", fontSize: 11 }}>
                        {s.label}: {s.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedAlert && (
        <div
          onClick={() => setSelectedAlert(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2, 6, 23, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 460,
              background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
              border: "1px solid #334155",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div>
                <h3 style={{ color: "#F8FAFC", margin: 0, fontSize: 20 }}>
                  {selectedAlert.alert_id}
                </h3>
                <p style={{ color: "#64748B", margin: "4px 0 0", fontSize: 12 }}>
                  {selectedAlert.activity_type}
                </p>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                style={{
                  color: "#94A3B8",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 10, background: "#0F172A", border: "1px solid #1E293B" }}>
                <div style={{ color: "#64748B", fontSize: 11, marginBottom: 4 }}>Employee</div>
                <div style={{ color: "#F1F5F9", fontSize: 14, fontWeight: 600 }}>
                  {selectedAlert.employee_name}
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 10, background: "#0F172A", border: "1px solid #1E293B" }}>
                <div style={{ color: "#64748B", fontSize: 11, marginBottom: 4 }}>Activity Type</div>
                <div style={{ color: "#F1F5F9", fontSize: 14, fontWeight: 600 }}>
                  {selectedAlert.activity_type}
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 10, background: "#0F172A", border: "1px solid #1E293B" }}>
                <div style={{ color: "#64748B", fontSize: 11, marginBottom: 4 }}>Severity</div>
                <div style={{ color: getSeverityStyle(selectedAlert.risk_level).color, fontSize: 14, fontWeight: 700 }}>
                  {selectedAlert.risk_level}
                </div>
              </div>

              <div style={{ padding: 12, borderRadius: 10, background: "#0F172A", border: "1px solid #1E293B" }}>
                <div style={{ color: "#64748B", fontSize: 11, marginBottom: 4 }}>Alert Message</div>
                <div style={{ color: getAlertStyle(selectedAlert.alert).color, fontSize: 14, fontWeight: 700 }}>
                  {selectedAlert.alert}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ThreatAlerts;