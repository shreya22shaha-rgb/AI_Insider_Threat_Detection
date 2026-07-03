import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import { FaUserCircle, FaSignOutAlt, FaMoon } from "react-icons/fa";

function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState("Dark");

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login";
  };

  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar user={currentUser} />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Settings</h1>
            <p className="dashboard-subtitle">
              Manage account details, security preferences, alerts, and account protection
              settings.
            </p>
          </div>

          <div className="dashboard-live-badge">
            <span className="live-dot"></span>
            SECURITY SETTINGS
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {/* Profile */}
          <div
            style={{
              background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid #334155",
              boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
              gridColumn: "1 / -1",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <FaUserCircle color="#38BDF8" size={20} />
              <h3 style={{ color: "#F1F5F9", margin: 0 }}>Profile</h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  background: "#0F172A",
                  border: "1px solid #1E293B",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <p style={{ color: "#64748B", fontSize: 11, margin: 0 }}>Username</p>
                <p style={{ color: "#F1F5F9", fontSize: 14, fontWeight: 600, margin: "4px 0 0" }}>
                  {currentUser?.username || "—"}
                </p>
              </div>

              <div
                style={{
                  background: "#0F172A",
                  border: "1px solid #1E293B",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <p style={{ color: "#64748B", fontSize: 11, margin: 0 }}>Email</p>
                <p style={{ color: "#F1F5F9", fontSize: 14, fontWeight: 600, margin: "4px 0 0" }}>
                  {currentUser?.email || "—"}
                </p>
              </div>

              <div
                style={{
                  background: "#0F172A",
                  border: "1px solid #1E293B",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <p style={{ color: "#64748B", fontSize: 11, margin: 0 }}>Role</p>
                <p style={{ color: "#F59E0B", fontSize: 14, fontWeight: 600, margin: "4px 0 0" }}>
                  {currentUser?.role || "—"}
                </p>
              </div>

              <div
                style={{
                  background: "#0F172A",
                  border: "1px solid #1E293B",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <p style={{ color: "#64748B", fontSize: 11, margin: 0 }}>Theme</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  <FaMoon color="#A78BFA" size={12} />
                  <span style={{ color: "#F1F5F9", fontSize: 14, fontWeight: 600 }}>{theme}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: "#7F1D1D",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 18px",
                cursor: "pointer",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FaSignOutAlt size={13} />
              Logout
            </button>
          </div>

          {/* Authentication */}
          <div
            style={{
              background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid #334155",
              boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
            }}
          >
            <h3 style={{ color: "#F1F5F9", marginTop: 0 }}>Authentication</h3>
            <p style={{ color: "#94A3B8", fontSize: 13 }}>
              Configure password security, multi-factor authentication, and session rules.
            </p>

            <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
              <label
                style={{
                  color: "#CBD5E1",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span>Enable MFA</span>
                <input type="checkbox" defaultChecked />
              </label>

              <label
                style={{
                  color: "#CBD5E1",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span>Require strong passwords</span>
                <input type="checkbox" defaultChecked />
              </label>

              <label
                style={{
                  color: "#CBD5E1",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span>Auto session timeout</span>
                <input type="checkbox" defaultChecked />
              </label>
            </div>
          </div>

          {/* Alert Preferences */}
          <div
            style={{
              background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid #334155",
              boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
            }}
          >
            <h3 style={{ color: "#F1F5F9", marginTop: 0 }}>Alert Preferences</h3>
            <p style={{ color: "#94A3B8", fontSize: 13 }}>
              Choose which threat and login alerts should trigger notifications.
            </p>

            <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
              <label
                style={{
                  color: "#CBD5E1",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span>Suspicious login alerts</span>
                <input type="checkbox" defaultChecked />
              </label>

              <label
                style={{
                  color: "#CBD5E1",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span>Failed login attempt alerts</span>
                <input type="checkbox" defaultChecked />
              </label>

              <label
                style={{
                  color: "#CBD5E1",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span>Data export alerts</span>
                <input type="checkbox" defaultChecked />
              </label>
            </div>
          </div>

          {/* Active Sessions */}
          <div
            style={{
              background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid #334155",
              boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
            }}
          >
            <h3 style={{ color: "#F1F5F9", marginTop: 0 }}>Active Sessions</h3>
            <p style={{ color: "#94A3B8", fontSize: 13 }}>
              Review current sessions and monitor signed-in devices.
            </p>

            <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
              <div
                style={{
                  background: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <p style={{ color: "#F1F5F9", margin: 0, fontWeight: 600 }}>
                  Windows 11 — Chrome
                </p>
                <p style={{ color: "#64748B", margin: "4px 0 0", fontSize: 12 }}>
                  Mumbai, IN • Active now
                </p>
              </div>

              <div
                style={{
                  background: "#0F172A",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <p style={{ color: "#F1F5F9", margin: 0, fontWeight: 600 }}>
                  MacOS — Safari
                </p>
                <p style={{ color: "#64748B", margin: "4px 0 0", fontSize: 12 }}>
                  Pune, IN • 2 hours ago
                </p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div
            style={{
              background: "linear-gradient(135deg,#1E293B 0%,#0F172A 100%)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid #7F1D1D",
              boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
            }}
          >
            <h3 style={{ color: "#FCA5A5", marginTop: 0 }}>Danger Zone</h3>
            <p style={{ color: "#FCA5A5", fontSize: 13 }}>
              High-impact actions affecting account or session access.
            </p>

            <div
              style={{
                marginTop: 18,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <button
                style={{
                  background: "#7F1D1D",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 14px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Sign out all devices
              </button>

              <button
                style={{
                  background: "#991B1B",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 14px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Reset security configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;