import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import signupImg from "../assets/login-girl.jpg";

const Signup = () => {
  const navigate = useNavigate();

  // ✨ Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("🎉 Signup successful!");
        navigate("/"); // Redirect to login page
      } else {
        alert(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
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
          <p className="login-welcome">Welcome!</p>
          <h1 className="login-title">Sign Up</h1>

          <form className="login-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="John Doe" required />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="example@gmail.com" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="********" required />
            </div>

            <button type="submit" className="login-btn">
              SIGN UP →
            </button>
          </form>

          <p className="signup-text">
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <motion.img
            src={signupImg}
            alt="signup illustration"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
