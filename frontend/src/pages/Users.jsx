import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import HighRiskUsersTable from "../components/HighRiskUsersTable";
import "../styles/Dashboard.css";

function Users() {
  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

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

        <div className="high-risk-section">
          <HighRiskUsersTable />
        </div>
      </div>
    </>
  );
}

export default Users;