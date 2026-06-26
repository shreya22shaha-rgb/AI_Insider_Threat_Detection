import "../styles/Navbar.css";
import { FaBell, FaSearch, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="search-box">
        <FaSearch />
        <input type="text" placeholder="Search Employees..." />
      </div>

      <div className="navbar-right">
        <FaBell className="nav-icon" />

        <div className="nav-user-chip">
          <FaUserCircle className="profile-icon" />

          <div className="nav-user-info">
            <div className="nav-user-name">
              {user?.name || "Admin User"}
            </div>
            <div className="nav-user-role">
              {user?.role || "Security Admin"}
            </div>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;