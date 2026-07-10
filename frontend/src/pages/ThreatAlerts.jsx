import { useState, useEffect, useMemo } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import api from "../services/api";
import {
  FaBell,
  FaEye,
  FaSearch,
  FaTimes,
  FaFileCsv,
  FaFilePdf,
} from "react-icons/fa";

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
      return {
        color: "var(--text-muted)",
        bg: "color-mix(in srgb, var(--text-muted) 12%, transparent)",
        label: severity || "Unknown",
      };
  }
}

function getDisplayAlertMessage(alertItem) {
  const severity = alertItem?.risk_level?.toLowerCase() || "";
  const activityType = alertItem?.activity_type || "Threat Activity";
  const backendMessage = (alertItem?.alert || "").trim();
  const messageLower = backendMessage.toLowerCase();

  const invalidNormalMessage =
    !backendMessage ||
    messageLower === "normal activity" ||
    messageLower === "normal" ||
    messageLower === "safe";

  if (severity === "critical") {
    if (invalidNormalMessage) {
      return `Critical ${activityType} Detected`;
    }
    return backendMessage;
  }

  if (severity === "high") {
    if (invalidNormalMessage) {
      return `${activityType} Attempt Detected`;
    }
    return backendMessage;
  }

  if (severity === "medium") {
    if (!backendMessage) {
      return `${activityType} Requires Review`;
    }
    return backendMessage;
  }

  if (severity === "low") {
    return backendMessage || `${activityType} Logged`;
  }

  return backendMessage || `${activityType} Alert`;
}

function getAlertStyle(alertText) {
  const key = alertText?.toLowerCase() || "";
  if (key.includes("critical") || key.includes("detected") || key.includes("attempt")) {
    return { color: "#EF4444", bg: "#EF444420" };
  }
  if (key.includes("review") || key.includes("warning")) {
    return { color: "#F59E0B", bg: "#F59E0B20" };
  }
  if (key.includes("normal")) {
    return { color: "#10B981", bg: "#10B98120" };
  }
  return {
    color: "var(--text-muted)",
    bg: "color-mix(in srgb, var(--text-muted) 12%, transparent)",
  };
}

function ThreatAlerts({ theme, toggleTheme }) {
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
      display_message: getDisplayAlertMessage(a),
    }));
  }, [alerts]);

  const filtered = useMemo(() => {
    return alertsWithId.filter((alert) => {
      const matchFilter =
        filter === "All" || alert.risk_level?.toLowerCase() === filter.toLowerCase();

      const query = search.toLowerCase();

      const matchSearch =
        !search ||
        alert.alert_id.toLowerCase().includes(query) ||
        (alert.activity_type || "").toLowerCase().includes(query) ||
        (alert.employee_name || "").toLowerCase().includes(query) ||
        (alert.display_message || "").toLowerCase().includes(query);

      return matchFilter && matchSearch;
    });
  }, [alertsWithId, search, filter]);

  const totalAlerts = alertsWithId.length;
  const criticalCount = alertsWithId.filter(
    (a) => a.risk_level?.toLowerCase() === "critical"
  ).length;
  const suspiciousCount = alertsWithId.filter((a) =>
    a.display_message?.toLowerCase().includes("detected")
  ).length;

  const severityCounts = {
    critical: alertsWithId.filter((a) => a.risk_level?.toLowerCase() === "critical").length,
    high: alertsWithId.filter((a) => a.risk_level?.toLowerCase() === "high").length,
    medium: alertsWithId.filter((a) => a.risk_level?.toLowerCase() === "medium").length,
    low: alertsWithId.filter((a) => a.risk_level?.toLowerCase() === "low").length,
  };

  const exportToCSV = () => {
    const headers = [
      "Alert ID",
      "Activity Type",
      "Employee Name",
      "Severity",
      "Message",
    ];

    const rows = filtered.map((alert) => [
      alert.alert_id ?? "",
      alert.activity_type ?? "",
      alert.employee_name ?? "",
      alert.risk_level ?? "",
      alert.display_message ?? "",
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const csvWithBom = "\uFEFF" + csvContent;
    const blob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "threat-alerts-export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const doc = new jsPDF("l", "mm", "a4");

    doc.setFontSize(16);
    doc.text("Threat Alerts Export Report", 14, 16);

    doc.setFontSize(10);
    doc.text(`Total Exported Alerts: ${filtered.length}`, 14, 24);
    doc.text(`Current Filter: ${filter}`, 90, 24);
    doc.text(`Search Query: ${search || "None"}`, 150, 24);

    autoTable(doc, {
      startY: 30,
      head: [["Alert ID", "Activity Type", "Employee Name", "Severity", "Message"]],
      body: filtered.map((alert) => [
        alert.alert_id ?? "",
        alert.activity_type ?? "",
        alert.employee_name ?? "",
        alert.risk_level ?? "",
        alert.display_message ?? "",
      ]),
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [30, 41, 59],
      },
      columnStyles: {
        0: { cellWidth: 24 },
        1: { cellWidth: 45 },
        2: { cellWidth: 35 },
        3: { cellWidth: 24 },
        4: { cellWidth: 110 },
      },
    });

    doc.save("threat-alerts-export.pdf");
  };

  return (
    <>
      <Sidebar />
      <div className="dashboard-content">
        <Navbar user={currentUser} theme={theme} toggleTheme={toggleTheme} />

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
            background:
              "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-2) 100%)",
            border: "1px solid var(--border-color)",
            borderRadius: 16,
            padding: 24,
            boxShadow: "var(--shadow-card)",
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
                <FaBell color="var(--accent-orange)" size={16} />
                <h2
                  style={{
                    color: "var(--text-primary)",
                    fontSize: 16,
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Recent Security Alerts
                </h2>
                <span
                  style={{
                    background: "rgba(249, 115, 22, 0.12)",
                    color: "var(--accent-orange)",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 10px",
                    borderRadius: 999,
                  }}
                >
                  {suspiciousCount} Detected
                </span>
              </div>
              <p style={{ color: "var(--text-faint)", fontSize: 12, marginTop: 4 }}>
                Latest insider threat alerts and SOC events
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: "TOTAL ALERTS", value: totalAlerts, color: "var(--accent-orange)" },
                { label: "CRITICAL", value: criticalCount, color: "var(--accent-red)" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border-color)",
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
                      color: "var(--text-faint)",
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
              background: "var(--bg-surface-2)",
              border: "1px solid var(--border-color)",
              borderRadius: 10,
              padding: "10px 16px",
              marginBottom: 16,
            }}
          >
            <FaSearch color="var(--text-faint)" size={13} />
            <input
              type="text"
              placeholder="Search by alert ID, type, user or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: 13,
                width: "100%",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["All", "Critical", "High", "Medium", "Low"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background:
                      filter === f
                        ? "color-mix(in srgb, var(--accent-blue) 12%, transparent)"
                        : "var(--bg-surface-2)",
                    border: `1px solid ${
                      filter === f ? "var(--accent-blue)" : "var(--border-color)"
                    }`,
                    color: filter === f ? "var(--accent-blue)" : "var(--text-faint)",
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

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={exportToCSV}
                type="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "color-mix(in srgb, var(--accent-green) 14%, transparent)",
                  color: "var(--accent-green)",
                  border: "1px solid var(--accent-green)",
                  borderRadius: 10,
                  padding: "8px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <FaFileCsv size={14} />
                Export CSV
              </button>

              <button
                onClick={exportToPDF}
                type="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "color-mix(in srgb, var(--accent-red) 14%, transparent)",
                  color: "var(--accent-red)",
                  border: "1px solid var(--accent-red)",
                  borderRadius: 10,
                  padding: "8px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <FaFilePdf size={14} />
                Export PDF
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ color: "var(--text-faint)", padding: "32px 0", textAlign: "center" }}>
              Loading alerts...
            </div>
          ) : error ? (
            <div
              style={{
                color: "var(--danger-text)",
                padding: "12px 16px",
                background: "var(--bg-surface)",
                borderRadius: 10,
                border: "1px solid var(--danger-text)",
              }}
            >
              {error}
            </div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-soft)" }}>
                      {["ALERT ID", "TYPE", "USER", "SEVERITY", "MESSAGE", "ACTION"].map((col) => (
                        <th
                          key={col}
                          style={{
                            color: "var(--text-secondary)",
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
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{
                            color: "var(--text-faint)",
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
                        const msgStyle = getAlertStyle(alert.display_message);

                        return (
                          <tr
                            key={alert.alert_id}
                            style={{ borderBottom: "1px solid var(--border-soft)" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "var(--bg-hover)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <td
                              style={{
                                padding: "14px 12px",
                                color: "var(--accent-cyan)",
                                fontSize: 13,
                                fontWeight: 600,
                              }}
                            >
                              {alert.alert_id}
                            </td>

                            <td style={{ padding: "14px 12px" }}>
                              <div
                                style={{
                                  color: "var(--text-primary)",
                                  fontSize: 13,
                                  fontWeight: 500,
                                }}
                              >
                                {alert.activity_type || "Unknown"}
                              </div>
                            </td>

                            <td
                              style={{
                                padding: "14px 12px",
                                color: "var(--text-muted)",
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
                                  border: `1px solid ${sev.color}33`,
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
                                  border: `1px solid ${msgStyle.color}33`,
                                  display: "inline-block",
                                }}
                              >
                                {alert.display_message}
                              </span>
                            </td>

                            <td style={{ padding: "14px 12px" }}>
                              <button
                                onClick={() => setSelectedAlert(alert)}
                                style={{
                                  background:
                                    "color-mix(in srgb, var(--accent-blue) 12%, transparent)",
                                  color: "#60A5FA",
                                  border: "1px solid var(--accent-blue)",
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
                <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                  Showing <strong style={{ color: "var(--text-muted)" }}>{filtered.length}</strong> of{" "}
                  <strong style={{ color: "var(--text-muted)" }}>{totalAlerts}</strong> alerts
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
                      <span style={{ color: "var(--text-faint)", fontSize: 11 }}>
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
            background:
              theme === "dark" ? "rgba(2, 6, 23, 0.75)" : "rgba(15, 23, 42, 0.35)",
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
              background:
                "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-2) 100%)",
              border: "1px solid var(--border-color)",
              borderRadius: 16,
              padding: 24,
              boxShadow: "var(--shadow-card)",
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
                <h3 style={{ color: "var(--text-primary)", margin: 0, fontSize: 20 }}>
                  {selectedAlert.alert_id}
                </h3>
                <p style={{ color: "var(--text-faint)", margin: "4px 0 0", fontSize: 12 }}>
                  {selectedAlert.activity_type}
                </p>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                style={{
                  color: "var(--text-muted)",
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
              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                <div style={{ color: "var(--text-faint)", fontSize: 11, marginBottom: 4 }}>
                  Employee
                </div>
                <div style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 600 }}>
                  {selectedAlert.employee_name}
                </div>
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                <div style={{ color: "var(--text-faint)", fontSize: 11, marginBottom: 4 }}>
                  Activity Type
                </div>
                <div style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 600 }}>
                  {selectedAlert.activity_type}
                </div>
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                <div style={{ color: "var(--text-faint)", fontSize: 11, marginBottom: 4 }}>
                  Severity
                </div>
                <div
                  style={{
                    color: getSeverityStyle(selectedAlert.risk_level).color,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {selectedAlert.risk_level}
                </div>
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 10,
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                <div style={{ color: "var(--text-faint)", fontSize: 11, marginBottom: 4 }}>
                  Alert Message
                </div>
                <div
                  style={{
                    color: getAlertStyle(selectedAlert.display_message).color,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {selectedAlert.display_message}
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