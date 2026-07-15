import "../styles/Navbar.css";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaChevronDown,
  FaUser,
  FaCog,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SEEN_ALERTS_STORAGE_KEY = "seenAlertIds";

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

function loadSeenAlertIds() {
  try {
    const stored = localStorage.getItem(SEEN_ALERTS_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveSeenAlertIds(idsSet) {
  try {
    localStorage.setItem(
      SEEN_ALERTS_STORAGE_KEY,
      JSON.stringify(Array.from(idsSet))
    );
  } catch {
    // ignore storage errors
  }
}

function getGreetingByHour(hour) {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function Navbar({ user, theme, toggleTheme, showWelcomeBanner = false }) {
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [seenAlertIds, setSeenAlertIds] = useState(() => loadSeenAlertIds());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showGreeting, setShowGreeting] = useState(showWelcomeBanner);

  useEffect(() => {
    setShowGreeting(showWelcomeBanner);

    if (!showWelcomeBanner) return;

    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [showWelcomeBanner]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
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
    return alerts.map((item, index) => {
      const id = `${item.employee_name || "unknown"}-${item.activity_type || "activity"}-${item.risk_level || "na"}-${item.alert || "na"}-${index}`;

      return {
        id,
        title: item.alert || "Alert",
        message: `${item.employee_name || "Unknown user"} • ${item.activity_type || "Unknown activity"}`,
        time: "Recently",
        type: getNotificationType(item.risk_level),
        read: seenAlertIds.has(id),
      };
    });
  }, [alerts, seenAlertIds]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const greeting = useMemo(
    () => getGreetingByHour(currentTime.getHours()),
    [currentTime]
  );

  const formattedDate = useMemo(
    () =>
      currentTime.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [currentTime]
  );

  const formattedTime = useMemo(
    () =>
      currentTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [currentTime]
  );

  const markAllAsSeen = () => {
    if (notifications.length === 0) return;

    const updated = new Set(seenAlertIds);
    notifications.forEach((item) => updated.add(item.id));

    setSeenAlertIds(updated);
    saveSeenAlertIds(updated);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleNotificationPanel = () => {
    setIsNotificationOpen((prev) => {
      const next = !prev;
      if (next) {
        markAllAsSeen();
        setIsProfileOpen(false);
      }
      return next;
    });
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => {
      const next = !prev;
      if (next) {
        setIsNotificationOpen(false);
      }
      return next;
    });
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        {showGreeting && (
          <div className="navbar-greeting-block">
            <h2 className="navbar-greeting">
              {greeting}, {user?.username || user?.name || "Admin"} 👋
            </h2>
            <div className="navbar-datetime">
              <span className="navbar-date">
                <FaCalendarAlt />
                {formattedDate}
              </span>
              <span className="navbar-time">
                <FaClock />
                {formattedTime}
              </span>
            </div>
          </div>
        )}

        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search Employees..." />
        </div>
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
                  {alertsLoading ? "Loading..." : `${notifications.length} total`}
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

        <div className="profile-wrapper" ref={profileRef}>
          <button
            className={`nav-user-chip profile-trigger ${isProfileOpen ? "active" : ""}`}
            type="button"
            onClick={toggleProfileDropdown}
            aria-label="Open profile menu"
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >
            <FaUserCircle className="profile-icon" />
            <div className="nav-user-info">
              <div className="nav-user-name">{user?.username || user?.name || "Admin"}</div>
              <div className="nav-user-role">{user?.role || "Administrator"}</div>
            </div>
            <FaChevronDown className={`profile-caret ${isProfileOpen ? "rotate" : ""}`} />
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <FaUserCircle className="profile-dropdown-avatar" />
                <div>
                  <div className="profile-dropdown-name">
                    {user?.username || user?.name || "Admin"}
                  </div>
                  <div className="profile-dropdown-role">
                    {user?.role || "Administrator"}
                  </div>
                </div>
              </div>

              <button className="profile-dropdown-item" type="button">
                <FaUser />
                My Profile
              </button>

              <button className="profile-dropdown-item" type="button">
                <FaCog />
                Settings
              </button>

              <button
                className="profile-dropdown-item logout-item"
                type="button"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;