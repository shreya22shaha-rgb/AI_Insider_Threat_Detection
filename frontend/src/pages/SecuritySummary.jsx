import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "../styles/Dashboard.css";
import {
  FaUsers,
  FaUserShield,
  FaExclamationTriangle,
  FaBell,
  FaLock,
  FaShieldAlt,
  FaGavel,
} from "react-icons/fa";

function StatCard({ title, value, icon, color }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
        borderRadius: 16,
        padding: 20,
        border: "1px solid #334155",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          {icon}
        </div>
      </div>
      <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>{title}</p>
      <h2
        style={{
          color: "#F1F5F9",
          fontSize: 28,
          margin: "8px 0 0",
          fontWeight: 700,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

function SecuritySummary() {
  const [summary, setSummary] = useState(null);
  const [rules, setRules] = useState([]);
  const [failedLogins, setFailedLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([
      api.get("/security-summary").catch(() => ({ data: null })),
      api.get("/insider-threat-rules").catch(() => ({ data: [] })),
      api.get("/failed-login-alerts").catch(() => ({ data: [] })),
    ])
      .then(([summaryRes, rulesRes, failedRes]) => {
        setSummary(summaryRes.data || {});
        setRules(Array.isArray(rulesRes.data) ? rulesRes.data : rulesRes.data?.rules || []);
        setFailedLogins(
          Array.isArray(failedRes.data) ? failedRes.data : failedRes.data?.alerts || []
        );
      })
      .catch(() => {
        setError("Failed to load security summary.");
      })
      .finally(() => setLoading(false));
  }, []);

  const totalUsers = summary?.total_users ?? 0;
  const highRiskUsers = summary?.high_risk_users ?? 0;
  const criticalUsers = summary?.critical_users ?? 0;
  const alertsGenerated = summary?.alerts_generated ?? 0;
  const failedLoginCount = failedLogins.length;
  const activeRules = rules.length;

  return (
    <>
      <Sidebar />
      <div className="dashboard-content">
        <Navbar user={currentUser} />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Security Summary</h1>
            <p className="dashboard-subtitle">
              Overview of users, high-risk accounts, critical users, alerts generated, rules,
              and failed login attempts.
            </p>
          </div>

          <div className="dashboard-live-badge">
            <span className="live-dot"></span>
            SECURITY OVERVIEW
          </div>
        </div>

        {loading ? (
          <div style={{ color: "#64748B", textAlign: "center", padding: "40px 0" }}>
            Loading security summary...
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
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <StatCard
                title="Total Users"
                value={totalUsers}
                icon={<FaUsers size={18} />}
                color="#38BDF8"
              />
              <StatCard
                title="High Risk Users"
                value={highRiskUsers}
                icon={<FaUserShield size={18} />}
                color="#F97316"
              />
              <StatCard
                title="Critical Users"
                value={criticalUsers}
                icon={<FaExclamationTriangle size={18} />}
                color="#EF4444"
              />
              <StatCard
                title="Alerts Generated"
                value={alertsGenerated}
                icon={<FaBell size={18} />}
                color="#F59E0B"
              />
              <StatCard
                title="Failed Login Alerts"
                value={failedLoginCount}
                icon={<FaLock size={18} />}
                color="#A78BFA"
              />
              <StatCard
                title="Active Threat Rules"
                value={activeRules}
                icon={<FaShieldAlt size={18} />}
                color="#10B981"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 16,
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
                  borderRadius: 16,
                  padding: 20,
                  border: "1px solid #334155",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <FaGavel color="#10B981" />
                  <h3 style={{ color: "#F1F5F9", fontSize: 16, margin: 0 }}>
                    Insider Threat Rules
                  </h3>
                </div>

                {rules.length === 0 ? (
                  <p style={{ color: "#64748B", fontSize: 13, margin: 0 }}>
                    No active rules found.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {rules.slice(0, 6).map((rule, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "#0F172A",
                          border: "1px solid #1E293B",
                          borderRadius: 10,
                          padding: 12,
                        }}
                      >
                        <p
                          style={{
                            color: "#F1F5F9",
                            fontSize: 13,
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          {rule.rule_name || rule.name || `Rule ${idx + 1}`}
                        </p>
                        <p
                          style={{
                            color: "#64748B",
                            fontSize: 12,
                            margin: "4px 0 0",
                          }}
                        >
                          {rule.description || "Threat detection rule active"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
                  borderRadius: 16,
                  padding: 20,
                  border: "1px solid #334155",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <FaLock color="#A78BFA" />
                  <h3 style={{ color: "#F1F5F9", fontSize: 16, margin: 0 }}>
                    Failed Login Alerts
                  </h3>
                </div>

                {failedLogins.length === 0 ? (
                  <p style={{ color: "#64748B", fontSize: 13, margin: 0 }}>
                    No failed login alerts found.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {failedLogins.slice(0, 6).map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: "#0F172A",
                          border: "1px solid #1E293B",
                          borderRadius: 10,
                          padding: 12,
                        }}
                      >
                        <p
                          style={{
                            color: "#F1F5F9",
                            fontSize: 13,
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          {item.username || item.employee_name || item.user || `Login Alert ${idx + 1}`}
                        </p>
                        <p
                          style={{
                            color: "#A78BFA",
                            fontSize: 12,
                            margin: "4px 0 0",
                            fontWeight: 600,
                          }}
                        >
                          Failed Attempts: {item.failed_attempts ?? 0}
                        </p>
                        <p
                          style={{
                            color: "#64748B",
                            fontSize: 12,
                            margin: "4px 0 0",
                          }}
                        >
                          {item.alert || "Recent failed login attempt"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SecuritySummary;