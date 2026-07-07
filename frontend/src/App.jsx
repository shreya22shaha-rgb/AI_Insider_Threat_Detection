import { useEffect, useState } from "react";
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
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity-logs"
        element={
          <ProtectedRoute>
            <ActivityLogs theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/threat-alerts"
        element={
          <ProtectedRoute>
            <ThreatAlerts theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-analysis"
        element={
          <ProtectedRoute>
            <AIAnalysis theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/security-summary"
        element={
          <ProtectedRoute>
            <SecuritySummary theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;