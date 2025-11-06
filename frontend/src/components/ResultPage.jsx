import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Added `score`
  const { userName, level, gameResult, timeUsed, score } = location.state || {};

  // ✅ Save player result to localStorage (avoid duplicates)
  useEffect(() => {
    if (userName && level && timeUsed !== undefined) {
      const existingScores = JSON.parse(localStorage.getItem("scoreboard")) || [];

      const newScore = {
        username: userName,
        level,
        timeTaken: timeUsed,
        score, // ✅ Save the player's score
        result: gameResult,
        date: new Date().toLocaleString(),
      };

      // Check for duplicates
      const isDuplicate = existingScores.some(
        (s) =>
          s.username === newScore.username &&
          s.level === newScore.level &&
          s.timeTaken === newScore.timeTaken &&
          s.score === newScore.score &&
          s.date === newScore.date
      );

      if (!isDuplicate) {
        const updatedScores = [...existingScores, newScore];
        localStorage.setItem("scoreboard", JSON.stringify(updatedScores));
      }
    }
  }, [userName, level, timeUsed, gameResult, score]);

  const handlePlayAgain = () => navigate("/welcome", { state: { userName } });
  const handleScoreboard = () => navigate("/scoreboard", { state: { userName } });
  const handleQuit = () => navigate("/"); // back to login

  const buttonStyle = (bg) => ({
    padding: "12px 25px",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "12px",
    background: bg,
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fde68a, #fef9c3, #dbeafe)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: "#fff",
          borderRadius: "25px",
          padding: "50px",
          width: "600px",
          textAlign: "center",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "20px",
            fontWeight: "700",
            color: gameResult === "success" ? "#10b981" : "#ef4444",
          }}
        >
          {gameResult === "success" ? "🎉 You Won!" : "❌ You Lost!"}
        </h1>

        <p style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px" }}>
          👤 Player: {userName}
        </p>
        <p style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px" }}>
          ⚙️ Level: {level}
        </p>
        <p style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px" }}>
          🏆 Score: {score}
        </p>
        <p style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "30px" }}>
          ⏱ Time Taken: {timeUsed} seconds
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
          <button
            onClick={handlePlayAgain}
            style={buttonStyle("#10b981")}
            onMouseOver={(e) => (e.target.style.background = "#059669")}
            onMouseOut={(e) => (e.target.style.background = "#10b981")}
          >
            Play Again
          </button>

          <button
            onClick={handleScoreboard}
            style={buttonStyle("#3b82f6")}
            onMouseOver={(e) => (e.target.style.background = "#2563eb")}
            onMouseOut={(e) => (e.target.style.background = "#3b82f6")}
          >
            Scoreboard
          </button>

          <button
            onClick={handleQuit}
            style={buttonStyle("#ef4444")}
            onMouseOver={(e) => (e.target.style.background = "#dc2626")}
            onMouseOut={(e) => (e.target.style.background = "#ef4444")}
          >
            Quit
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultPage;
