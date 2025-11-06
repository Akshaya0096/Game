import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../assets/login-girl.jpg";

const Login = () => {
  const navigate = useNavigate();

  // 🔐 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Login successful!");

        // Save user info only (no token)
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to welcome page
        navigate("/welcome");
      } else {
        alert(data.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("⚠️ Server error. Please check your connection.");
    }
  };

  return (
    <div className="login-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="login-card"
      >
        {/* Left Side */}
        <div className="login-left">
          <h2 className="login-logo">Logo Here</h2>
          <p className="login-welcome">Welcome back !!!</p>
          <h1 className="login-title">Log In</h1>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="login@gmail.com" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="********" required />
            </div>

            <button type="submit" className="login-btn">
              LOGIN →
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account yet?{" "}
            <Link to="/signup">Sign up for free</Link>
          </p>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <motion.img
            src={loginImg}
            alt="login illustration"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
