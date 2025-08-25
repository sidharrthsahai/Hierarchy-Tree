import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "../services/firebase";
import gongLogo from "../assets/gong-logo.png";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("anthony.xiouping@xtreet.tvl");
  const [password, setPassword] = useState("mllv9n0x");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await authenticateUser(email, password);
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        navigate("/hierarchy");
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="page-title">The login page</div>

      <div className="main-content-area">
        <h2 className="login-heading">Please login</h2>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email :</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password :</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input password-input"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <div className="brand-icon">
        <img src={gongLogo} alt="Gong Logo" className="gong-logo" />
      </div>
    </div>
  );
};

export default Login;
