import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./Login.scss";

/**
 * Login Page Component
 *
 * Features:
 * - Form validation for email and password fields
 * - Real-time error messages for invalid credentials
 * - Password visibility toggle (Show/Hide)
 * - Session persistence: Auth token stored in localStorage
 * - Protected routes: Session persists across page refreshes
 * - Automatic logout: Cleared from localStorage on sidebar logout
 *
 * Password Requirements:
 * - Email: Valid email format (must contain @ and .)
 * - Password: Minimum 6 characters
 *
 * Credentials accepted (any email + password with 6+ chars):
 * - Example: user@example.com / password123
 *
 * Session Storage:
 * - Auth token: lendsqr_auth_token (generated on login)
 * - Current user: lendsqr_current_user (email address)
 * - Persists until: Manual logout or browser localStorage cleared
 */
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid (example: user@example.com)";
    }

    // Password validation - minimum 6 characters
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = `Password must be at least 6 characters (currently ${password.length})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await api.login(email, password);

      if (result.success) {
        // Session successfully stored in localStorage
        // Auth token and user email are persisted
        navigate("/dashboard");
      } else {
        setErrors({ password: result.message || "Login failed" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ password: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__left">
        <div className="login__logo">
          <img src="/logo.svg" alt="Lendsqr" />
        </div>
        <div className="login__illustration">
          <img src="/login-illustration.png" alt="Login Illustration" />
        </div>
      </div>

      <div className="login__right">
        <div className="login__container">
          <div className="mobile-logo">
            <img src="/logo.svg" alt="Lendsqr" />
          </div>

          <div className="login__header">
            <h1 className="login__title">Welcome!</h1>
            <p className="login__subtitle">Enter details to login.</p>
          </div>

          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__form-group">
              <input
                type="email"
                className={`login__input ${
                  errors.email ? "login__input--error" : ""
                }`}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              {errors.email && (
                <span className="login__error">{errors.email}</span>
              )}
            </div>

            <div className="login__form-group">
              <div className="login__input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`login__input ${
                    errors.password ? "login__input--error" : ""
                  }`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="login__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <span className="login__error">{errors.password}</span>
              )}
            </div>

            <a href="#forgot" className="login__forgot">
              Forgot password?
            </a>

            <button
              type="submit"
              className="login__button"
              disabled={isLoading}
            >
              {isLoading ? "LOGGING IN..." : "LOG IN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
