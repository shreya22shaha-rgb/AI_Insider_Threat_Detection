import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ThreatTrendChart from "../components/ThreatTrendChart";
import RiskDistributionChart from "../components/RiskDistributionChart";
import ThreatSeverityChart from "../components/ThreatSeverityChart";
import "../styles/Dashboard.css";

function Reports() {
  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Reports</h1>
            <p className="dashboard-subtitle">
              Analyze trends, compare severity levels, and review security reporting metrics.
            </p>
          </div>

          <div className="dashboard-live-badge">
            <span className="live-dot"></span>
            REPORT CENTER
          </div>
        </div>

        <div className="chart-full">
          <ThreatTrendChart />
        </div>

        <div className="charts-row">
          <RiskDistributionChart />
          <ThreatSeverityChart />
        </div>
      </div>
    </>
  );
}

export default Reports;