import {
  FaUsers,
  FaExclamationTriangle,
  FaShieldAlt,
  FaChartLine,
  FaBell,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import ThreatTrendChart from "../components/ThreatTrendChart";
import RiskDistributionChart from "../components/RiskDistributionChart";
import ThreatSeverityChart from "../components/ThreatSeverityChart";
import DepartmentRiskHeatmap from "../components/DepartmentRiskHeatmap";
import ThreatIntelligencePanel from "../components/ThreatIntelligencePanel";
import HighRiskUsersTable from "../components/HighRiskUsersTable";
import RecentSecurityAlertsTable from "../components/RecentSecurityAlertsTable";
import "../styles/Dashboard.css";

function Dashboard() {
  const stats = [
    {
      title: "Total Employees",
      value: "1,248",
      trend: "+12%",
      icon: <FaUsers />,
      accent: "blue",
    },
    {
      title: "Active Threats",
      value: "18",
      trend: "+4%",
      icon: <FaExclamationTriangle />,
      accent: "red",
    },
    {
      title: "Protected Systems",
      value: "97%",
      trend: "+2.1%",
      icon: <FaShieldAlt />,
      accent: "green",
    },
    {
      title: "AI Detection Rate",
      value: "94.8%",
      trend: "+1.8%",
      icon: <FaChartLine />,
      accent: "cyan",
    },
    {
      title: "Alerts Today",
      value: "56",
      trend: "+9%",
      icon: <FaBell />,
      accent: "orange",
    },
  ];

  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">AI Threat Detection Dashboard</h1>
            <p className="dashboard-subtitle">
              Real-time monitoring of insider threats, alerts, and security
              intelligence
            </p>
          </div>

          <div className="dashboard-live-badge">
            <span className="live-dot"></span>
            LIVE MONITORING
          </div>
        </div>

        <div className="cards-grid">
          {stats.map((item, index) => (
            <StatCard
              key={index}
              title={item.title}
              value={item.value}
              icon={item.icon}
              trend={item.trend}
              trendType="positive"
              accent={item.accent}
            />
          ))}
        </div>

        <div className="chart-full">
          <ThreatTrendChart />
        </div>

        <div className="charts-row">
          <RiskDistributionChart />
          <ThreatSeverityChart />
        </div>

        <div className="department-heatmap-section">
          <DepartmentRiskHeatmap />
        </div>
      </div>
    </>
  );
}

export default Dashboard;