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

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
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
        setDashboardData(response.data);
      })
      .catch((error) => {
        console.error("Dashboard API error:", error);
        setError("Failed to load dashboard data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const stats = [
    {
      title: "Total Activities",
      value: dashboardData?.total_activities ?? "...",
      trend: "+12%",
      icon: <FaUsers />,
      accent: "blue",
    },
    {
      title: "High Risk",
      value: dashboardData?.high_risk ?? "...",
      trend: "+4%",
      icon: <FaExclamationTriangle />,
      accent: "red",
    },
    {
      title: "Medium Risk",
      value: dashboardData?.medium_risk ?? "...",
      trend: "+2.1%",
      icon: <FaShieldAlt />,
      accent: "green",
    },
    {
      title: "Low Risk",
      value: dashboardData?.low_risk ?? "...",
      trend: "+1.8%",
      icon: <FaChartLine />,
      accent: "cyan",
    },
  ];

  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar user={currentUser} />

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
              border: "1px solid #7f1d1d",
              background: "#1f2937",
              color: "#fca5a5",
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
              trendType="positive"
              accent={item.accent}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;