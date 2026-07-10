import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import api from "../services/api";
import {
  FaRobot,
  FaShieldAlt,
  FaLightbulb,
  FaUserSecret,
  FaBolt,
  FaClipboardList,
} from "react-icons/fa";

function riskColor(level) {
  const l = (level || "").toLowerCase();
  if (l === "critical") return "#EF4444";
  if (l === "high") return "#F97316";
  if (l === "medium") return "#F59E0B";
  if (l === "low") return "#10B981";
  return "#94A3B8";
}

function StatBox({ label, value, color }) {
  return (
    <div
      style={{
        background: "var(--bg-surface-2)",
        border: "1px solid var(--border-color)",
        borderRadius: 12,
        padding: "10px 18px",
        textAlign: "center",
        minWidth: 90,
      }}
    >
      <div style={{ color, fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
        {value}
      </div>
      <div
        style={{
          color: "var(--text-faint)",
          fontSize: 9.5,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginTop: 2,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Badge({ label, color }) {
  return (
    <span
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}40`,
        fontSize: 11,
        fontWeight: 700,
        padding: "4px 12px",
        borderRadius: 999,
        display: "inline-block",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </span>
  );
}

function ScoreBar({ score, max = 150, color }) {
  const pct = Math.min(100, (score / max) * 100);
  return (
    <div style={{ marginTop: 6, marginBottom: 4 }}>
      <div
        style={{
          height: 6,
          width: "100%",
          background: "var(--bg-surface)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 999,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

function SectionLabel({ icon, children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, marginTop: 14 }}>
      {icon}
      <p
        style={{
          color: "var(--text-faint)",
          fontSize: 10.5,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          margin: 0,
          fontWeight: 700,
        }}
      >
        {children}
      </p>
    </div>
  );
}

function EmployeeCard({ item }) {
  const color = riskColor(item.riskLevel);

  return (
    <div
      style={{
        background: "var(--bg-surface-2)",
        border: "1px solid var(--border-color)",
        borderRadius: 16,
        padding: "20px 20px 18px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color}, ${color}00)`,
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: `${color}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            {item.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <p style={{ color: "var(--text-primary)", fontSize: 15, fontWeight: 700, margin: 0 }}>
              {item.name}
            </p>
            <p style={{ color: "var(--text-faint)", fontSize: 11, margin: "2px 0 0" }}>
              Risk Score: {item.score}
            </p>
          </div>
        </div>
        <Badge label={item.riskLevel} color={color} />
      </div>

      <ScoreBar score={item.score} color={color} />

      <SectionLabel icon={<FaUserSecret size={11} color="var(--accent-purple)" />}>
        Behavior Analysis
      </SectionLabel>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: item.behaviorReasons.length ? 6 : 0,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: item.behaviorStatus === "Suspicious" ? "#F97316" : "#10B981",
            flexShrink: 0,
          }}
        />
        <p style={{ color: "var(--text-muted)", fontSize: 12.5, margin: 0 }}>
          {item.behaviorStatus} · signal score {item.behaviorScore}
        </p>
      </div>
      {item.behaviorReasons.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6 }}>
          {item.behaviorReasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}

      <SectionLabel icon={<FaBolt size={11} color="var(--accent-cyan)" />}>
        Future Prediction
      </SectionLabel>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <p style={{ color: "var(--text-muted)", fontSize: 12.5, margin: 0 }}>
          Predicted: <strong style={{ color }}>{item.predictedRisk}</strong> · {item.predictionConfidence} confidence
        </p>
        <p style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 700, margin: 0 }}>
          {item.predictionProbability}%
        </p>
      </div>
      <div
        style={{
          height: 5,
          width: "100%",
          background: "var(--bg-surface)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${item.predictionProbability || 0}%`,
            background: color,
            borderRadius: 999,
          }}
        />
      </div>

      {item.recommendations.length > 0 && (
        <>
          <SectionLabel icon={<FaClipboardList size={11} color="var(--accent-green)" />}>
            Recommendations
          </SectionLabel>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6 }}>
            {item.recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function AIAnalysis({ theme, toggleTheme }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchAIDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/ai-dashboard");
        setDashboard(res.data || {});
      } catch {
        setError("Failed to load AI dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAIDashboard();
  }, []);

  const orgHealth = dashboard?.organization_health || null;
  const executiveSummary = dashboard?.executive_summary || "";
  const topRiskyEmployees = dashboard?.top_risky_employees || [];

  const normalizedEmployees = useMemo(() => {
    return (Array.isArray(topRiskyEmployees) ? topRiskyEmployees : [])
      .map((item, idx) => {
        const behavior = item.behavior_analysis || {};
        const prediction = item.future_prediction || {};
        return {
          name: item.employee_name || `Employee ${idx + 1}`,
          score: item.risk_score ?? 0,
          riskLevel: item.risk_level || "Unknown",
          recommendations: Array.isArray(item.recommendations) ? item.recommendations : [],
          behaviorStatus: behavior.status || "Unknown",
          behaviorScore: behavior.score ?? 0,
          behaviorReasons: Array.isArray(behavior.reasons) ? behavior.reasons : [],
          predictionProbability: prediction.prediction_probability ?? 0,
          predictedRisk: prediction.predicted_risk || "Unknown",
          predictionConfidence: prediction.confidence || "Unknown",
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [topRiskyEmployees]);

  const totalEmployees = normalizedEmployees.length;
  const highRiskCount = normalizedEmployees.filter((i) =>
    ["high", "critical"].includes(i.riskLevel?.toLowerCase())
  ).length;
  const criticalCount = normalizedEmployees.filter(
    (i) => i.riskLevel?.toLowerCase() === "critical"
  ).length;
  const orgStatus = orgHealth?.security_status || "Unknown";
  const orgColor = riskColor(orgStatus);

  return (
    <>
      <Sidebar />
      <div className="dashboard-content">
        <Navbar user={currentUser} theme={theme} toggleTheme={toggleTheme} />

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

        <div
          style={{
            background: "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-2) 100%)",
            borderRadius: 18,
            padding: 26,
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-card)",
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 14,
              marginBottom: 26,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FaRobot size={17} color="var(--accent-cyan)" />
                <h2 style={{ color: "var(--text-primary)", fontSize: 17, margin: 0, fontWeight: 700 }}>
                  AI Threat Intelligence
                </h2>
              </div>
              <p style={{ color: "var(--text-faint)", fontSize: 12, margin: "6px 0 0" }}>
                Organization health, executive summary, and top risky employees.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <StatBox label="Employees" value={totalEmployees} color="var(--accent-cyan)" />
              <StatBox label="High Risk" value={highRiskCount} color="#F97316" />
              <StatBox label="Critical" value={criticalCount} color="#EF4444" />
              <StatBox label="Org Status" value={orgStatus} color={orgColor} />
            </div>
          </div>

          {loading ? (
            <div style={{ color: "var(--text-faint)", textAlign: "center", padding: "40px 0" }}>
              Loading AI dashboard...
            </div>
          ) : error ? (
            <div
              style={{
                color: "var(--danger-text)",
                background: "var(--bg-surface)",
                border: "1px solid var(--danger-text)",
                borderRadius: 10,
                padding: 14,
              }}
            >
              {error}
            </div>
          ) : (
            <>
              {executiveSummary && (
                <div
                  style={{
                    background: `linear-gradient(120deg, ${orgColor}12, var(--bg-surface-2) 60%)`,
                    border: `1px solid ${orgColor}35`,
                    borderRadius: 16,
                    padding: 22,
                    marginBottom: 24,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <FaLightbulb color={orgColor} size={15} />
                    <h3 style={{ color: "var(--text-primary)", fontSize: 15.5, margin: 0, fontWeight: 700 }}>
                      Executive Summary
                    </h3>
                    <Badge label={orgHealth?.security_score != null ? `${orgHealth.security_score}/100` : ""} color={orgColor} />
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: 13.5, margin: 0, lineHeight: 1.7 }}>
                    {executiveSummary}
                  </p>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <FaShieldAlt size={13} color="var(--accent-red)" />
                <h3 style={{ color: "var(--text-primary)", fontSize: 14.5, margin: 0, fontWeight: 700 }}>
                  Top Risky Employees
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: 18,
                }}
              >
                {normalizedEmployees.length === 0 ? (
                  <p style={{ color: "var(--text-faint)", fontSize: 13, margin: 0 }}>
                    No employee risk data available.
                  </p>
                ) : (
                  normalizedEmployees.slice(0, 6).map((item, idx) => (
                    <EmployeeCard key={idx} item={item} />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AIAnalysis;