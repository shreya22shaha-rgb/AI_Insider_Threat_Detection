import { useState } from "react";
import {
  FaRobot,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaDesktop,
  FaUserSecret,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaBolt,
} from "react-icons/fa";

// ── Sample Threat Intelligence Data ─────────
const threats = [
  {
    id: 1,
    title: "Brute Force Login Attempt",
    type: "Authentication Attack",
    severity: "Critical",
    severityColor: "#EF4444",
    user: "john.doe@company.com",
    ip: "192.168.1.45",
    location: "Mumbai, IN",
    device: "Windows 11 — Chrome",
    time: "2 mins ago",
    status: "Active",
    aiScore: 97,
    description:
      "AI detected 47 consecutive failed login attempts from the same IP within 3 minutes. Pattern matches known brute-force signature.",
    recommendation:
      "Block IP immediately. Force password reset for target account. Enable MFA.",
  },
  {
    id: 2,
    title: "Unusual Data Export",
    type: "Data Exfiltration",
    severity: "High",
    severityColor: "#F97316",
    user: "sarah.k@company.com",
    ip: "10.0.0.112",
    location: "Pune, IN",
    device: "MacOS — Safari",
    time: "15 mins ago",
    status: "Investigating",
    aiScore: 84,
    description:
      "User exported 2.4GB of sensitive records in a single session — 18x above their normal usage baseline.",
    recommendation:
      "Suspend export privileges. Alert data protection officer. Review audit logs.",
  },
  {
    id: 3,
    title: "Anomalous Login Time",
    type: "Behavioral Anomaly",
    severity: "Medium",
    severityColor: "#F59E0B",
    user: "raj.m@company.com",
    ip: "203.0.113.7",
    location: "Delhi, IN",
    device: "Linux — Firefox",
    time: "1 hour ago",
    status: "Monitoring",
    aiScore: 63,
    description:
      "Login detected at 3:47 AM — outside normal working hours. Geo-location differs from usual access point by 1,400 km.",
    recommendation:
      "Send verification alert to user. Monitor session activity in real time.",
  },
  {
    id: 4,
    title: "Privilege Escalation Attempt",
    type: "Access Control Violation",
    severity: "High",
    severityColor: "#F97316",
    user: "mike.t@company.com",
    ip: "172.16.0.8",
    location: "Bangalore, IN",
    device: "Windows 10 — Edge",
    time: "3 hours ago",
    status: "Resolved",
    aiScore: 78,
    description:
      "User attempted to access admin-level APIs without required role permissions. 12 unauthorized endpoint calls recorded.",
    recommendation:
      "Revoke elevated tokens. Audit role assignments. Review access logs.",
  },
  {
    id: 5,
    title: "Repeated Policy Violation",
    type: "Compliance Breach",
    severity: "Low",
    severityColor: "#10B981",
    user: "priya.s@company.com",
    ip: "192.168.3.22",
    location: "Pune, IN",
    device: "Windows 11 — Chrome",
    time: "5 hours ago",
    status: "Resolved",
    aiScore: 41,
    description:
      "User accessed restricted documents 5 times this week without proper clearance level.",
    recommendation:
      "Issue policy reminder. Log incident. No immediate action required.",
  },
];

const statusColors = {
  Active:       { bg: "#EF444420", color: "#EF4444", dot: "#EF4444" },
  Investigating:{ bg: "#F9731620", color: "#F97316", dot: "#F97316" },
  Monitoring:   { bg: "#F59E0B20", color: "#F59E0B", dot: "#F59E0B" },
  Resolved:     { bg: "#10B98120", color: "#10B981", dot: "#10B981" },
};

const filters = ["All", "Critical", "High", "Medium", "Low"];

// ── AI Score Ring ────────────────────────────
function AIScoreRing({ score }) {
  const color =
    score >= 80 ? "#EF4444" :
    score >= 60 ? "#F97316" :
    score >= 40 ? "#F59E0B" : "#10B981";

  const r = 20;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;

  return (
    <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
      <svg width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="28" cy="28" r={r} fill="none" stroke="#1E293B" strokeWidth="4" />
        <circle
          cx="28" cy="28" r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeLinecap="round"
        />
      </svg>
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700, color,
      }}>
        {score}
      </div>
    </div>
  );
}

// ── Single Threat Card ───────────────────────
function ThreatCard({ threat }) {
  const [expanded, setExpanded] = useState(false);
  const st = statusColors[threat.status];

  return (
    <div style={{
      background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
      border: `1px solid ${threat.severityColor}33`,
      borderRadius: 14,
      padding: "18px 20px",
      marginBottom: 14,
      transition: "box-shadow 0.2s",
      boxShadow: expanded ? `0 0 20px ${threat.severityColor}22` : "none",
    }}>

      {/* ── Top row ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>

        <AIScoreRing score={threat.aiScore} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title + status */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                background: `${threat.severityColor}22`,
                color: threat.severityColor,
                fontSize: 10, fontWeight: 700,
                padding: "2px 8px", borderRadius: 20,
                textTransform: "uppercase", letterSpacing: "0.05em",
              }}>
                {threat.severity}
              </span>
              <span style={{ color: "#64748B", fontSize: 11 }}>{threat.type}</span>
            </div>
            <span style={{
              background: st.bg, color: st.color,
              fontSize: 11, fontWeight: 600,
              padding: "3px 10px", borderRadius: 20,
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot, display: "inline-block" }} />
              {threat.status}
            </span>
          </div>

          {/* Title */}
          <h3 style={{ color: "#F1F5F9", fontSize: 15, fontWeight: 600, margin: "6px 0 8px" }}>
            {threat.title}
          </h3>

          {/* Meta row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {[
              { icon: <FaUserSecret size={11} />, text: threat.user },
              { icon: <FaDesktop size={11} />,    text: threat.device },
              { icon: <FaMapMarkerAlt size={11} />,text: threat.location },
              { icon: <FaClock size={11} />,       text: threat.time },
            ].map((m, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 5, color: "#64748B", fontSize: 11 }}>
                <span style={{ color: "#475569" }}>{m.icon}</span>
                {m.text}
              </span>
            ))}
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "#0F172A", border: "1px solid #334155",
            borderRadius: 8, padding: "6px 10px",
            color: "#64748B", cursor: "pointer", flexShrink: 0,
          }}
        >
          {expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </button>
      </div>

      {/* ── Expanded detail ── */}
      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1E293B" }}>

          {/* AI Analysis */}
          <div style={{
            background: "#0F172A", borderRadius: 10, padding: "12px 16px",
            border: "1px solid #334155", marginBottom: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <FaRobot size={13} color="#38BDF8" />
              <span style={{ color: "#38BDF8", fontSize: 12, fontWeight: 600 }}>AI Analysis</span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
              {threat.description}
            </p>
          </div>

          {/* Recommendation */}
          <div style={{
            background: "#0F172A", borderRadius: 10, padding: "12px 16px",
            border: `1px solid ${threat.severityColor}33`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <FaBolt size={12} color={threat.severityColor} />
              <span style={{ color: threat.severityColor, fontSize: 12, fontWeight: 600 }}>
                Recommended Action
              </span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
              {threat.recommendation}
            </p>
          </div>

          {/* IP */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#64748B", fontSize: 12 }}>Source IP:</span>
            <code style={{
              background: "#0F172A", border: "1px solid #334155",
              padding: "2px 10px", borderRadius: 6,
              color: "#F59E0B", fontSize: 12,
            }}>
              {threat.ip}
            </code>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Panel ───────────────────────────────
function ThreatIntelligencePanel() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? threats
    : threats.filter((t) => t.severity === activeFilter);

  const counts = {
    Critical:     threats.filter((t) => t.severity === "Critical").length,
    High:         threats.filter((t) => t.severity === "High").length,
    Medium:       threats.filter((t) => t.severity === "Medium").length,
    Low:          threats.filter((t) => t.severity === "Low").length,
    Active:       threats.filter((t) => t.status === "Active").length,
  };

  return (
    <div style={{
      background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
      borderRadius: 16, padding: 24,
      border: "1px solid #334155",
      boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
      fontFamily: "Inter, sans-serif",
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FaRobot size={18} color="#38BDF8" />
            <h2 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 600, margin: 0 }}>
              AI Threat Intelligence
            </h2>
            {counts.Active > 0 && (
              <span style={{
                background: "#EF444422", color: "#EF4444",
                fontSize: 10, fontWeight: 700, padding: "2px 8px",
                borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em",
              }}>
                {counts.Active} Active
              </span>
            )}
          </div>
          <p style={{ color: "#64748B", fontSize: 12, margin: "4px 0 0" }}>
            AI-powered threat detection & behavioral analysis
          </p>
        </div>

        {/* Summary badges */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "Critical", count: counts.Critical, color: "#EF4444" },
            { label: "High",     count: counts.High,     color: "#F97316" },
            { label: "Medium",   count: counts.Medium,   color: "#F59E0B" },
            { label: "Low",      count: counts.Low,      color: "#10B981" },
          ].map((b) => (
            <div key={b.label} style={{
              background: "#0F172A", border: `1px solid ${b.color}33`,
              borderRadius: 8, padding: "4px 12px", textAlign: "center",
            }}>
              <p style={{ color: b.color, fontSize: 16, fontWeight: 700, margin: 0 }}>{b.count}</p>
              <p style={{ color: "#64748B", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                {b.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <FaFilter size={11} color="#64748B" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              background: activeFilter === f ? "#38BDF822" : "#0F172A",
              border: `1px solid ${activeFilter === f ? "#38BDF8" : "#334155"}`,
              color: activeFilter === f ? "#38BDF8" : "#64748B",
              fontSize: 12, fontWeight: 600,
              padding: "5px 14px", borderRadius: 20,
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {f}
            {f !== "All" && (
              <span style={{ marginLeft: 6, opacity: 0.7 }}>
                ({threats.filter((t) => t.severity === f).length})
              </span>
            )}
          </button>
        ))}
        <span style={{ color: "#475569", fontSize: 12, marginLeft: "auto" }}>
          Showing {filtered.length} of {threats.length} threats
        </span>
      </div>

      {/* ── Threat Cards ── */}
      <div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#475569" }}>
            <FaCheckCircle size={32} color="#10B981" style={{ marginBottom: 12 }} />
            <p style={{ color: "#94A3B8", fontSize: 14 }}>No threats found for this filter.</p>
          </div>
        ) : (
          filtered.map((t) => <ThreatCard key={t.id} threat={t} />)
        )}
      </div>

    </div>
  );
}

export default ThreatIntelligencePanel;