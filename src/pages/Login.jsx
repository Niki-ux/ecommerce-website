import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    // Frontend-only login for now
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: email
      })
    );

    navigate("/");
  };

  return (
    <main className="login-page">

      <div className="login-container">

        <div className="login-heading">
          <p>WELCOME BACK</p>

          <h1>Login</h1>

          <span>
            Sign in to continue to ZOVA.
          </span>
        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="form-group">
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

          <div className="form-group">
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
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/login">
            Sign up
          </Link>
        </p>

      </div>

    </main>
  );
}

export default Login;