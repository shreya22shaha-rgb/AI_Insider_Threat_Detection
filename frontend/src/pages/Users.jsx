import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import api from "../services/api";
import { FaSearch, FaUsers } from "react-icons/fa";

function Users({ theme, toggleTheme }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get("/users")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.users || [];
        setUsers(data);
      })
      .catch(() => {
        setError("Failed to load users data.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchRole =
        roleFilter === "All" ||
        (user.role && user.role.toLowerCase() === roleFilter.toLowerCase());

      const matchSearch =
        !search ||
        (user.username && user.username.toLowerCase().includes(search.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(search.toLowerCase())) ||
        String(user.id).toLowerCase().includes(search.toLowerCase());

      return matchRole && matchSearch;
    });
  }, [users, search, roleFilter]);

  const summary = {
    total: users.length,
    admins: users.filter((u) => u.role?.toLowerCase() === "admin").length,
    securityAdmins: users.filter((u) => u.role?.toLowerCase().includes("security")).length,
  };

  return (
    <>
      <Sidebar />

      <div className="dashboard-content">
        <Navbar user={currentUser} theme={theme} toggleTheme={toggleTheme} />

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Users</h1>
            <p className="dashboard-subtitle">
              View registered users, search by username or email, and review roles.
            </p>
          </div>

          <div className="dashboard-live-badge">
            <span className="live-dot"></span>
            USER DIRECTORY
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FaUsers color="var(--accent-cyan)" size={15} />
                <h2 style={{ color: "var(--text-primary)", fontSize: 16, margin: 0 }}>
                  Registered Users
                </h2>
              </div>
              <p style={{ color: "var(--text-faint)", fontSize: 12, marginTop: 4 }}>
                User records from backend GET /users endpoint.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: "Users", value: summary.total, color: "var(--accent-cyan)" },
                { label: "Admins", value: summary.admins, color: "var(--accent-orange)" },
                { label: "Security Admins", value: summary.securityAdmins, color: "var(--accent-green)" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "var(--bg-surface-2)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 10,
                    padding: "8px 16px",
                    textAlign: "center",
                    minWidth: 90,
                  }}
                >
                  <div style={{ color: item.color, fontSize: 20, fontWeight: 700 }}>
                    {item.value}
                  </div>
                  <div
                    style={{
                      color: "var(--text-faint)",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--bg-surface-2)",
              border: "1px solid var(--border-color)",
              borderRadius: 10,
              padding: "10px 16px",
              marginBottom: 16,
            }}
          >
            <FaSearch color="var(--text-faint)" size={12} />
            <input
              type="text"
              placeholder="Search by username, email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: 13,
                width: "100%",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["All", "admin", "security_admin", "user"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role === "All" ? "All" : role)}
                style={{
                  background: roleFilter === role ? "rgba(56, 189, 248, 0.12)" : "var(--bg-surface-2)",
                  border: `1px solid ${
                    roleFilter === role ? "var(--accent-cyan)" : "var(--border-color)"
                  }`,
                  color: roleFilter === role ? "var(--accent-cyan)" : "var(--text-faint)",
                  borderRadius: 999,
                  padding: "5px 14px",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: role === "All" ? "none" : "uppercase",
                }}
              >
                {role === "All" ? "All" : role}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ color: "var(--text-faint)", textAlign: "center", padding: "40px 0" }}>
              Loading users...
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
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-soft)" }}>
                    {["ID", "USERNAME", "EMAIL", "ROLE"].map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: "10px 12px",
                          textAlign: "left",
                          color: "var(--text-faint)",
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          color: "var(--text-faint)",
                          textAlign: "center",
                          padding: "32px 0",
                        }}
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, idx) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: "1px solid var(--border-soft)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "var(--bg-hover)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td style={{ padding: "14px 12px", color: "var(--text-primary)", fontSize: 13 }}>
                          {user.id}
                        </td>
                        <td style={{ padding: "14px 12px", color: "var(--text-primary)", fontSize: 13 }}>
                          {user.username}
                        </td>
                        <td style={{ padding: "14px 12px", color: "var(--text-muted)", fontSize: 12 }}>
                          {user.email}
                        </td>
                        <td style={{ padding: "14px 12px", color: "var(--accent-orange)", fontSize: 12 }}>
                          {user.role}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Users;