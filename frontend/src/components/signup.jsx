import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import signupImg from "../assets/login-girl.jpg";
import bgImage from "../assets/bg.avif";

const Signup = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // 🍂 Generate leaves for animation
  const leaves = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    size: 15 + Math.random() * 25,
    left: Math.random() * 100,
    duration: 5 + Math.random() * 10,
    delay: Math.random() * 5,
    rotate: Math.random() * 360,
  }));

  // ✨ Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const email = e.target[1].value;

    if (password.length !== 6) {
      setIsPasswordValid(false);
      alert("Password must be exactly 6 characters long.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Show popup
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/"); // Redirect to login page
        }, 2000);
      } else {
        alert(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("⚠️ Server error. Please check your connection.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      {/* 🍂 Falling yellow leaves */}
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{ y: -50, rotate: leaf.rotate, opacity: 0 }}
          animate={{ y: "110vh", rotate: leaf.rotate + 360, opacity: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: leaf.duration,
            delay: leaf.delay,
            ease: "linear",
          }}
          style={{
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            background: `rgba(250, 211, 88, 0.8)`,
            borderRadius: "50% 20% 50% 20%",
            position: "absolute",
            top: "-50px",
            left: `${leaf.left}%`,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Animated circles */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          overflow: "hidden",
        }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: ["0%", "100%"], x: ["0%", "50%"] }}
            transition={{
              repeat: Infinity,
              duration: 15 + i * 3,
              ease: "linear",
            }}
            style={{
              width: `${30 + i * 10}px`,
              height: `${30 + i * 10}px`,
              borderRadius: "50%",
              background: `rgba(255,255,255,${0.1 + i * 0.05})`,
              position: "absolute",
              top: `${-50 * i}px`,
              left: `${i * 15}%`,
              filter: "blur(10px)",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          zIndex: 2,
          display: "flex",
          width: "900px",
          maxWidth: "95%",
          borderRadius: "20px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          overflow: "hidden",
          background: "rgba(10,10,30,0.85)",
        }}
      >
        {/* Left Side - Form */}
        <div style={{ flex: 1, padding: "40px", color: "#fff" }}>
          <h1
            style={{
              fontWeight: "800",
              marginBottom: "15px",
              color: "#38bdf8",
            }}
          >
            SIGN UP
          </h1>
          <p
            style={{
              marginBottom: "30px",
              fontWeight: "600",
              color: "#fcd34d",
            }}
          >
            Create your account, player!
          </p>

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: "20px" }}>
              <label>Name</label>
              <input
                type="text"
                placeholder="John Doe"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  outline: "none",
                  marginTop: "5px",
                  fontWeight: "600",
                }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label>Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  outline: "none",
                  marginTop: "5px",
                  fontWeight: "600",
                }}
              />
            </div>
            <div style={{ marginBottom: "25px" }}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setIsPasswordValid(e.target.value.length === 6);
                }}
                required
                minLength={6}
                maxLength={6}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  outline: "none",
                  marginTop: "5px",
                  fontWeight: "600",
                }}
              />
              {!isPasswordValid && (
                <p
                  style={{
                    color: "#f87171",
                    fontSize: "13px",
                    marginTop: "6px",
                    fontWeight: "500",
                  }}
                >
                  Password must be exactly 6 characters long.
                </p>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(90deg,#f472b6,#3b82f6)",
                color: "#fff",
                fontWeight: "700",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 5px 15px rgba(255,255,255,0.3)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 5px 25px rgba(255,255,255,0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 5px 15px rgba(255,255,255,0.3)")
              }
            >
              SIGN UP →
            </button>
          </form>

          <p style={{ marginTop: "20px", fontWeight: "600" }}>
            Already have an account?{" "}
            <Link style={{ color: "#38bdf8" }} to="/">
              Login here
            </Link>
          </p>
        </div>

        {/* Right Side - Illustration */}
        <div
          style={{
            flex: 1,
            background: "rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <motion.img
            src={signupImg}
            alt="signup illustration"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </motion.div>

      {/* ✅ Animated Success Popup */}
      {showSuccess && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "linear-gradient(90deg,#22c55e,#14b8a6)",
            padding: "30px 50px",
            borderRadius: "20px",
            color: "#fff",
            fontSize: "20px",
            fontWeight: "700",
            zIndex: 9999,
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          }}
        >
          🎉 Signup Successful!
        </motion.div>
      )}
    </div>
  );
};

export default Signup;
