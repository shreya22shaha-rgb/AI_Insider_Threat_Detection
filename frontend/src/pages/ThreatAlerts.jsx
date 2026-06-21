import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RecentSecurityAlertsTable from "../components/RecentSecurityAlertsTable";
import "../styles/Dashboard.css";

function ThreatAlerts() {
  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Threat Alerts</h1>
            <p className="dashboard-subtitle">
              Review recent security alerts, investigate suspicious activity, and monitor threat severity.
            </p>
          </div>

          <div className="dashboard-live-badge">
            <span className="live-dot"></span>
            ALERT FEED
          </div>
        </div>

        <div className="recent-alerts-section">
          <RecentSecurityAlertsTable />
        </div>
      </div>
    </>
  );
}

export default ThreatAlerts;