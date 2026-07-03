import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import api from "../services/api";
import {
  FaRobot,
  FaBrain,
  FaChartLine,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

function StatBox({ label, value, color }) {
  return (
    <div
      style={{
        background: "#0F172A",
        border: "1px solid #334155",
        borderRadius: 10,
        padding: "8px 16px",
        textAlign: "center",
        minWidth: 80,
      }}
    >
      <div style={{ color, fontSize: 20, fontWeight: 700 }}>{value}</div>
      <div
        style={{
          color: "#64748B",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function InsightCard({ title, icon, children }) {
  return (
    <div
      style={{
        background: "#0F172A",
        border: "1px solid #334155",
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        {icon}
        <h3 style={{ color: "#F1F5F9", fontSize: 15, margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Badge({ label, color, bg }) {
  return (
    <span
      style={{
        background: bg,
        color,
        border: `1px solid ${color}33`,
        fontSize: 11,
        fontWeight: 700,
        padding: "4px 12px",
        borderRadius: 999,
        display: "inline-block",
      }}
    >
      {label}
    </span>
  );
}

function AIAnalysis() {
  const [predictions, setPredictions] = useState([]);
  const [behaviors, setBehaviors] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchAIData = async () => {
      setLoading(true);
      setError("");

      try {
        const [predRes, behRes, clsRes] = await Promise.all([
          api.get("/risk-predictions").catch(() => ({ data: [] })),
          api.get("/behavior-analysis").catch(() => ({ data: [] })),
          api.get("/threat-classification").catch(() => ({ data: [] })),
        ]);

        setPredictions(
          Array.isArray(predRes.data) ? predRes.data : predRes.data?.predictions || []
        );
        setBehaviors(
          Array.isArray(behRes.data) ? behRes.data : behRes.data?.analysis || []
        );
        setClassifications(
          Array.isArray(clsRes.data) ? clsRes.data : clsRes.data?.classifications || []
        );
      } catch {
        setError("Failed to load AI analysis data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAIData();
  }, []);

  const normalizedPredictions = useMemo(() => {
    return predictions.map((item, idx) => ({
      name: item.employee_name || item.user || `Prediction ${idx + 1}`,
      score: item.risk_score ?? item.score ?? "N/A",
      riskLevel: item.predicted_risk || item.risk_level || "Unknown",
    }));
  }, [predictions]);

  const normalizedBehaviors = useMemo(() => {
    return behaviors.map((item, idx) => ({
      name: item.employee_name || item.user || `Behavior ${idx + 1}`,
      text: `Activity Count: ${item.activity_count ?? 0} — Status: ${
        item.behavior_status || "Unknown"
      }`,
    }));
  }, [behaviors]);

  const normalizedClassifications = useMemo(() => {
    return classifications.map((item, idx) => ({
      name: item.employee_name || item.user || `Threat ${idx + 1}`,
      threatType: item.threat_classification || "Unclassified Threat",
      riskLevel: item.risk_level || "Unknown",
    }));
  }, [classifications]);

  const totalPredictions = normalizedPredictions.length;

  const highRiskPredictions = normalizedPredictions.filter((item) => {
    const level = item.riskLevel?.toLowerCase();
    return level === "high" || level === "critical";
  }).length;

  const suspiciousBehaviors = normalizedBehaviors.length;
  const classifiedThreats = normalizedClassifications.length;

  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar user={currentUser} />

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
            background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
            borderRadius: 16,
            padding: 24,
            border: "1px solid #334155",
            boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FaRobot size={16} color="#38BDF8" />
                <h2 style={{ color: "#F1F5F9", fontSize: 16, margin: 0 }}>
                  AI Threat Intelligence
                </h2>
              </div>
              <p style={{ color: "#64748B", fontSize: 12, margin: "6px 0 0" }}>
                Predictions, behavior anomalies, and classification signals from backend AI models.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <StatBox label="Predictions" value={totalPredictions} color="#38BDF8" />
              <StatBox label="High Risk" value={highRiskPredictions} color="#EF4444" />
              <StatBox label="Behaviors" value={suspiciousBehaviors} color="#F59E0B" />
              <StatBox label="Threat Types" value={classifiedThreats} color="#10B981" />
            </div>
          </div>

          {loading ? (
            <div style={{ color: "#64748B", textAlign: "center", padding: "40px 0" }}>
              Loading AI analysis...
            </div>
          ) : error ? (
            <div
              style={{
                color: "#FCA5A5",
                background: "#111827",
                border: "1px solid #7f1d1d",
                borderRadius: 10,
                padding: 14,
              }}
            >
              {error}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 16,
              }}
            >
              <InsightCard
                title="Risk Predictions"
                icon={<FaChartLine color="#38BDF8" size={14} />}
              >
                {normalizedPredictions.length === 0 ? (
                  <p style={{ color: "#64748B", fontSize: 13, margin: 0 }}>
                    No prediction data available.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {normalizedPredictions.slice(0, 5).map((item, idx) => {
                      const level = item.riskLevel?.toLowerCase();
                      const isHigh = level === "high" || level === "critical";

                      return (
                        <div
                          key={idx}
                          style={{
                            border: "1px solid #1E293B",
                            background: "#111827",
                            borderRadius: 10,
                            padding: 12,
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                            <div>
                              <p
                                style={{
                                  color: "#F1F5F9",
                                  fontSize: 13,
                                  fontWeight: 600,
                                  margin: 0,
                                }}
                              >
                                {item.name}
                              </p>
                              <p style={{ color: "#64748B", fontSize: 12, margin: "4px 0 0" }}>
                                Score: {item.score}
                              </p>
                            </div>
                            <Badge
                              label={item.riskLevel}
                              color={isHigh ? "#EF4444" : "#10B981"}
                              bg={isHigh ? "#EF444420" : "#10B98120"}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </InsightCard>

              <InsightCard
                title="Behavior Analysis"
                icon={<FaBrain color="#A78BFA" size={14} />}
              >
                {normalizedBehaviors.length === 0 ? (
                  <p style={{ color: "#64748B", fontSize: 13, margin: 0 }}>
                    No behavior analysis available.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {normalizedBehaviors.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: "1px solid #1E293B",
                          background: "#111827",
                          borderRadius: 10,
                          padding: 12,
                        }}
                      >
                        <p
                          style={{
                            color: "#F1F5F9",
                            fontSize: 13,
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          {item.name}
                        </p>
                        <p style={{ color: "#94A3B8", fontSize: 12, margin: "6px 0 0" }}>
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </InsightCard>

              <InsightCard
                title="Threat Classification"
                icon={<FaShieldAlt color="#10B981" size={14} />}
              >
                {normalizedClassifications.length === 0 ? (
                  <p style={{ color: "#64748B", fontSize: 13, margin: 0 }}>
                    No classification data available.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {normalizedClassifications.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: "1px solid #1E293B",
                          background: "#111827",
                          borderRadius: 10,
                          padding: 12,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <div>
                            <p
                              style={{
                                color: "#F1F5F9",
                                fontSize: 13,
                                fontWeight: 600,
                                margin: 0,
                              }}
                            >
                              {item.name}
                            </p>
                            <p style={{ color: "#64748B", fontSize: 12, margin: "4px 0 0" }}>
                              {item.threatType}
                            </p>
                          </div>
                          <FaExclamationTriangle color="#F59E0B" size={14} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </InsightCard>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AIAnalysis;