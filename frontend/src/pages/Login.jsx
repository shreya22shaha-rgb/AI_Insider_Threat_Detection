import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Login.css";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validUsername = "admin";
  const validPassword = "admin123";

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (
        formData.username === validUsername &&
        formData.password === validPassword
      ) {
        const loggedInUser = {
          username: formData.username,
          name: "Admin User",
          role: "Security Admin",
          email: "admin@company.com",
        };

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", formData.username);
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        setError("");
        navigate("/dashboard");
      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <FaShieldAlt color="#3b82f6" />
        </div>

        <h1>AI Threat Detection</h1>
        <p>Secure Login Portal</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="remember-row">
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
            <span>Forgot Password?</span>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="security-badge">Protected by AI Security Shield</div>

          <div className="login-footer">
            Authorized access only • <span>Cyber Defense System</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;