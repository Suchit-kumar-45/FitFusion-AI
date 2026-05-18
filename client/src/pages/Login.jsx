import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "../styles/login.css";

import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = {
        email,
        password,
      };

      const response = await loginUser(
        data
      );

      localStorage.setItem(
        "token",
        response.token
      );

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert("Invalid Credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          Welcome Back
        </h1>

        <p className="login-subtitle">
          Login to continue your fitness
          journey
        </p>

        <form onSubmit={handleLogin}>
          <div className="login-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="login-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <button
            className="login-btn"
            type="submit"
          >
            Login
          </button>
        </form>

        <div className="login-footer">
          Don’t have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;