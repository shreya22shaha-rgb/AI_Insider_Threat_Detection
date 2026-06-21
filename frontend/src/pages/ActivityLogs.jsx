import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaClock, FaUserSecret, FaDesktop, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/Dashboard.css";

const logs = [
  {
    id: "LOG-1001",
    event: "Successful Login",
    user: "john.doe@company.com",
    time: "2 mins ago",
    device: "Windows 11 — Chrome",
    location: "Mumbai, IN",
    status: "Success",
  },
  {
    id: "LOG-1002",
    event: "Failed Login Attempt",
    user: "sarah.k@company.com",
    time: "15 mins ago",
    device: "MacOS — Safari",
    location: "Pune, IN",
    status: "Warning",
  },
  {
    id: "LOG-1003",
    event: "Password Reset",
    user: "raj.m@company.com",
    time: "1 hour ago",
    device: "Linux — Firefox",
    location: "Delhi, IN",
    status: "Info",
  },
  {
    id: "LOG-1004",
    event: "Privilege Change",
    user: "mike.t@company.com",
    time: "3 hours ago",
    device: "Windows 10 — Edge",
    location: "Bangalore, IN",
    status: "Critical",
  },
  {
    id: "LOG-1005",
    event: "Restricted File Access",
    user: "priya.s@company.com",
    time: "5 hours ago",
    device: "Windows 11 — Chrome",
    location: "Pune, IN",
    status: "Warning",
  },
];

const statusColors = {
  Success: "#10B981",
  Warning: "#F59E0B",
  Info: "#38BDF8",
  Critical: "#EF4444",
};

function ActivityLogs() {
  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Activity Logs</h1>
            <p className="dashboard-subtitle">
              Review user activity, access events, and audit trail history across the system.
            </p>
          </div>

          <div className="dashboard-live-badge">
            <span className="live-dot"></span>
            AUDIT TRAIL
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
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ color: "#F1F5F9", fontSize: 16, margin: 0 }}>
              Recent Activity Logs
            </h2>
            <p style={{ color: "#64748B", fontSize: 12, margin: "6px 0 0" }}>
              Security-relevant events and employee actions.
            </p>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1E293B" }}>
                  {["Log ID", "Event", "User", "Time", "Device", "Location", "Status"].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "12px 14px",
                        textAlign: "left",
                        color: "#64748B",
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {logs.map((log, i) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: "1px solid #1E293B",
                      background: i % 2 === 0 ? "transparent" : "#ffffff05",
                    }}
                  >
                    <td style={{ padding: "14px", color: "#38BDF8", fontSize: 12, fontWeight: 700 }}>
                      {log.id}
                    </td>

                    <td style={{ padding: "14px", color: "#F1F5F9", fontSize: 13, fontWeight: 600 }}>
                      {log.event}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8", fontSize: 12 }}>
                        <FaUserSecret size={10} color="#475569" />
                        {log.user}
                      </div>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748B", fontSize: 12 }}>
                        <FaClock size={10} color="#475569" />
                        {log.time}
                      </div>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8", fontSize: 12 }}>
                        <FaDesktop size={10} color="#475569" />
                        {log.device}
                      </div>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8", fontSize: 12 }}>
                        <FaMapMarkerAlt size={10} color="#475569" />
                        {log.location}
                      </div>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          background: `${statusColors[log.status]}22`,
                          color: statusColors[log.status],
                          border: `1px solid ${statusColors[log.status]}33`,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: 20,
                        }}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ActivityLogs;