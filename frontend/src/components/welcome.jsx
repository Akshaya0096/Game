import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg.avif";
import woodImage from "../assets/wood.jpg";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Player");
  const [email, setEmail] = useState("");
  const [topScore, setTopScore] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      setUserName(userData.name || "Player");
      setEmail(userData.email || "");

      if (userData.email) {
        fetch(`http://localhost:5000/api/auth/score/${userData.email}`)
          .then((res) => res.json())
          .then((data) => setTopScore(data.score || 0))
          .catch((err) => console.error("Error fetching score:", err));
      }
    } catch (err) {
      console.error("LocalStorage parse error:", err);
      setUserName("Player");
      setTopScore(0);
      setEmail("");
    }
  }, [navigate]);

  const handleStartGame = (level) => {
    navigate("/game", { state: { userName, level, email } });
  };

  const handleQuit = () => {
    localStorage.removeItem("user");
    navigate("/");
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
        fontFamily: "Poppins, sans-serif",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        position: "fixed",
        top: 0,
        left: 0,
        overflow: "hidden", // disables scrolling
      }}
    >
      {/* Floating stars / coins */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "20px",
          left: "10%",
          fontSize: "24px",
          color: "#FFD700",
        }}
      >
        ⭐
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "50px",
          right: "15%",
          fontSize: "28px",
          color: "#FFD700",
        }}
      >
        💰
      </motion.div>

      {/* Game Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "520px",
          textAlign: "center",
          padding: "40px",
          borderRadius: "25px",
          backgroundImage: `url(${woodImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
          border: "4px solid #fcd34d",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontWeight: "900",
            fontSize: "36px",
            marginBottom: "20px",
            color: "#fcd34d",
            textShadow: "3px 3px 6px #000",
          }}
        >
          🎮 Welcome, {userName}!
        </h1>

        <p
          style={{
            fontSize: "20px",
            fontWeight: "700",
            background: "rgba(0,0,0,0.5)",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "25px",
            color: "#fff",
            textShadow: "1px 1px 3px #000",
          }}
        >
          🏆 Last Score: {topScore}
        </p>

        <h2
          style={{
            fontWeight: "800",
            marginBottom: "20px",
            color: "#fef3c7",
            textShadow: "2px 2px 5px #000",
          }}
        >
          Select Difficulty
        </h2>

        <div style={{ marginBottom: "25px" }}>
          {["Easy", "Medium", "Hard"].map((level, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <button
                onClick={() => handleStartGame(level)}
                style={{
                  padding: "14px 24px",
                  background:
                    level === "Easy"
                      ? "#86efac"
                      : level === "Medium"
                      ? "#fde047"
                      : "#f87171",
                  border: "3px solid #fff",
                  borderRadius: "12px",
                  fontWeight: "800",
                  fontSize: "16px",
                  width: "55%",
                  cursor: "pointer",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.5)",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {level}{" "}
                {level === "Easy"
                  ? "🟢"
                  : level === "Medium"
                  ? "🟡"
                  : "🔴"}
              </button>
              <p
                style={{
                  fontWeight: "700",
                  marginTop: "10px",
                  color: "#fff",
                  textShadow: "1px 1px 3px #000",
                }}
              >
                ⏱{" "}
                {level === "Easy"
                  ? "00:90"
                  : level === "Medium"
                  ? "00:60"
                  : "00:30"}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={handleQuit}
          style={{
            padding: "12px 28px",
            background: "#ef4444",
            border: "3px solid #fff",
            borderRadius: "12px",
            fontWeight: "700",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0 6px 12px rgba(0,0,0,0.5)",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          Quit ❌
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
