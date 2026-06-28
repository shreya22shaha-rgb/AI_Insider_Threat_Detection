import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FaClock,
  FaUserSecret,
  FaDesktop,
  FaMapMarkerAlt,
  FaSearch,
  FaList,
} from "react-icons/fa";
import "../styles/Dashboard.css";
import api from "../services/api";

const statusColors = {
  success:  { color: "#10B981", bg: "#10B98120", label: "Success" },
  warning:  { color: "#F59E0B", bg: "#F59E0B20", label: "Warning" },
  info:     { color: "#38BDF8", bg: "#38BDF820", label: "Info" },
  critical: { color: "#EF4444", bg: "#EF444420", label: "Critical" },
  high:     { color: "#F97316", bg: "#F9731620", label: "High" },
  medium:   { color: "#F59E0B", bg: "#F59E0B20", label: "Medium" },
  low:      { color: "#10B981", bg: "#10B98120", label: "Low" },
};

function getStatusStyle(status) {
  const key = status?.toLowerCase();
  return statusColors[key] || { color: "#94A3B8", bg: "#94A3B820", label: status || "Unknown" };
}

function SkeletonRow() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i} style={{ padding: "14px" }}>
          <div style={{
            height: 14, borderRadius: 6,
            background: "linear-gradient(90deg,#1E293B 25%,#334155 50%,#1E293B 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.2s ease-in-out infinite",
            width: i === 0 ? "70px" : i === 1 ? "130px" : "100px",
          }} />
        </td>
      ))}
    </tr>
  );
}

function ActivityLogs() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    // Try /activities first, fallback to /audit-logs
    api.get("/activities")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.activities || [];
        setActivities(data);
      })
      .catch(() => {
        // fallback to audit-logs
        api.get("/audit-logs")
          .then((res) => {
            const data = Array.isArray(res.data) ? res.data : res.data?.logs || [];
            setActivities(data);
          })
          .catch(() => setError("Failed to load activity logs."));
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = activities.filter((log) => {
    const matchFilter =
      filter === "All" ||
      log.risk_level?.toLowerCase() === filter.toLowerCase() ||
      log.status?.toLowerCase() === filter.toLowerCase();

    const matchSearch =
      !search ||
      log.employee_name?.toLowerCase().includes(search.toLowerCase()) ||
      log.activity_type?.toLowerCase().includes(search.toLowerCase()) ||
      log.department?.toLowerCase().includes(search.toLowerCase()) ||
      log.log_id?.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  const totalLogs = activities.length;
  const criticalCount = activities.filter(
    (a) => a.risk_level?.toLowerCase() === "critical" || a.risk_level?.toLowerCase() === "high"
  ).length;

  return (
    <>
      <Sidebar />
      <div className="dashboard-content">
        <Navbar user={currentUser} />

        <style>{`
          @keyframes shimmer {
            0%   { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Activity Logs</h1>
            <p className="dashboard-subtitle">
              Review user activity, access events, and audit trail history across the system.
            </p>
          </div>
          <div className="dashboard-live-badge">
            <span className="live-dot"></span>
            AUDIT TRAIL
          </div>
        </div>

        <div style={{
          background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #334155",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FaList color="#38BDF8" size={15} />
                <h2 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 600, margin: 0 }}>
                  Recent Activity Logs
                </h2>
              </div>
              <p style={{ color: "#64748B", fontSize: 12, marginTop: 4 }}>
                Security-relevant events and employee actions.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "TOTAL LOGS",  value: totalLogs,    color: "#38BDF8" },
                { label: "HIGH RISK",   value: criticalCount, color: "#EF4444" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "#0F172A", border: "1px solid #334155",
                  borderRadius: 10, padding: "8px 16px", textAlign: "center", minWidth: 70,
                }}>
                  <div style={{ color: s.color, fontSize: 20, fontWeight: 700 }}>{s.value}</div>
                  <div style={{ color: "#64748B", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#0F172A", border: "1px solid #334155",
            borderRadius: 10, padding: "10px 16px", marginBottom: 14,
          }}>
            <FaSearch color="#64748B" size={12} />
            <input
              type="text"
              placeholder="Search by employee, activity type, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "transparent", border: "none", outline: "none",
                color: "#F1F5F9", fontSize: 13, width: "100%",
              }}
            />
          </div>

          {/* Filter Buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["All", "Critical", "High", "Medium", "Low"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? "#38BDF820" : "#0F172A",
                  border: `1px solid ${filter === f ? "#38BDF8" : "#334155"}`,
                  color: filter === f ? "#38BDF8" : "#64748B",
                  borderRadius: 999, padding: "5px 14px",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1E293B" }}>
                  {["LOG ID", "ACTIVITY TYPE", "EMPLOYEE", "DEPARTMENT", "RISK LEVEL", "TIME"].map((col) => (
                    <th key={col} style={{
                      padding: "10px 14px", textAlign: "left",
                      color: "#475569", fontSize: 11, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap",
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : error ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "24px", textAlign: "center" }}>
                      <div style={{
                        color: "#FCA5A5", background: "#1f2937",
                        border: "1px solid #7f1d1d", borderRadius: 10, padding: "12px 20px",
                        display: "inline-block",
                      }}>
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ color: "#64748B", textAlign: "center", padding: "32px 0", fontSize: 14 }}>
                      No activity logs found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log, idx) => {
                    const riskStyle = getStatusStyle(log.risk_level || log.status);
                    return (
                      <tr
                        key={idx}
                        style={{ borderBottom: "1px solid #1E293B", transition: "background 0.15s" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#1E293B"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "14px", color: "#38BDF8", fontSize: 12, fontWeight: 700 }}>
                          {log.log_id || log.activity_id || `LOG-${1000 + idx + 1}`}
                        </td>
                        <td style={{ padding: "14px" }}>
                          <div style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 600 }}>
                            {log.activity_type || log.event || "—"}
                          </div>
                        </td>
                        <td style={{ padding: "14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8", fontSize: 12 }}>
                            <FaUserSecret size={10} color="#475569" />
                            {log.employee_name || log.user || "—"}
                          </div>
                        </td>
                        <td style={{ padding: "14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8", fontSize: 12 }}>
                            <FaMapMarkerAlt size={10} color="#475569" />
                            {log.department || "—"}
                          </div>
                        </td>
                        <td style={{ padding: "14px" }}>
                          <span style={{
                            background: riskStyle.bg, color: riskStyle.color,
                            border: `1px solid ${riskStyle.color}33`,
                            fontSize: 11, fontWeight: 700,
                            padding: "4px 12px", borderRadius: 20,
                          }}>
                            {riskStyle.label}
                          </span>
                        </td>
                        <td style={{ padding: "14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748B", fontSize: 12 }}>
                            <FaClock size={10} color="#475569" />
                            {log.timestamp
                              ? new Date(log.timestamp).toLocaleString()
                              : "Just now"}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && !error && (
            <div style={{ marginTop: 16, color: "#475569", fontSize: 12 }}>
              Showing{" "}
              <strong style={{ color: "#94A3B8" }}>{filtered.length}</strong> of{" "}
              <strong style={{ color: "#94A3B8" }}>{totalLogs}</strong> logs
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ActivityLogs;