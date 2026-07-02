import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.append("grant_type", "password");
      params.append("username", formData.username);
      params.append("password", formData.password);
      params.append("scope", "");
      params.append("client_id", "");
      params.append("client_secret", "");

      const response = await axios.post(
        "http://127.0.0.1:8000/login",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token, token_type } = response.data;

      if (!access_token) {
        setError("Login failed.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", access_token);
      localStorage.setItem("tokenType", token_type || "bearer");
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", formData.username);

      const loggedInUser = {
        username: formData.username,
      };

      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

      setLoading(false);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Login failed. Please try again.";

      setError(backendMessage);
      setLoading(false);
    }
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