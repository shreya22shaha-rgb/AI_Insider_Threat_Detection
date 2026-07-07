import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import api from "../services/api";
import { FaUserCircle, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";

function Settings({ theme, toggleTheme }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }

    api
      .get("/users/me")
      .then((res) => {
        const profile = res.data;
        setCurrentUser(profile);
        localStorage.setItem("loggedInUser", JSON.stringify(profile));
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar user={currentUser} theme={theme} toggleTheme={toggleTheme} />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Settings</h1>
            <p className="dashboard-subtitle">
              Manage account details, security preferences, alerts, and account protection settings.
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
          <div
            style={{
              background: "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-2) 100%)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-card)",
              gridColumn: "1 / -1",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <FaUserCircle color="var(--accent-cyan)" size={20} />
              <h3 style={{ color: "var(--text-primary)", margin: 0 }}>Profile</h3>
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
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <p style={{ color: "var(--text-faint)", fontSize: 11, margin: 0 }}>Username</p>
                <p style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 600, margin: "4px 0 0" }}>
                  {currentUser?.username || "—"}
                </p>
              </div>

              <div
                style={{
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <p style={{ color: "var(--text-faint)", fontSize: 11, margin: 0 }}>Email</p>
                <p style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 600, margin: "4px 0 0" }}>
                  {currentUser?.email || "—"}
                </p>
              </div>

              <div
                style={{
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <p style={{ color: "var(--text-faint)", fontSize: 11, margin: 0 }}>Role</p>
                <p style={{ color: "var(--accent-orange)", fontSize: 14, fontWeight: 600, margin: "4px 0 0" }}>
                  {currentUser?.role || "—"}
                </p>
              </div>

              <div
                style={{
                  background: "var(--bg-surface-2)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <p style={{ color: "var(--text-faint)", fontSize: 11, margin: 0 }}>Theme</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  {theme === "dark" ? (
                    <FaMoon color="var(--accent-purple)" size={12} />
                  ) : (
                    <FaSun color="var(--accent-orange)" size={12} />
                  )}
                  <span style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 600 }}>
                    {theme === "dark" ? "Dark" : "Light"}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={toggleTheme}
                style={{
                  background: "var(--bg-surface-2)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 10,
                  padding: "10px 18px",
                  cursor: "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {theme === "dark" ? <FaSun size={13} /> : <FaMoon size={13} />}
                Switch to {theme === "dark" ? "Light" : "Dark"} Mode
              </button>

              <button
                onClick={handleLogout}
                style={{
                  background: "var(--danger-bg)",
                  color: theme === "dark" ? "#fff" : "var(--danger-text)",
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
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-2) 100%)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h3 style={{ color: "var(--text-primary)", marginTop: 0 }}>Authentication</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Configure password security, multi-factor authentication, and session rules.
            </p>

            <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
              {["Enable MFA", "Require strong passwords", "Auto session timeout"].map((label) => (
                <label
                  key={label}
                  style={{
                    color: "var(--text-secondary)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span>{label}</span>
                  <input type="checkbox" defaultChecked />
                </label>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-2) 100%)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h3 style={{ color: "var(--text-primary)", marginTop: 0 }}>Alert Preferences</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Choose which threat and login alerts should trigger notifications.
            </p>

            <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
              {[
                "Suspicious login alerts",
                "Failed login attempt alerts",
                "Data export alerts",
              ].map((label) => (
                <label
                  key={label}
                  style={{
                    color: "var(--text-secondary)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span>{label}</span>
                  <input type="checkbox" defaultChecked />
                </label>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-2) 100%)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h3 style={{ color: "var(--text-primary)", marginTop: 0 }}>Active Sessions</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Review current sessions and monitor signed-in devices.
            </p>

            <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
              {[
                { title: "Windows 11 — Chrome", text: "Mumbai, IN • Active now" },
                { title: "MacOS — Safari", text: "Pune, IN • 2 hours ago" },
              ].map((session) => (
                <div
                  key={session.title}
                  style={{
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 10,
                    padding: 12,
                  }}
                >
                  <p style={{ color: "var(--text-primary)", margin: 0, fontWeight: 600 }}>
                    {session.title}
                  </p>
                  <p style={{ color: "var(--text-faint)", margin: "4px 0 0", fontSize: 12 }}>
                    {session.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-surface-2) 100%)",
              borderRadius: 16,
              padding: 24,
              border: "1px solid var(--danger-text)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h3 style={{ color: "var(--danger-text)", marginTop: 0 }}>Danger Zone</h3>
            <p style={{ color: "var(--danger-text)", fontSize: 13 }}>
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
                  background: "var(--danger-bg)",
                  color: theme === "dark" ? "#fff" : "var(--danger-text)",
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
                  background: "var(--danger-bg-2)",
                  color: theme === "dark" ? "#fff" : "var(--danger-text)",
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