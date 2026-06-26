import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "../styles/Dashboard.css";

function SecuritySummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/security-summary")
      .then((response) => {
        setSummary(response.data);
      })
      .catch((error) => {
        console.error("Security summary error:", error);
      });
  }, []);

  return (
    <>
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Security Summary</h1>
            <p className="dashboard-subtitle">
              Overview of users, high-risk accounts, critical users, and alerts generated.
            </p>
          </div>
        </div>

        <div className="cards-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{summary?.total_users ?? "..."}</p>
          </div>

          <div className="stat-card">
            <h3>High Risk Users</h3>
            <p>{summary?.high_risk_users ?? "..."}</p>
          </div>

          <div className="stat-card">
            <h3>Critical Users</h3>
            <p>{summary?.critical_users ?? "..."}</p>
          </div>

          <div className="stat-card">
            <h3>Alerts Generated</h3>
            <p>{summary?.alerts_generated ?? "..."}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SecuritySummary;