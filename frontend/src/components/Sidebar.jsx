import "../styles/Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaExclamationTriangle,
  FaRobot,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt,
} from "react-icons/fa";

const menuItems = [
  { label: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
  { label: "Users", icon: <FaUsers />, path: "/users" },
  { label: "Activity Logs", icon: <FaClipboardList />, path: "/activity-logs" },
  { label: "Threat Alerts", icon: <FaExclamationTriangle />, path: "/threat-alerts" },
  { label: "AI Analysis", icon: <FaRobot />, path: "/ai-analysis" },
  { label: "Reports", icon: <FaChartLine />, path: "/reports" },
  { label: "Settings", icon: <FaCog />, path: "/settings" },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("username");
  navigate("/");
};

  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo__icon">
              <FaShieldAlt />
            </div>

            <div className="sidebar-logo__text">
              <h2>AI Threat</h2>
              <p>Security Center</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-menu__item ${isActive ? "active" : ""}`
                  }
                >
                  <span className="sidebar-menu__icon">{item.icon}</span>
                  <span className="sidebar-menu__label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-menu__icon">
            <FaSignOutAlt />
          </span>
          <span className="sidebar-menu__label">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar; 