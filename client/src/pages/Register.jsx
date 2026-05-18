import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "../styles/register.css";

import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const data = {
        name,
        email,
        password,
      };

      await registerUser(data);

      alert("Registration Successful");

      navigate("/login");
    } catch (error) {
      console.log(error);

      alert("Registration Failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">
          Create Account
        </h1>

        <p className="register-subtitle">
          Start your AI-powered fitness
          journey
        </p>

        <form onSubmit={handleRegister}>
          <div className="register-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="register-group">
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

          <div className="register-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <button
            className="register-btn"
            type="submit"
          >
            Register
          </button>
        </form>

        <div className="register-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;