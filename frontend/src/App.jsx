import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import ActivityLogs from "./pages/ActivityLogs";
import ThreatAlerts from "./pages/ThreatAlerts";
import AIAnalysis from "./pages/AIAnalysis";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import SecuritySummary from "./pages/SecuritySummary";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity-logs"
        element={
          <ProtectedRoute>
            <ActivityLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/threat-alerts"
        element={
          <ProtectedRoute>
            <ThreatAlerts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-analysis"
        element={
          <ProtectedRoute>
            <AIAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/security-summary"
        element={
          <ProtectedRoute>
            <SecuritySummary />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;