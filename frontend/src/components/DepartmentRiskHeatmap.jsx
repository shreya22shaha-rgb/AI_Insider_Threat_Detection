import { useState } from "react";
import {
  FaBuilding,
  FaFire,
  FaShieldAlt,
  FaUsers,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
  FaRobot,
} from "react-icons/fa";

// ── Data ─────────────────────────────────────
const departments = [
  {
    name: "Engineering",
    riskScore: 82,
    employees: 45,
    threats: 18,
    critical: 3,
    high: 6,
    medium: 7,
    low: 2,
    trend: "up",
    topThreat: "Unauthorized Access",
    weeklyChange: 12,
  },
  {
    name: "Finance",
    riskScore: 76,
    employees: 20,
    threats: 14,
    critical: 2,
    high: 5,
    medium: 5,
    low: 2,
    trend: "up",
    topThreat: "Data Exfiltration",
    weeklyChange: 8,
  },
  {
    name: "IT Admin",
    riskScore: 71,
    employees: 12,
    threats: 11,
    critical: 2,
    high: 4,
    medium: 3,
    low: 2,
    trend: "up",
    topThreat: "Privilege Escalation",
    weeklyChange: 5,
  },
  {
    name: "HR",
    riskScore: 58,
    employees: 18,
    threats: 9,
    critical: 1,
    high: 3,
    medium: 4,
    low: 1,
    trend: "down",
    topThreat: "Policy Violation",
    weeklyChange: -3,
  },
  {
    name: "Legal",
    riskScore: 52,
    employees: 10,
    threats: 7,
    critical: 0,
    high: 2,
    medium: 4,
    low: 1,
    trend: "stable",
    topThreat: "Restricted Access",
    weeklyChange: 0,
  },
  {
    name: "Sales",
    riskScore: 44,
    employees: 35,
    threats: 6,
    critical: 0,
    high: 1,
    medium: 3,
    low: 2,
    trend: "down",
    weeklyChange: -6,
    topThreat: "Weak Password",
  },
  {
    name: "Marketing",
    riskScore: 22,
    employees: 22,
    threats: 2,
    critical: 0,
    high: 0,
    medium: 1,
    low: 1,
    trend: "down",
    topThreat: "Suspicious Link Click",
    weeklyChange: -4,
  },
  {
    name: "Operations",
    riskScore: 18,
    employees: 28,
    threats: 1,
    critical: 0,
    high: 0,
    medium: 0,
    low: 1,
    trend: "stable",
    topThreat: "Weak Password",
    weeklyChange: 0,
  },
];

// ── Helpers ──────────────────────────────────
function getRiskLevel(score) {
  if (score >= 75) return { label: "Critical", color: "#EF4444", bg: "#EF444418", glow: "#EF444433" };
  if (score >= 55) return { label: "High", color: "#F97316", bg: "#F9731618", glow: "#F9731633" };
  if (score >= 35) return { label: "Medium", color: "#F59E0B", bg: "#F59E0B18", glow: "#F59E0B33" };
  return { label: "Low", color: "#10B981", bg: "#10B98118", glow: "#10B98133" };
}

function getTrendDisplay(trend, change) {
  if (trend === "up") {
    return (
      <span style={{ color: "#EF4444", fontSize: 12, fontWeight: 700 }}>
        ▲ +{change}%
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span style={{ color: "#10B981", fontSize: 12, fontWeight: 700 }}>
        ▼ {change}%
      </span>
    );
  }
  return (
    <span style={{ color: "#64748B", fontSize: 12, fontWeight: 700 }}>
      ● 0%
    </span>
  );
}

// ── Heat Cell ────────────────────────────────
function HeatCell({ dept, onClick, selected }) {
  const risk = getRiskLevel(dept.riskScore);
  const intensityHex = Math.round((dept.riskScore / 100) * 55)
    .toString(16)
    .padStart(2, "0");

  return (
    <div
      onClick={() => onClick(dept)}
      style={{
        background: `linear-gradient(135deg, ${risk.color}${intensityHex} 0%, #0F172A 100%)`,
        border: `1px solid ${selected ? risk.color : risk.glow}`,
        borderRadius: 14,
        padding: "18px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: selected ? `0 0 20px ${risk.color}44` : "none",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 16px ${risk.color}33`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = selected ? `0 0 20px ${risk.color}44` : "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 3,
          width: `${dept.riskScore}%`,
          background: `linear-gradient(90deg, ${risk.color}88, ${risk.color})`,
          borderRadius: "0 0 0 14px",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <p style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 700, margin: 0 }}>
          {dept.name}
        </p>
        <span
          style={{
            background: risk.bg,
            color: risk.color,
            fontSize: 9,
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 20,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {risk.label}
        </span>
      </div>

      <p style={{ color: risk.color, fontSize: 30, fontWeight: 800, margin: "0 0 4px", lineHeight: 1 }}>
        {dept.riskScore}
        <span style={{ fontSize: 14, fontWeight: 600, color: `${risk.color}99` }}>%</span>
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
        <span style={{ color: "#64748B", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
          <FaUsers size={9} /> {dept.employees}
        </span>
        <span style={{ color: "#64748B", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
          <FaExclamationTriangle size={9} /> {dept.threats}
        </span>
      </div>

      <div style={{ fontSize: 11 }}>
        {getTrendDisplay(dept.trend, dept.weeklyChange)}
        <span style={{ color: "#475569", marginLeft: 4 }}>this week</span>
      </div>
    </div>
  );
}

// ── Detail Panel ─────────────────────────────
function DeptDetailPanel({ dept, onClose }) {
  if (!dept) return null;
  const risk = getRiskLevel(dept.riskScore);

  const threatBreakdown = [
    { label: "Critical", count: dept.critical, color: "#EF4444" },
    { label: "High", count: dept.high, color: "#F97316" },
    { label: "Medium", count: dept.medium, color: "#F59E0B" },
    { label: "Low", count: dept.low, color: "#10B981" },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
        border: `1px solid ${risk.color}44`,
        borderRadius: 14,
        padding: 20,
        boxShadow: `0 0 24px ${risk.color}22`,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <FaBuilding size={14} color={risk.color} />
          <h3 style={{ color: "#F1F5F9", fontSize: 15, fontWeight: 600, margin: 0 }}>
            {dept.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "#0F172A",
            border: "1px solid #334155",
            borderRadius: 6,
            padding: "4px 8px",
            color: "#64748B",
            cursor: "pointer",
            fontSize: 11,
          }}
        >
          ✕ Close
        </button>
      </div>

      <div
        style={{
          background: "#0F172A",
          borderRadius: 10,
          padding: "14px 16px",
          border: `1px solid ${risk.color}33`,
          marginBottom: 14,
          textAlign: "center",
        }}
      >
        <p style={{ color: risk.color, fontSize: 36, fontWeight: 800, margin: 0, lineHeight: 1 }}>
          {dept.riskScore}%
        </p>
        <p
          style={{
            color: "#64748B",
            fontSize: 11,
            margin: "4px 0 0",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Risk Score — {risk.label}
        </p>
        <div style={{ height: 6, background: "#1E293B", borderRadius: 3, overflow: "hidden", marginTop: 10 }}>
          <div
            style={{
              width: `${dept.riskScore}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${risk.color}88, ${risk.color})`,
              borderRadius: 3,
            }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Employees", value: dept.employees, icon: <FaUsers size={10} /> },
          { label: "Total Threats", value: dept.threats, icon: <FaExclamationTriangle size={10} /> },
          { label: "Top Threat", value: dept.topThreat, icon: <FaFire size={10} /> },
          {
            label: "Weekly Trend",
            value:
              dept.trend === "up"
                ? `▲ +${dept.weeklyChange}%`
                : dept.trend === "down"
                ? `▼ ${dept.weeklyChange}%`
                : "● 0%",
            icon: <FaShieldAlt size={10} />,
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: "#0F172A",
              borderRadius: 8,
              padding: "10px 12px",
              border: "1px solid #1E293B",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4, color: "#475569" }}>
              {s.icon}
              <span
                style={{
                  color: "#64748B",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {s.label}
              </span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#0F172A",
          borderRadius: 10,
          padding: "14px 16px",
          border: "1px solid #1E293B",
        }}
      >
        <p
          style={{
            color: "#64748B",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin: "0 0 12px",
          }}
        >
          Threat Breakdown
        </p>

        {threatBreakdown.map((t) => (
          <div key={t.label} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: t.color, fontSize: 11, fontWeight: 600 }}>{t.label}</span>
              <span style={{ color: "#94A3B8", fontSize: 11, fontWeight: 700 }}>{t.count}</span>
            </div>
            <div style={{ height: 5, background: "#1E293B", borderRadius: 3, overflow: "hidden" }}>
              <div
                style={{
                  width: dept.threats > 0 ? `${(t.count / dept.threats) * 100}%` : "0%",
                  height: "100%",
                  background: `linear-gradient(90deg, ${t.color}66, ${t.color})`,
                  borderRadius: 3,
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────
function DepartmentRiskHeatmap() {
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("riskScore");
  const [showAll, setShowAll] = useState(false);

  const sorted = [...departments].sort((a, b) => {
    if (sortBy === "riskScore") return b.riskScore - a.riskScore;
    if (sortBy === "threats") return b.threats - a.threats;
    if (sortBy === "employees") return b.employees - a.employees;
    return a.name.localeCompare(b.name);
  });

  const visible = showAll ? sorted : sorted.slice(0, 8);

  const totalThreats = departments.reduce((s, d) => s + d.threats, 0);
  const avgRisk = Math.round(
    departments.reduce((s, d) => s + d.riskScore, 0) / departments.length
  );
  const criticalDepts = departments.filter(
    (d) => getRiskLevel(d.riskScore).label === "Critical"
  ).length;

  return (
    <div
      style={{
        background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
        borderRadius: 16,
        padding: 24,
        border: "1px solid #334155",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FaFire size={17} color="#F97316" />
            <h2 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 600, margin: 0 }}>
              Department Risk Heatmap
            </h2>
          </div>
          <p style={{ color: "#64748B", fontSize: 12, margin: "4px 0 0" }}>
            AI risk distribution across all departments
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "Avg Risk", value: `${avgRisk}%`, color: "#F59E0B" },
            { label: "Total Threats", value: totalThreats, color: "#EF4444" },
            { label: "Critical Depts", value: criticalDepts, color: "#F97316" },
          ].map((b) => (
            <div
              key={b.label}
              style={{
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: 10,
                padding: "6px 14px",
                textAlign: "center",
              }}
            >
              <p style={{ color: b.color, fontSize: 18, fontWeight: 700, margin: 0 }}>{b.value}</p>
              <p
                style={{
                  color: "#64748B",
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: 0,
                }}
              >
                {b.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sort bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ color: "#64748B", fontSize: 12 }}>Sort by:</span>
        {[
          { label: "Risk Score", key: "riskScore" },
          { label: "Threats", key: "threats" },
          { label: "Employees", key: "employees" },
          { label: "Name", key: "name" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSortBy(s.key)}
            style={{
              background: sortBy === s.key ? "#F9731822" : "#0F172A",
              border: `1px solid ${sortBy === s.key ? "#F97316" : "#334155"}`,
              color: sortBy === s.key ? "#F97316" : "#64748B",
              fontSize: 11,
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: 20,
              cursor: "pointer",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Main grid + detail */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: selected ? "1fr 320px" : "1fr",
          gap: 20,
          transition: "all 0.3s",
        }}
      >
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
            }}
          >
            {visible.map((dept) => (
              <HeatCell
                key={dept.name}
                dept={dept}
                selected={selected?.name === dept.name}
                onClick={(d) => setSelected(selected?.name === d.name ? null : d)}
              />
            ))}
          </div>

          {departments.length > 8 && (
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                marginTop: 14,
                background: "#0F172A",
                border: "1px solid #334155",
                borderRadius: 10,
                padding: "8px 20px",
                color: "#64748B",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                width: "100%",
                justifyContent: "center",
              }}
            >
              {showAll ? (
                <>
                  <FaChevronUp size={11} /> Show Less
                </>
              ) : (
                <>
                  <FaChevronDown size={11} /> Show All {departments.length} Departments
                </>
              )}
            </button>
          )}
        </div>

        {selected && <DeptDetailPanel dept={selected} onClose={() => setSelected(null)} />}
      </div>

      {/* AI Recommendation */}
      <div
        style={{
          marginTop: 20,
          background: "linear-gradient(135deg, #0F172A 0%, #111827 100%)",
          border: "1px solid #38BDF833",
          borderRadius: 12,
          padding: "14px 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <FaRobot size={13} color="#38BDF8" />
          <span style={{ color: "#38BDF8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            AI Recommendation
          </span>
        </div>
        <p style={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
          Finance and Engineering departments require immediate review due to elevated insider threat scores.
        </p>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 20,
          paddingTop: 16,
          borderTop: "1px solid #1E293B",
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: "#475569", fontSize: 11 }}>Risk Level:</span>
        {[
          { label: "Critical ≥75%", color: "#EF4444" },
          { label: "High 55–74%", color: "#F97316" },
          { label: "Medium 35–54%", color: "#F59E0B" },
          { label: "Low <35%", color: "#10B981" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: "inline-block" }} />
            <span style={{ color: "#64748B", fontSize: 11 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepartmentRiskHeatmap;