import { useState } from "react";
import {
  FaBell,
  FaSearch,
  FaTimes,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaClock,
  FaUserSecret,
  FaMapMarkerAlt,
  FaDesktop,
  FaExclamationTriangle,
} from "react-icons/fa";

// ── Alert Data ───────────────────────────────
const alerts = [
  {
    id: "ALT-1001",
    type: "Brute Force Login Attempt",
    user: "john.doe@company.com",
    department: "Engineering",
    severity: "Critical",
    status: "Open",
    time: "2 mins ago",
    location: "Mumbai, IN",
    device: "Windows 11 — Chrome",
    description: "47 failed login attempts detected within 3 minutes from one IP address.",
    sourceIp: "192.168.1.45",
  },
  {
    id: "ALT-1002",
    type: "Unusual Data Export",
    user: "sarah.k@company.com",
    department: "Finance",
    severity: "High",
    status: "Investigating",
    time: "15 mins ago",
    location: "Pune, IN",
    device: "MacOS — Safari",
    description: "Large export volume detected, 18x above normal user baseline.",
    sourceIp: "10.0.0.112",
  },
  {
    id: "ALT-1003",
    type: "Anomalous Login Time",
    user: "raj.m@company.com",
    department: "HR",
    severity: "Medium",
    status: "Monitoring",
    time: "1 hour ago",
    location: "Delhi, IN",
    device: "Linux — Firefox",
    description: "Login occurred at 3:47 AM, outside user’s normal working pattern.",
    sourceIp: "203.0.113.7",
  },
  {
    id: "ALT-1004",
    type: "Privilege Escalation Attempt",
    user: "mike.t@company.com",
    department: "IT Admin",
    severity: "High",
    status: "Resolved",
    time: "3 hours ago",
    location: "Bangalore, IN",
    device: "Windows 10 — Edge",
    description: "Unauthorized admin API access attempts detected across restricted endpoints.",
    sourceIp: "172.16.0.8",
  },
  {
    id: "ALT-1005",
    type: "Restricted File Access",
    user: "priya.s@company.com",
    department: "Legal",
    severity: "Low",
    status: "Resolved",
    time: "5 hours ago",
    location: "Pune, IN",
    device: "Windows 11 — Chrome",
    description: "User attempted to open documents outside clearance policy scope.",
    sourceIp: "192.168.3.22",
  },
  {
    id: "ALT-1006",
    type: "Phishing Link Click",
    user: "neha.j@company.com",
    department: "Marketing",
    severity: "Medium",
    status: "Open",
    time: "1 day ago",
    location: "Hyderabad, IN",
    device: "MacOS — Chrome",
    description: "Click event on suspicious email link with known malicious domain signature.",
    sourceIp: "198.51.100.19",
  },
];

// ── Config ───────────────────────────────────
const severityConfig = {
  Critical: { color: "#EF4444", bg: "#EF444418" },
  High: { color: "#F97316", bg: "#F9731618" },
  Medium: { color: "#F59E0B", bg: "#F59E0B18" },
  Low: { color: "#10B981", bg: "#10B98118" },
};

const statusConfig = {
  Open: { color: "#EF4444", bg: "#EF444418" },
  Investigating: { color: "#F97316", bg: "#F9731618" },
  Monitoring: { color: "#F59E0B", bg: "#F59E0B18" },
  Resolved: { color: "#10B981", bg: "#10B98118" },
};

// ── Alert Detail Modal ───────────────────────
function AlertDetailModal({ alert, onClose }) {
  if (!alert) return null;

  const sev = severityConfig[alert.severity];
  const stat = statusConfig[alert.status];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
          border: "1px solid #334155",
          borderRadius: 18,
          padding: 26,
          boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
          fontFamily: "Inter, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FaBell size={15} color={sev.color} />
            <h3 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 600, margin: 0 }}>
              Alert Details
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: 8,
              padding: "5px 9px",
              color: "#64748B",
              cursor: "pointer",
            }}
          >
            <FaTimes size={12} />
          </button>
        </div>

        {/* Alert Title */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "#F1F5F9", fontSize: 15, fontWeight: 700, margin: 0 }}>
            {alert.type}
          </p>
          <p style={{ color: "#64748B", fontSize: 12, margin: "4px 0 0" }}>
            {alert.id}
          </p>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <span
            style={{
              background: sev.bg,
              color: sev.color,
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {alert.severity}
          </span>
          <span
            style={{
              background: stat.bg,
              color: stat.color,
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {alert.status}
          </span>
          <span
            style={{
              background: "#0F172A",
              color: "#94A3B8",
              border: "1px solid #334155",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {alert.department}
          </span>
        </div>

        {/* Meta Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { icon: <FaUserSecret size={10} />, label: "User", value: alert.user },
            { icon: <FaClock size={10} />, label: "Time", value: alert.time },
            { icon: <FaMapMarkerAlt size={10} />, label: "Location", value: alert.location },
            { icon: <FaDesktop size={10} />, label: "Device", value: alert.device },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "#0F172A",
                border: "1px solid #1E293B",
                borderRadius: 10,
                padding: "10px 12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                <span style={{ color: "#475569" }}>{item.icon}</span>
                <span style={{ color: "#64748B", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {item.label}
                </span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600, margin: 0 }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div
          style={{
            background: "#0F172A",
            border: "1px solid #334155",
            borderRadius: 10,
            padding: "12px 14px",
            marginBottom: 14,
          }}
        >
          <p
            style={{
              color: "#64748B",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "0 0 8px",
            }}
          >
            Alert Analysis
          </p>
          <p style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            {alert.description}
          </p>
        </div>

        {/* Source IP */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#64748B", fontSize: 12 }}>Source IP:</span>
          <code
            style={{
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: 6,
              padding: "3px 10px",
              color: "#38BDF8",
              fontSize: 12,
            }}
          >
            {alert.sourceIp}
          </code>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────
function RecentSecurityAlertsTable() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("time");
  const [sortDir, setSortDir] = useState("desc");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <FaSort size={10} color="#475569" />;
    return sortDir === "asc"
      ? <FaSortUp size={10} color="#38BDF8" />
      : <FaSortDown size={10} color="#38BDF8" />;
  };

  const filteredAlerts = alerts
    .filter((a) => {
      const matchSearch =
        a.id.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase()) ||
        a.user.toLowerCase().includes(search.toLowerCase()) ||
        a.department.toLowerCase().includes(search.toLowerCase());

      const matchSeverity =
        filterSeverity === "All" || a.severity === filterSeverity;

      return matchSearch && matchSeverity;
    })
    .sort((a, b) => {
      const val = sortDir === "asc" ? 1 : -1;
      if (sortKey === "type" || sortKey === "user" || sortKey === "severity" || sortKey === "status" || sortKey === "department") {
        return a[sortKey].localeCompare(b[sortKey]) * val;
      }
      return a.id.localeCompare(b.id) * val;
    });

  const openCount = alerts.filter((a) => a.status === "Open").length;
  const criticalCount = alerts.filter((a) => a.severity === "Critical").length;

  return (
    <>
      <AlertDetailModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />

      <div
        style={{
          background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #334155",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FaBell size={16} color="#38BDF8" />
              <h2 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 600, margin: 0 }}>
                Recent Security Alerts
              </h2>
              <span
                style={{
                  background: "#EF444422",
                  color: "#EF4444",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 20,
                }}
              >
                {openCount} Open
              </span>
            </div>
            <p style={{ color: "#64748B", fontSize: 12, margin: "4px 0 0" }}>
              Latest insider threat alerts and SOC events
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Total Alerts", value: alerts.length, color: "#38BDF8" },
              { label: "Critical", value: criticalCount, color: "#EF4444" },
            ].map((b) => (
              <div
                key={b.label}
                style={{
                  background: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  padding: "6px 14px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: b.color, fontSize: 18, fontWeight: 700, margin: 0 }}>
                  {b.value}
                </p>
                <p
                  style={{
                    color: "#64748B",
                    fontSize: 9,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    margin: 0,
                  }}
                >
                  {b.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#0F172A",
            border: "1px solid #334155",
            borderRadius: 10,
            padding: "9px 14px",
            marginBottom: 14,
          }}
        >
          <FaSearch size={12} color="#475569" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by alert ID, type, user or department..."
            style={{
              background: "none",
              border: "none",
              outline: "none",
              color: "#F1F5F9",
              fontSize: 13,
              width: "100%",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "none",
                border: "none",
                color: "#64748B",
                cursor: "pointer",
              }}
            >
              <FaTimes size={11} />
            </button>
          )}
        </div>

        {/* Severity Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          {["All", "Critical", "High", "Medium", "Low"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              style={{
                background: filterSeverity === sev ? "#38BDF822" : "#0F172A",
                border: `1px solid ${filterSeverity === sev ? "#38BDF8" : "#334155"}`,
                color: filterSeverity === sev ? "#38BDF8" : "#64748B",
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: 20,
                cursor: "pointer",
              }}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1E293B" }}>
                {[
                  { label: "Alert ID", key: "id" },
                  { label: "Type", key: "type" },
                  { label: "User", key: "user" },
                  { label: "Severity", key: "severity" },
                  { label: "Status", key: "status" },
                  { label: "Time", key: "time" },
                  { label: "Action", key: null },
                ].map((col) => (
                  <th
                    key={col.label}
                    onClick={() => col.key && handleSort(col.key)}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      color: "#64748B",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      cursor: col.key ? "pointer" : "default",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {col.label}
                      {col.key && <SortIcon col={col.key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredAlerts.map((alert, i) => {
                const sev = severityConfig[alert.severity];
                const stat = statusConfig[alert.status];

                return (
                  <tr
                    key={alert.id}
                    style={{
                      borderBottom: "1px solid #1E293B",
                      background: i % 2 === 0 ? "transparent" : "#ffffff05",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#38BDF808")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "#ffffff05")
                    }
                  >
                    <td style={{ padding: "14px" }}>
                      <span style={{ color: "#38BDF8", fontSize: 12, fontWeight: 700 }}>
                        {alert.id}
                      </span>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <div>
                        <p style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 600, margin: 0 }}>
                          {alert.type}
                        </p>
                        <p style={{ color: "#475569", fontSize: 11, margin: "2px 0 0" }}>
                          {alert.department}
                        </p>
                      </div>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <span style={{ color: "#94A3B8", fontSize: 12 }}>{alert.user}</span>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          background: sev.bg,
                          color: sev.color,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: 20,
                          border: `1px solid ${sev.color}33`,
                        }}
                      >
                        {alert.severity}
                      </span>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          background: stat.bg,
                          color: stat.color,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: 20,
                          border: `1px solid ${stat.color}33`,
                        }}
                      >
                        {alert.status}
                      </span>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <span style={{ color: "#64748B", fontSize: 12 }}>{alert.time}</span>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        style={{
                          background: "#38BDF818",
                          border: "1px solid #38BDF833",
                          borderRadius: 8,
                          padding: "6px 14px",
                          color: "#38BDF8",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <FaEye size={11} />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredAlerts.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "40px", textAlign: "center" }}>
                    <FaSearch size={24} color="#475569" style={{ marginBottom: 10 }} />
                    <p style={{ color: "#64748B", margin: 0 }}>No alerts match your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid #1E293B",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <p style={{ color: "#475569", fontSize: 12, margin: 0 }}>
            Showing <span style={{ color: "#94A3B8", fontWeight: 600 }}>{filteredAlerts.length}</span> of{" "}
            <span style={{ color: "#94A3B8", fontWeight: 600 }}>{alerts.length}</span> alerts
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Object.entries(severityConfig).map(([key, cfg]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: cfg.color,
                    display: "inline-block",
                  }}
                />
                <span style={{ color: "#64748B", fontSize: 11 }}>
                  {key}: {alerts.filter((a) => a.severity === key).length}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default RecentSecurityAlertsTable;