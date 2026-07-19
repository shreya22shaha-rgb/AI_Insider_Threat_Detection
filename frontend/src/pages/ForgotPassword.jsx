import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaArrowLeft } from "react-icons/fa";
import { forgotPasswordRequest } from "../services/api";
import "../styles/Login.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usernameOrEmail.trim()) {
      setError("Please enter your username or email.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");
    setResetToken("");
    setExpiresAt("");

    try {
      const response = await forgotPasswordRequest(usernameOrEmail.trim());
      const data = response.data || {};

      setSuccessMessage(data.message || "Password reset token generated successfully.");
      setResetToken(data.reset_token || "");
      setExpiresAt(data.expires_at || "");
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to generate reset token.";

      setError(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToReset = () => {
    navigate("/reset-password", {
      state: {
        token: resetToken,
      },
    });
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

        <h1>Forgot Password</h1>
        <p>Generate a reset token to continue password recovery.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="usernameOrEmail">Username or Email</label>
            <input
              id="usernameOrEmail"
              type="text"
              placeholder="Enter username or email"
              value={usernameOrEmail}
              onChange={(e) => {
                setUsernameOrEmail(e.target.value);
                if (error) setError("");
              }}
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          {successMessage && (
            <div className="login-success">
              <strong>{successMessage}</strong>
              {resetToken && (
                <>
                  <br />
                  <span>Reset Token:</span> {resetToken}
                </>
              )}
              {expiresAt && (
                <>
                  <br />
                  <span>Expires At:</span> {expiresAt}
                </>
              )}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="login-btn-content">
                <span className="login-spinner"></span>
                Generating...
              </span>
            ) : (
              "Generate Reset Token"
            )}
          </button>

          {resetToken && (
            <button
              type="button"
              className="login-btn"
              style={{ marginTop: 12 }}
              onClick={handleContinueToReset}
            >
              Continue to Reset Password
            </button>
          )}

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

export default ForgotPassword;