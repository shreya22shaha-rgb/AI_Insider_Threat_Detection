import "../styles/Navbar.css";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function getNotificationType(severity) {
  switch ((severity || "").toLowerCase()) {
    case "critical":
      return "critical";
    case "high":
      return "warning";
    case "medium":
      return "warning";
    case "low":
      return "info";
    default:
      return "info";
  }
}

function Navbar({ user, theme, toggleTheme }) {
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setAlertsLoading(true);

    api
      .get("/alerts")
      .then((res) => {
        const rawAlerts = Array.isArray(res.data) ? res.data : [];

        const uniqueAlerts = rawAlerts.filter((item, index, self) => {
          const key = `${item.employee_name || ""}|${item.activity_type || ""}|${item.risk_level || ""}|${item.alert || ""}`;
          return (
            index ===
            self.findIndex(
              (a) =>
                `${a.employee_name || ""}|${a.activity_type || ""}|${a.risk_level || ""}|${a.alert || ""}` ===
                key
            )
          );
        });

        setAlerts(uniqueAlerts);
      })
      .catch(() => {
        setAlerts([]);
      })
      .finally(() => {
        setAlertsLoading(false);
      });
  }, []);

  const notifications = useMemo(() => {
    return alerts.slice(0, 6).map((item, index) => ({
      id: `${item.employee_name || "unknown"}-${item.activity_type || "activity"}-${index}`,
      title: item.alert || "Alert",
      message: `${item.employee_name || "Unknown user"} • ${item.activity_type || "Unknown activity"}`,
      time: "Recently",
      type: getNotificationType(item.risk_level),
      read: false,
      severity: item.risk_level || "Unknown",
    }));
  }, [alerts]);

  const unreadCount = notifications.length;

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleNotificationPanel = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  return (
    <div className="navbar">
      <div className="search-box">
        <FaSearch />
        <input type="text" placeholder="Search Employees..." />
      </div>

      <div className="navbar-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          type="button"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>

        <div className="notification-wrapper" ref={notificationRef}>
          <button
            className={`notification-btn ${isNotificationOpen ? "active" : ""}`}
            type="button"
            onClick={toggleNotificationPanel}
            aria-label="Open notifications"
            aria-expanded={isNotificationOpen}
            aria-haspopup="true"
          >
            <FaBell className="nav-icon" />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <span className="notification-count">
                  {alertsLoading ? "Loading..." : `${unreadCount} unread`}
                </span>
              </div>

              <div className="notification-list">
                {alertsLoading ? (
                  <div className="notification-empty">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div className="notification-empty">No notifications available.</div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`notification-item ${item.read ? "read" : "unread"}`}
                    >
                      <div className={`notification-dot ${item.type}`}></div>

                      <div className="notification-content">
                        <div className="notification-title-row">
                          <p className="notification-title">{item.title}</p>
                          <span className="notification-time">{item.time}</span>
                        </div>
                        <p className="notification-message">{item.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="nav-user-chip">
          <FaUserCircle className="profile-icon" />

          <div className="nav-user-info">
            <div className="nav-user-name">{user?.username || user?.name || "Admin User"}</div>
            <div className="nav-user-role">{user?.role || "Security Admin"}</div>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout} type="button">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;