import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { resetPasswordRequest } from "../services/api";
import "../styles/Login.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(location.state?.token || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token.trim()) {
      setError("Please enter the reset token.");
      return;
    }

    if (!newPassword.trim()) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await resetPasswordRequest(token.trim(), newPassword);
      const data = response.data || {};

      setSuccessMessage(data.message || "Password reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to reset password.";

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg-shape shape-1"></div>
      <div className="login-bg-shape shape-2"></div>
      <div className="login-bg-shape shape-3"></div>

      <div className="login-card">
        <div className="logo">
          <FaShieldAlt color="#3b82f6" />
        </div>

        <h1>Reset Password</h1>
        <p>Enter your reset token and create a new password.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="token">Reset Token</label>
            <input
              id="token"
              type="text"
              placeholder="Enter reset token"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                if (error) setError("");
              }}
            />
          </div>

          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-wrapper">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError("");
                }}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}
          {successMessage && <div className="login-success">{successMessage}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="login-btn-content">
                <span className="login-spinner"></span>
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>

          <button
            type="button"
            className="forgot-password-btn"
            style={{ marginTop: 16, alignSelf: "center" }}
            onClick={() => navigate("/login")}
          >
            <FaArrowLeft style={{ marginRight: 6 }} />
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;