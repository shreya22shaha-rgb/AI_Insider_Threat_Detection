import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  FaClock,
  FaUserSecret,
  FaMapMarkerAlt,
  FaSearch,
  FaList,
} from "react-icons/fa";
import "../styles/Dashboard.css";
import api from "../services/api";

const statusColors = {
  success: { color: "#10B981", bg: "#10B98120", label: "Success" },
  warning: { color: "#F59E0B", bg: "#F59E0B20", label: "Warning" },
  info: { color: "#38BDF8", bg: "#38BDF820", label: "Info" },
  critical: { color: "#EF4444", bg: "#EF444420", label: "Critical" },
  high: { color: "#F97316", bg: "#F9731620", label: "High" },
  medium: { color: "#F59E0B", bg: "#F59E0B20", label: "Medium" },
  low: { color: "#10B981", bg: "#10B98120", label: "Low" },
};

function getStatusStyle(status) {
  const key = status?.toLowerCase();
  return (
    statusColors[key] || {
      color: "var(--text-muted)",
      bg: "color-mix(in srgb, var(--text-muted) 12%, transparent)",
      label: status || "Unknown",
    }
  );
}

function SkeletonRow() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i} style={{ padding: "14px" }}>
          <div
            style={{
              height: 14,
              borderRadius: 6,
              background:
                "linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-surface-3) 50%, var(--bg-surface) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.2s ease-in-out infinite",
              width: i === 0 ? "70px" : i === 1 ? "130px" : "100px",
            }}
          />
        </td>
      ))}
    </tr>
  );
}

function ActivityLogs({ theme, toggleTheme }) {
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
    setLoading(true);
    setError("");

    api
      .get("/activities")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.activities || [];
        setActivities(data);
      })
      .catch((err) => {
        console.error("Activity logs error:", err);
        setError("Failed to load activity logs.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return activities.filter((log) => {
      const riskOrStatus = log.risk_level || log.status || "";

      const matchFilter =
        filter === "All" || riskOrStatus.toLowerCase() === filter.toLowerCase();

      const query = search.toLowerCase();

      const matchSearch =
        !search ||
        log.employee_name?.toLowerCase().includes(query) ||
        log.activity_type?.toLowerCase().includes(query) ||
        log.department?.toLowerCase().includes(query) ||
        String(log.log_id || log.activity_id || "").toLowerCase().includes(query);

      return matchFilter && matchSearch;
    });
  }, [activities, search, filter]);

  const totalLogs = activities.length;

  const criticalCount = activities.filter((a) => {
    const level = a.risk_level?.toLowerCase();
    return level === "critical" || level === "high";
  }).length;

  return (
    <>
      <Sidebar />
      <div className="dashboard-content">
        <Navbar user={currentUser} theme={theme} toggleTheme={toggleTheme} />

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

        <div
          style={{
            background:
              "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-2) 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid var(--border-color)",
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
                <FaList color="var(--accent-cyan)" size={15} />
                <h2
                  style={{
                    color: "var(--text-primary)",
                    fontSize: 16,
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Recent Activity Logs
                </h2>
              </div>
              <p
                style={{
                  color: "var(--text-faint)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Security-relevant events and employee actions from GET /activities.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "TOTAL LOGS", value: totalLogs, color: "var(--accent-cyan)" },
                { label: "HIGH RISK", value: criticalCount, color: "var(--accent-red)" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 10,
                    padding: "8px 16px",
                    textAlign: "center",
                    minWidth: 70,
                  }}
                >
                  <div style={{ color: s.color, fontSize: 20, fontWeight: 700 }}>
                    {s.value}
                  </div>
                  <div
                    style={{
                      color: "var(--text-faint)",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s.label}
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
              marginBottom: 14,
            }}
          >
            <FaSearch color="var(--text-faint)" size={12} />
            <input
              type="text"
              placeholder="Search by employee, activity type, department..."
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

          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["All", "Critical", "High", "Medium", "Low"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background:
                    filter === f
                      ? "color-mix(in srgb, var(--accent-cyan) 12%, transparent)"
                      : "var(--bg-surface-2)",
                  border: `1px solid ${
                    filter === f ? "var(--accent-cyan)" : "var(--border-color)"
                  }`,
                  color: filter === f ? "var(--accent-cyan)" : "var(--text-faint)",
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

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-soft)" }}>
                  {["LOG ID", "ACTIVITY TYPE", "EMPLOYEE", "DEPARTMENT", "RISK LEVEL", "TIME"].map(
                    (col) => (
                      <th
                        key={col}
                        style={{
                          padding: "10px 14px",
                          textAlign: "left",
                          color: "var(--text-faint)",
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                ) : error ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "24px", textAlign: "center" }}>
                      <div
                        style={{
                          color: "var(--danger-text)",
                          background: "var(--bg-surface)",
                          border: "1px solid var(--danger-text)",
                          borderRadius: 10,
                          padding: "12px 20px",
                          display: "inline-block",
                        }}
                      >
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
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
                      No activity logs found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log, idx) => {
                    const riskStyle = getStatusStyle(log.risk_level || log.status);

                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: "1px solid var(--border-soft)",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "var(--bg-hover)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td
                          style={{
                            padding: "14px",
                            color: "var(--accent-cyan)",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {log.log_id || log.activity_id || `LOG-${1000 + idx + 1}`}
                        </td>

                        <td style={{ padding: "14px" }}>
                          <div
                            style={{
                              color: "var(--text-primary)",
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            {log.activity_type || log.event || "—"}
                          </div>
                        </td>

                        <td style={{ padding: "14px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              color: "var(--text-muted)",
                              fontSize: 12,
                            }}
                          >
                            <FaUserSecret size={10} color="var(--text-secondary)" />
                            {log.employee_name || log.user || "—"}
                          </div>
                        </td>

                        <td style={{ padding: "14px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              color: "var(--text-muted)",
                              fontSize: 12,
                            }}
                          >
                            <FaMapMarkerAlt size={10} color="var(--text-secondary)" />
                            {log.department || "—"}
                          </div>
                        </td>

                        <td style={{ padding: "14px" }}>
                          <span
                            style={{
                              background: riskStyle.bg,
                              color: riskStyle.color,
                              border: `1px solid ${riskStyle.color}33`,
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "4px 12px",
                              borderRadius: 20,
                            }}
                          >
                            {riskStyle.label}
                          </span>
                        </td>

                        <td style={{ padding: "14px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              color: "var(--text-faint)",
                              fontSize: 12,
                            }}
                          >
                            <FaClock size={10} color="var(--text-secondary)" />
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

          {!loading && !error && (
            <div style={{ marginTop: 16, color: "var(--text-secondary)", fontSize: 12 }}>
              Showing <strong style={{ color: "var(--text-muted)" }}>{filtered.length}</strong> of{" "}
              <strong style={{ color: "var(--text-muted)" }}>{totalLogs}</strong> logs
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ActivityLogs;