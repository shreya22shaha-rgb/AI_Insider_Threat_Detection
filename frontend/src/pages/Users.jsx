import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import api from "../services/api";
import { FaSearch, FaEye, FaUsers, FaExclamationTriangle } from "react-icons/fa";

function getRiskStyle(score) {
  if (score >= 75) {
    return {
      label: "Critical",
      color: "#EF4444",
      bg: "#EF444420",
      bar: "#EF4444",
    };
  }
  if (score >= 55) {
    return {
      label: "High",
      color: "#F97316",
      bg: "#F9731620",
      bar: "#F97316",
    };
  }
  if (score >= 35) {
    return {
      label: "Medium",
      color: "#F59E0B",
      bg: "#F59E0B20",
      bar: "#F59E0B",
    };
  }
  return {
    label: "Low",
    color: "#10B981",
    bg: "#10B98120",
    bar: "#10B981",
  };
}

function Users() {
  const [users, setUsers] = useState([]);
  const [riskScores, setRiskScores] = useState([]);
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
    Promise.all([
      api.get("/top-risky-employees").catch(() => ({ data: [] })),
      api.get("/employee-risk-score").catch(() => ({ data: [] })),
    ])
      .then(([usersRes, scoresRes]) => {
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : usersRes.data?.employees || []);
        setRiskScores(Array.isArray(scoresRes.data) ? scoresRes.data : scoresRes.data?.scores || []);
      })
      .catch((err) => {
        console.error("Users API error:", err);
        setError("Failed to load users data.");
      })
      .finally(() => setLoading(false));
  }, []);

  const mergedUsers = useMemo(() => {
    const scoreMap = new Map();

    riskScores.forEach((item) => {
      const key = (item.employee_name || item.user || "").toLowerCase();
      scoreMap.set(key, item);
    });

    return users.map((user, index) => {
      const name = user.employee_name || user.user || `Employee ${index + 1}`;
      const matched = scoreMap.get(name.toLowerCase());

      const riskScore =
        matched?.risk_score ??
        user.risk_score ??
        user.score ??
        Math.min((user.high_risk_count || 0) * 20, 100);

      const threats =
        user.high_risk_count ??
        matched?.high_risk_count ??
        matched?.threats ??
        0;

      return {
        id: user.employee_id || `EMP-${index + 1}`,
        name,
        department: matched?.department || user.department || "Unknown",
        riskScore,
        threats,
        lastActive: user.last_activity || matched?.last_activity || "Recently active",
      };
    });
  }, [users, riskScores]);

  const filteredUsers = mergedUsers.filter((user) => {
    const risk = getRiskStyle(user.riskScore);

    const matchFilter = filter === "All" || risk.label === filter;
    const matchSearch =
      !search ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toLowerCase().includes(search.toLowerCase()) ||
      user.department.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  const summary = {
    total: mergedUsers.length,
    critical: mergedUsers.filter((u) => getRiskStyle(u.riskScore).label === "Critical").length,
    high: mergedUsers.filter((u) => getRiskStyle(u.riskScore).label === "High").length,
  };

  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar user={currentUser} />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Users</h1>
            <p className="dashboard-subtitle">
              Monitor employee profiles, search high-risk users, and review user activity risk.
            </p>
          </div>

          <div className="dashboard-live-badge">
            <span className="live-dot"></span>
            USER MONITORING
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid #334155",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FaUsers color="#38BDF8" size={15} />
                <h2 style={{ color: "#F1F5F9", fontSize: 16, margin: 0 }}>
                  High Risk Users
                </h2>
              </div>
              <p style={{ color: "#64748B", fontSize: 12, marginTop: 4 }}>
                AI-monitored employee risk profiles from backend services
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: "Users", value: summary.total, color: "#38BDF8" },
                { label: "Critical", value: summary.critical, color: "#EF4444" },
                { label: "High", value: summary.high, color: "#F97316" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "#0F172A",
                    border: "1px solid #334155",
                    borderRadius: 10,
                    padding: "8px 16px",
                    textAlign: "center",
                    minWidth: 70,
                  }}
                >
                  <div style={{ color: item.color, fontSize: 20, fontWeight: 700 }}>
                    {item.value}
                  </div>
                  <div
                    style={{
                      color: "#64748B",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {item.label}
                  </div>
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
              padding: "10px 16px",
              marginBottom: 16,
            }}
          >
            <FaSearch color="#64748B" size={12} />
            <input
              type="text"
              placeholder="Search by name, ID or department..."
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

          {/* Filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["All", "Critical", "High", "Medium", "Low"].map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                style={{
                  background: filter === level ? "#38BDF820" : "#0F172A",
                  border: `1px solid ${filter === level ? "#38BDF8" : "#334155"}`,
                  color: filter === level ? "#38BDF8" : "#64748B",
                  borderRadius: 999,
                  padding: "5px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ color: "#64748B", textAlign: "center", padding: "40px 0" }}>
              Loading users...
            </div>
          ) : error ? (
            <div
              style={{
                color: "#FCA5A5",
                background: "#111827",
                border: "1px solid #7f1d1d",
                borderRadius: 10,
                padding: 14,
              }}
            >
              {error}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1E293B" }}>
                    {["EMPLOYEE", "DEPARTMENT", "RISK SCORE", "THREATS", "STATUS", "LAST ACTIVE", "ACTION"].map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: "10px 12px",
                          textAlign: "left",
                          color: "#475569",
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ color: "#64748B", textAlign: "center", padding: "32px 0" }}>
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, idx) => {
                      const risk = getRiskStyle(user.riskScore);
                      return (
                        <tr
                          key={idx}
                          style={{ borderBottom: "1px solid #1E293B" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#1E293B")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <td style={{ padding: "14px 12px" }}>
                            <div style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 600 }}>
                              {user.name}
                            </div>
                            <div style={{ color: "#64748B", fontSize: 11 }}>{user.id}</div>
                          </td>

                          <td style={{ padding: "14px 12px", color: "#94A3B8", fontSize: 12 }}>
                            {user.department}
                          </td>

                          <td style={{ padding: "14px 12px", minWidth: 160 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div
                                style={{
                                  flex: 1,
                                  height: 6,
                                  background: "#1E293B",
                                  borderRadius: 999,
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${user.riskScore}%`,
                                    height: "100%",
                                    background: risk.bar,
                                    borderRadius: 999,
                                  }}
                                />
                              </div>
                              <span style={{ color: risk.color, fontSize: 12, fontWeight: 700 }}>
                                {user.riskScore}%
                              </span>
                            </div>
                          </td>

                          <td style={{ padding: "14px 12px", color: "#F59E0B", fontSize: 13, fontWeight: 700 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <FaExclamationTriangle size={11} />
                              {user.threats}
                            </div>
                          </td>

                          <td style={{ padding: "14px 12px" }}>
                            <span
                              style={{
                                background: risk.bg,
                                color: risk.color,
                                borderRadius: 999,
                                padding: "4px 12px",
                                fontSize: 12,
                                fontWeight: 700,
                              }}
                            >
                              {risk.label}
                            </span>
                          </td>

                          <td style={{ padding: "14px 12px", color: "#64748B", fontSize: 12 }}>
                            {user.lastActive}
                          </td>

                          <td style={{ padding: "14px 12px" }}>
                            <button
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
                              <FaEye size={11} />
                              View Profile
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Users;