import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ThreatIntelligencePanel from "../components/ThreatIntelligencePanel";
import "../styles/Dashboard.css";

function AIAnalysis() {
  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">AI Analysis</h1>
            <p className="dashboard-subtitle">
              Review AI-powered threat detection, behavioral analysis, and recommended actions.
            </p>
          </div>

          <div className="dashboard-live-badge">
            <span className="live-dot"></span>
            AI INSIGHTS
          </div>
        </div>

        <div className="threat-intelligence-section">
          <ThreatIntelligencePanel />
        </div>
      </div>
    </>
  );
}

export default AIAnalysis;