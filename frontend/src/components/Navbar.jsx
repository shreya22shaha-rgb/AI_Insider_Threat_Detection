import "../styles/Navbar.css";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

function Navbar() {
  return (
    <div className="navbar">
      <div className="search-box">
        <FaSearch />
        <input type="text" placeholder="Search Employees..." />
      </div>

      <div className="navbar-right">
        <FaBell className="nav-icon" />
        <FaUserCircle className="profile-icon" />
      </div>
    </div>
  );
}

export default Navbar;