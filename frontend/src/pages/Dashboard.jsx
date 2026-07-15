import { useEffect, useState } from "react";
import {
  FaUsers,
  FaExclamationTriangle,
  FaShieldAlt,
  FaChartLine,
  FaHeartbeat,
  FaSyncAlt,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import api from "../services/api";
import "../styles/Dashboard.css";

function riskColor(level) {
  const l = (level || "").toLowerCase();
  if (l === "critical") return "#EF4444";
  if (l === "high") return "#F97316";
  if (l === "medium") return "#F59E0B";
  if (l === "low") return "#10B981";
  return "#94A3B8";
}

function getRelativeLastUpdated(lastUpdated) {
  if (!lastUpdated) return "Not updated yet";
  const diffSeconds = Math.floor((Date.now() - lastUpdated) / 1000);

  if (diffSeconds < 10) return "Just now";
  if (diffSeconds < 60) return `${diffSeconds}s ago`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  return `${diffHours}h ago`;
}

function SecurityHealthCard({ health, loading }) {
  const score = health?.security_score ?? health?.score ?? 0;
  const status = health?.security_status ?? health?.status ?? "Unknown";
  const color = riskColor(status);

  const breakdown = [
    { label: "Total Employees", value: health?.total_employees ?? 0, color: "var(--accent-cyan)" },
    { label: "Critical", value: health?.critical_employees ?? 0, color: "#EF4444" },
    { label: "High Risk", value: health?.high_risk_employees ?? 0, color: "#F97316" },
    { label: "Medium Risk", value: health?.medium_risk_employees ?? 0, color: "#F59E0B" },
    { label: "Low Risk", value: health?.low_risk_employees ?? 0, color: "#10B981" },
  ];

  return (
    <div
      style={{
        background: `linear-gradient(120deg, ${color}10, var(--bg-surface-2) 65%)`,
        border: `1px solid ${color}35`,
        borderLeft: `5px solid ${color}`,
        borderRadius: 18,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: `4px solid ${color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: -4,
                borderRadius: "50%",
                background: `conic-gradient(${color} ${loading ? 0 : score * 3.6}deg, transparent 0deg)`,
                mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
              }}
            />
            <span style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: 18 }}>
              {loading ? "…" : score}
            </span>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FaHeartbeat color={color} size={14} />
              <h3 style={{ color: "var(--text-primary)", fontSize: 16, margin: 0, fontWeight: 700 }}>
                Security Health
              </h3>
            </div>

            <span
              style={{
                display: "inline-block",
                marginTop: 6,
                background: `${color}18`,
                color,
                border: `1px solid ${color}40`,
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 999,
              }}
            >
              {loading ? "Loading" : status}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {breakdown.map((b, i) => (
            <div key={i} style={{ textAlign: "center", minWidth: 64 }}>
              <div style={{ color: b.color, fontSize: 20, fontWeight: 800 }}>
                {loading ? "…" : b.value}
              </div>
              <div
                style={{
                  color: "var(--text-faint)",
                  fontSize: 9.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginTop: 2,
                }}
              >
                {b.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!loading && health?.recommendation && (
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 12.5,
            margin: "16px 0 0",
            paddingTop: 14,
            borderTop: "1px solid var(--border-color)",
          }}
        >
          <strong style={{ color: "var(--text-primary)" }}>Recommendation:</strong>{" "}
          {health.recommendation}
        </p>
      )}
    </div>
  );
}

function Dashboard({ theme, toggleTheme }) {
  const [dashboardData, setDashboardData] = useState({});
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [healthLoading, setHealthLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
      setHealthLoading(true);
    }

    setError("");

    try {
      const [dashboardResponse, healthResponse] = await Promise.all([
        api.get("/dashboard"),
        api.get("/security-health-score"),
      ]);

      setDashboardData(dashboardResponse.data || {});
      setHealthData(healthResponse.data || {});
      setLastUpdated(Date.now());
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
      setHealthLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalActivities =
    dashboardData?.total_activities ?? dashboardData?.totalActivities ?? 0;

  const highRisk = dashboardData?.high_risk ?? dashboardData?.highRisk ?? 0;

  const mediumRisk =
    dashboardData?.medium_risk ?? dashboardData?.mediumRisk ?? 0;

  const lowRisk = dashboardData?.low_risk ?? dashboardData?.lowRisk ?? 0;

  const stats = [
    {
      title: "Total Activities",
      value: totalActivities,
      trend: "+12%",
      trendType: "up",
      icon: <FaUsers />,
      accent: "blue",
      riskLevel: "low",
    },
    {
      title: "High Risk",
      value: highRisk,
      trend: "+4%",
      trendType: "down",
      icon: <FaExclamationTriangle />,
      accent: "red",
      riskLevel: "critical",
    },
    {
      title: "Medium Risk",
      value: mediumRisk,
      trend: "+2.1%",
      trendType: "down",
      icon: <FaShieldAlt />,
      accent: "yellow",
      riskLevel: "medium",
    },
    {
      title: "Low Risk",
      value: lowRisk,
      trend: "+1.8%",
      trendType: "up",
      icon: <FaChartLine />,
      accent: "green",
      riskLevel: "low",
    },
  ];

  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar
          user={currentUser}
          theme={theme}
          toggleTheme={toggleTheme}
          showWelcomeBanner={true}
        />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">AI Threat Detection Dashboard</h1>
            <p className="dashboard-subtitle">
              Real-time overview of insider threat activity and risk status
            </p>
          </div>

          <div className="dashboard-header-actions">
            <div className="dashboard-last-updated">
              Last Updated: {getRelativeLastUpdated(lastUpdated)}
            </div>

            <button
              className="dashboard-refresh-btn"
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
            >
              <FaSyncAlt className={refreshing ? "spin-refresh" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <div className="dashboard-live-badge">
              <span className="live-dot"></span>
              LIVE MONITORING
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid var(--danger-text)",
              background: "var(--bg-surface)",
              color: "var(--danger-text)",
            }}
          >
            {error}
          </div>
        )}

        <SecurityHealthCard health={healthData} loading={healthLoading} />

        <div className="cards-grid">
          {stats.map((item, index) => (
            <StatCard
              key={index}
              title={item.title}
              value={loading ? 0 : item.value}
              icon={item.icon}
              trend={item.trend}
              trendType={item.trendType}
              accent={item.accent}
              riskLevel={item.riskLevel}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;