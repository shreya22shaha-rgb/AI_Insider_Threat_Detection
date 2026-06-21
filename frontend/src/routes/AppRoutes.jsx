import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import ActivityLogs from "../pages/ActivityLogs";
import ThreatAlerts from "../pages/ThreatAlerts";
import AIAnalysis from "../pages/AIAnalysis";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/activity-logs" element={<ActivityLogs />} />
      <Route path="/threat-alerts" element={<ThreatAlerts />} />
      <Route path="/ai-analysis" element={<AIAnalysis />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default AppRoutes;