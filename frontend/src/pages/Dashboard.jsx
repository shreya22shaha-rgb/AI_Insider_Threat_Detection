import { useEffect, useState } from "react";
import {
  FaUsers,
  FaExclamationTriangle,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import api from "../services/api";
import "../styles/Dashboard.css";

function Dashboard({ theme, toggleTheme }) {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((response) => {
        setDashboardData(response.data || {});
      })
      .catch(() => {
        setError("Failed to load dashboard data.");
      })
      .finally(() => {
        setLoading(false);
      });
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
      trendType: "positive",
      icon: <FaUsers />,
      accent: "blue",
    },
    {
      title: "High Risk",
      value: highRisk,
      trend: "+4%",
      trendType: "negative",
      icon: <FaExclamationTriangle />,
      accent: "red",
    },
    {
      title: "Medium Risk",
      value: mediumRisk,
      trend: "+2.1%",
      trendType: "negative",
      icon: <FaShieldAlt />,
      accent: "green",
    },
    {
      title: "Low Risk",
      value: lowRisk,
      trend: "+1.8%",
      trendType: "positive",
      icon: <FaChartLine />,
      accent: "cyan",
    },
  ];

  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar user={currentUser} theme={theme} toggleTheme={toggleTheme} />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">AI Threat Detection Dashboard</h1>
            <p className="dashboard-subtitle">
              Real-time overview of insider threat activity and risk status
            </p>
          </div>

          <div className="dashboard-live-badge">
            <span className="live-dot"></span>
            LIVE MONITORING
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

        <div className="cards-grid">
          {stats.map((item, index) => (
            <StatCard
              key={index}
              title={item.title}
              value={loading ? "..." : item.value}
              icon={item.icon}
              trend={item.trend}
              trendType={item.trendType}
              accent={item.accent}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;