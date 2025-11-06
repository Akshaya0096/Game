import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const ScoreboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { userName } = location.state || {};
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/users");
        const data = await res.json();

        if (!res.ok) {
          console.error("Error fetching users:", data);
          return;
        }

        // ✅ Sort users by score DESC
        const sorted = data.sort((a, b) => b.score - a.score);

        // ✅ Add rank numbers
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
        background: "linear-gradient(135deg, #dbeafe, #fef9c3, #fde68a)",
        fontFamily: "Poppins, sans-serif",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: "#fff",
          borderRadius: "25px",
          padding: "40px",
          width: "800px",
          textAlign: "center",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "20px",
            fontWeight: "700",
            color: "#3b82f6",
          }}
        >
          🏆 Global Leaderboard
        </h1>

        {scores.length > 0 ? (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Rank</th>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, idx) => (
                <tr key={idx} style={{ textAlign: "center" }}>
                  <td style={tdStyle}>{score.rank}</td>
                  <td
                    style={{
                      ...tdStyle,
                      fontWeight:
                        userName && score.username === userName ? "700" : "500",
                      color:
                        userName && score.username === userName
                          ? "#10b981"
                          : "#000",
                    }}
                  >
                    {score.username}
                  </td>
                  <td style={tdStyle}>{score.email}</td>
                  <td style={{ ...tdStyle, fontWeight: "700" }}>
                    {score.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ fontSize: "1.1rem", color: "#6b7280" }}>
            No scores yet! Play a game to appear on the leaderboard 🎮
          </p>
        )}

        <button
          onClick={() => navigate("/welcome", { state: { userName } })}
          style={buttonStyle("#10b981")}
          onMouseOver={(e) => (e.target.style.background = "#059669")}
          onMouseOut={(e) => (e.target.style.background = "#10b981")}
        >
          Main Menu
        </button>
      </motion.div>
    </div>
  );
};

const thStyle = {
  padding: "12px",
  background: "#3b82f6",
  color: "#fff",
  fontWeight: "600",
};
const tdStyle = { padding: "12px", borderBottom: "1px solid #d1d5db" };

export default ScoreboardPage;
