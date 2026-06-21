import { useState } from "react";
import {
  FaUserShield,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaSearch,
  FaExclamationTriangle,
  FaTimes,
  FaDesktop,
  FaMapMarkerAlt,
  FaClock,
  FaEnvelope,
  FaBuilding,
} from "react-icons/fa";

// ── Data ─────────────────────────────────────
const users = [
  {
    id: "EMP-001",
    name: "John Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    riskScore: 94,
    threatCount: 12,
    status: "Critical",
    lastActive: "2 mins ago",
    device: "Windows 11 — Chrome",
    location: "Mumbai, IN",
    avatar: "JD",
    threats: ["Brute Force", "Unauthorized Access", "Data Exfiltration"],
  },
  {
    id: "EMP-047",
    name: "Sarah Khan",
    email: "sarah.k@company.com",
    department: "Finance",
    riskScore: 87,
    threatCount: 8,
    status: "High",
    lastActive: "15 mins ago",
    device: "MacOS — Safari",
    location: "Pune, IN",
    avatar: "SK",
    threats: ["Unusual Export", "Policy Violation"],
  },
  {
    id: "EMP-112",
    name: "Raj Mehta",
    email: "raj.m@company.com",
    department: "HR",
    riskScore: 76,
    threatCount: 6,
    status: "High",
    lastActive: "1 hour ago",
    device: "Linux — Firefox",
    location: "Delhi, IN",
    avatar: "RM",
    threats: ["Anomalous Login", "Off-Hours Access"],
  },
  {
    id: "EMP-203",
    name: "Mike Thomas",
    email: "mike.t@company.com",
    department: "IT Admin",
    riskScore: 68,
    threatCount: 5,
    status: "Medium",
    lastActive: "3 hours ago",
    device: "Windows 10 — Edge",
    location: "Bangalore, IN",
    avatar: "MT",
    threats: ["Privilege Escalation"],
  },
  {
    id: "EMP-089",
    name: "Priya Shah",
    email: "priya.s@company.com",
    department: "Legal",
    riskScore: 55,
    threatCount: 4,
    status: "Medium",
    lastActive: "5 hours ago",
    device: "Windows 11 — Chrome",
    location: "Pune, IN",
    avatar: "PS",
    threats: ["Policy Violation", "Restricted Access"],
  },
  {
    id: "EMP-156",
    name: "Amit Verma",
    email: "amit.v@company.com",
    department: "Sales",
    riskScore: 42,
    threatCount: 3,
    status: "Low",
    lastActive: "1 day ago",
    device: "Android — Chrome",
    location: "Chennai, IN",
    avatar: "AV",
    threats: ["Weak Password"],
  },
  {
    id: "EMP-078",
    name: "Neha Joshi",
    email: "neha.j@company.com",
    department: "Marketing",
    riskScore: 38,
    threatCount: 2,
    status: "Low",
    lastActive: "2 days ago",
    device: "MacOS — Chrome",
    location: "Hyderabad, IN",
    avatar: "NJ",
    threats: ["Suspicious Link Click"],
  },
];

// ── Helpers ──────────────────────────────────
const statusConfig = {
  Critical: { color: "#EF4444", bg: "#EF444418" },
  High:     { color: "#F97316", bg: "#F9731618" },
  Medium:   { color: "#F59E0B", bg: "#F59E0B18" },
  Low:      { color: "#10B981", bg: "#10B98118" },
};

function getRiskBarColor(score) {
  if (score >= 80) return "#EF4444";
  if (score >= 60) return "#F97316";
  if (score >= 40) return "#F59E0B";
  return "#10B981";
}

// ── Avatar ───────────────────────────────────
function Avatar({ initials, score }) {
  const color = getRiskBarColor(score);
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: `${color}22`,
      border: `2px solid ${color}55`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 700, color,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ── Risk Score Bar ───────────────────────────
function RiskBar({ score }) {
  const color = getRiskBarColor(score);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 80, height: 6, background: "#1E293B", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          width: `${score}%`, height: "100%",
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 3,
        }} />
      </div>
      <span style={{ color, fontSize: 12, fontWeight: 700, minWidth: 36 }}>{score}%</span>
    </div>
  );
}

// ── Detail Modal ─────────────────────────────
function UserDetailModal({ user, onClose }) {
  if (!user) return null;
  const sc = statusConfig[user.status];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
          border: "1px solid #334155",
          borderRadius: 18, padding: 28,
          width: "100%", maxWidth: 480,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          fontFamily: "Inter, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 600, margin: 0 }}>
            User Risk Profile
          </h3>
          <button onClick={onClose} style={{
            background: "#0F172A", border: "1px solid #334155",
            borderRadius: 8, padding: "5px 9px", color: "#64748B", cursor: "pointer",
          }}>
            <FaTimes size={12} />
          </button>
        </div>

        {/* User info */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <Avatar initials={user.avatar} score={user.riskScore} />
          <div>
            <p style={{ color: "#F1F5F9", fontSize: 15, fontWeight: 600, margin: 0 }}>{user.name}</p>
            <p style={{ color: "#64748B", fontSize: 12, margin: "3px 0 0" }}>{user.id}</p>
          </div>
          <span style={{
            marginLeft: "auto",
            background: sc.bg, color: sc.color,
            fontSize: 11, fontWeight: 700,
            padding: "4px 12px", borderRadius: 20,
          }}>
            {user.status}
          </span>
        </div>

        {/* Detail grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[
            { icon: <FaEnvelope size={11} />,     label: "Email",      value: user.email },
            { icon: <FaBuilding size={11} />,     label: "Department", value: user.department },
            { icon: <FaDesktop size={11} />,      label: "Device",     value: user.device },
            { icon: <FaMapMarkerAlt size={11} />, label: "Location",   value: user.location },
            { icon: <FaClock size={11} />,        label: "Last Active",value: user.lastActive },
            { icon: <FaExclamationTriangle size={11} />, label: "Threats", value: user.threatCount },
          ].map((item, i) => (
            <div key={i} style={{
              background: "#0F172A", borderRadius: 10,
              padding: "10px 12px", border: "1px solid #1E293B",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ color: "#475569" }}>{item.icon}</span>
                <span style={{ color: "#64748B", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {item.label}
                </span>
              </div>
              <p style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600, margin: 0 }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Risk score */}
        <div style={{
          background: "#0F172A", borderRadius: 10, padding: "14px 16px",
          border: "1px solid #334155", marginBottom: 16,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ color: "#64748B", fontSize: 12 }}>AI Risk Score</span>
           <span style={{ color: getRiskBarColor(user.riskScore), fontSize: 18, fontWeight: 700 }}>
  {user.riskScore}%
</span>
          </div>
          <div style={{ height: 8, background: "#1E293B", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              width: `${user.riskScore}%`, height: "100%",
              background: `linear-gradient(90deg, ${getRiskBarColor(user.riskScore)}88, ${getRiskBarColor(user.riskScore)})`,
              borderRadius: 4,
            }} />
          </div>
        </div>

        {/* Detected threats */}
        <div>
          <p style={{ color: "#64748B", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>
            Detected Threats
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {user.threats.map((t, i) => (
              <span key={i} style={{
                background: "#EF444418", color: "#EF4444",
                fontSize: 11, fontWeight: 600,
                padding: "4px 12px", borderRadius: 20,
                border: "1px solid #EF444433",
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Table Component ─────────────────────
function HighRiskUsersTable() {
  const [search, setSearch]         = useState("");
  const [sortKey, setSortKey]       = useState("riskScore");
  const [sortDir, setSortDir]       = useState("desc");
  const [filterStatus, setFilter]   = useState("All");
  const [selectedUser, setSelected] = useState(null);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <FaSort size={10} color="#475569" />;
    return sortDir === "asc"
      ? <FaSortUp size={10} color="#38BDF8" />
      : <FaSortDown size={10} color="#38BDF8" />;
  };

  const filtered = users
    .filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.id.toLowerCase().includes(search.toLowerCase()) ||
        u.department.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filterStatus === "All" || u.status === filterStatus;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      const val = sortDir === "asc" ? 1 : -1;
      if (typeof a[sortKey] === "number") return (a[sortKey] - b[sortKey]) * val;
      return a[sortKey].localeCompare(b[sortKey]) * val;
    });

  return (
    <>
      <UserDetailModal user={selectedUser} onClose={() => setSelected(null)} />

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
              <FaUserShield size={17} color="#EF4444" />
              <h2 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 600, margin: 0 }}>
                High Risk Users
              </h2>
              <span style={{
                background: "#EF444422", color: "#EF4444",
                fontSize: 10, fontWeight: 700,
                padding: "2px 8px", borderRadius: 20,
              }}>
                {users.length} Users
              </span>
            </div>
            <p style={{ color: "#64748B", fontSize: 12, margin: "4px 0 0" }}>
              AI-monitored employee risk profiles
            </p>
          </div>

          {/* Status filter pills */}
          <div style={{ display: "flex", gap: 6 }}>
            {["All", "Critical", "High", "Medium", "Low"].map((s) => (
              <button key={s} onClick={() => setFilter(s)} style={{
                background: filterStatus === s ? "#38BDF822" : "#0F172A",
                border: `1px solid ${filterStatus === s ? "#38BDF8" : "#334155"}`,
                color: filterStatus === s ? "#38BDF8" : "#64748B",
                fontSize: 11, fontWeight: 600,
                padding: "4px 12px", borderRadius: 20,
                cursor: "pointer",
              }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Search ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#0F172A", border: "1px solid #334155",
          borderRadius: 10, padding: "9px 14px", marginBottom: 18,
        }}>
          <FaSearch size={12} color="#475569" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID or department..."
            style={{
              background: "none", border: "none", outline: "none",
              color: "#F1F5F9", fontSize: 13, width: "100%",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer" }}>
              <FaTimes size={11} />
            </button>
          )}
        </div>

        {/* ── Table ── */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1E293B" }}>
                {[
                  { label: "Employee",     key: "name" },
                  { label: "Department",   key: "department" },
                  { label: "Risk Score",   key: "riskScore" },
                  { label: "Threats",      key: "threatCount" },
                  { label: "Status",       key: "status" },
                  { label: "Last Active",  key: "lastActive" },
                  { label: "Action",       key: null },
                ].map((col) => (
                  <th
                    key={col.label}
                    onClick={() => col.key && handleSort(col.key)}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      color: "#64748B",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      cursor: col.key ? "pointer" : "default",
                      whiteSpace: "nowrap",
                      userSelect: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {col.label}
                      {col.key && <SortIcon col={col.key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((user, i) => {
                const sc = statusConfig[user.status];
                return (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: "1px solid #1E293B",
                      background: i % 2 === 0 ? "transparent" : "#ffffff05",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#38BDF808"}
                    onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "#ffffff05"}
                  >
                    {/* Employee */}
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar initials={user.avatar} score={user.riskScore} />
                        <div>
                          <p style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 600, margin: 0 }}>{user.name}</p>
                          <p style={{ color: "#475569", fontSize: 11, margin: "2px 0 0" }}>{user.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td style={{ padding: "14px" }}>
                      <span style={{
                        background: "#1E293B", color: "#94A3B8",
                        fontSize: 11, padding: "3px 10px",
                        borderRadius: 6, border: "1px solid #334155",
                      }}>
                        {user.department}
                      </span>
                    </td>

                    {/* Risk Score */}
                    <td style={{ padding: "14px" }}>
                      <RiskBar score={user.riskScore} />
                    </td>

                    {/* Threat Count */}
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <FaExclamationTriangle size={10} color="#F59E0B" />
                        <span style={{ color: "#F1F5F9", fontSize: 13, fontWeight: 600 }}>{user.threatCount}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "14px" }}>
                      <span style={{
                        background: sc.bg, color: sc.color,
                        fontSize: 11, fontWeight: 700,
                        padding: "4px 12px", borderRadius: 20,
                        border: `1px solid ${sc.color}33`,
                      }}>
                        {user.status}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <FaClock size={10} color="#475569" />
                        <span style={{ color: "#64748B", fontSize: 12 }}>{user.lastActive}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td style={{ padding: "14px" }}>
                      <button
                        onClick={() => setSelected(user)}
                        style={{
                          background: "#38BDF818",
                          border: "1px solid #38BDF833",
                          borderRadius: 8,
                          padding: "6px 14px",
                          color: "#38BDF8",
                          fontSize: 12, fontWeight: 600,
                          cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 6,
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#38BDF830"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#38BDF818"}
                      >
                        <FaEye size={11} />
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr> 
                  <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#475569" }}>
                    <FaSearch size={24} style={{ marginBottom: 10, opacity: 0.4 }} />
                    <p style={{ color: "#64748B", margin: 0 }}>No users match your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: 16, paddingTop: 14, borderTop: "1px solid #1E293B",
        }}>
          <p style={{ color: "#475569", fontSize: 12, margin: 0 }}>
            Showing <span style={{ color: "#94A3B8", fontWeight: 600 }}>{filtered.length}</span> of{" "}
            <span style={{ color: "#94A3B8", fontWeight: 600 }}>{users.length}</span> users
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(statusConfig).map(([status, cfg]) => (
              <div key={status} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
                <span style={{ color: "#64748B", fontSize: 11 }}>
                  {status}: {users.filter((u) => u.status === status).length}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

export default HighRiskUsersTable;