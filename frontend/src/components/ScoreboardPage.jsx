import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import bgSky from "../assets/sky.webp";

const ScoreboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName } = location.state || {};
  const [scores, setScores] = useState([]);

  // Fetch scores from backend
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/users");
        const data = await res.json();
        if (!res.ok) {
          console.error("Error fetching users:", data);
          return;
        }
        const sorted = data.sort((a, b) => b.score - a.score);
        const ranked = sorted.map((user, index) => ({
          rank: index + 1,
          username: user.name,
          email: user.email,
          score: user.score ?? 0,
        }));
        setScores(ranked);
      } catch (err) {
        console.error("Error loading scoreboard:", err);
      }
    };
    fetchScores();
  }, []);

  // Rank emoji
  const getRankEmoji = (rank) => {
    switch (rank) {
      case 1:
        return "👑";
      case 2:
        return "🌟";
      case 3:
        return "🔥";
      default:
        return "✨";
    }
  };

  // Card background gradient
  const getCardGradient = (rank, isCurrentUser) => {
    if (isCurrentUser) return "linear-gradient(135deg, #FFD700, #FFFACD)"; // Bright gold for current user
    switch (rank) {
      case 1:
        return "linear-gradient(135deg, #FFD700, #FFEC8B)";
      case 2:
        return "linear-gradient(135deg, #C0C0C0, #E0E0E0)";
      case 3:
        return "linear-gradient(135deg, #CD7F32, #D9A066)";
      default:
        return "linear-gradient(135deg, #FFB6C1, #87CEFA)";
    }
  };

  // Blink animation for current user
  const blinkAnimation = {
    animation: "blink 1s infinite",
  };
  const blinkKeyframes = `
    @keyframes blink {
      0% { box-shadow: 0 10px 30px rgba(255,215,0,0.7); }
      50% { box-shadow: 0 10px 30px rgba(255,215,0,0.3); }
      100% { box-shadow: 0 10px 30px rgba(255,215,0,0.7); }
    }
  `;

  // Inject keyframes
  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(blinkKeyframes, styleSheet.cssRules.length);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        fontFamily: "'Comic Neue', cursive",
      }}
    >
      {/* Fixed Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${bgSky})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.25)",
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px 20px",
          width: "100%",
        }}
      >
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "3rem",
            marginBottom: "30px",
            color: "#ff6f61",
            textShadow: "2px 2px #fff",
          }}
        >
          🏆 Fun Leaderboard 🎮
        </motion.h1>

        {/* Score Cards */}
        <div
          style={{
            width: "100%",
            maxWidth: "700px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {scores.length > 0 ? (
            scores.map((score) => {
              const isCurrentUser = userName === score.username;
              return (
                <motion.div
                  key={score.rank}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    delay: (score.rank - 1) * 0.05,
                  }}
                  whileHover={{
                    scale: isCurrentUser ? 1.05 : 1.02,
                    boxShadow: isCurrentUser
                      ? "0 15px 40px rgba(255,215,0,0.6)"
                      : "0 10px 30px rgba(0,0,0,0.35)",
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "50px 1fr 1fr 80px",
                    alignItems: "center",
                    padding: "20px",
                    borderRadius: "20px",
                    background: getCardGradient(score.rank, isCurrentUser),
                    boxShadow: isCurrentUser
                      ? "0 10px 30px rgba(255,215,0,0.7)"
                      : "0 6px 20px rgba(0,0,0,0.25)",
                    color: "#333",
                    fontWeight: "700",
                    cursor: "pointer",
                    transform: isCurrentUser ? "scale(1.03)" : "scale(1)",
                    transition: "all 0.3s ease",
                    ...(isCurrentUser ? blinkAnimation : {}),
                  }}
                >
                  <div style={{ fontSize: "1.8rem", textAlign: "center" }}>
                    {getRankEmoji(score.rank)}
                  </div>
                  <div style={{ fontSize: "1.2rem" }}>{score.username}</div>
                  <div style={{ fontSize: "1rem", color: "#555" }}>
                    {score.email}
                  </div>
                  <div
                    style={{ fontSize: "1.2rem", textAlign: "right" }}
                  >
                    {score.score} 🎯
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: "20px",
                textAlign: "center",
                background: "rgba(255,255,255,0.85)",
                borderRadius: "15px",
                boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                color: "#555",
              }}
            >
              No scores yet! Play a game to appear on the leaderboard 🎮
            </motion.div>
          )}
        </div>

        {/* Main Menu Button */}
        <motion.button
          onClick={() => navigate("/welcome", { state: { userName } })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            marginTop: "30px",
            padding: "15px 30px",
            fontSize: "1.2rem",
            fontWeight: "700",
            borderRadius: "25px",
            border: "none",
            background: "#10b981",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            transition: "0.3s",
          }}
        >
          Main Menu
        </motion.button>
      </div>
    </div>
  );
};

export default ScoreboardPage;
