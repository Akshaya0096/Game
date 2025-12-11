import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bgSky from "../assets/sky.webp";
import woodBg from "../assets/wood.jpg";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { userName, level, score, timeUsed } = location.state || {};
  const [allResults, setAllResults] = useState([]);

  useEffect(() => {
    if (userName && level && timeUsed !== undefined) {
      const existing = JSON.parse(localStorage.getItem("scoreboard")) || [];
      const newResult = {
        username: userName,
        level,
        score,
        timeUsed,
        date: new Date().toLocaleString(),
      };
      localStorage.setItem("scoreboard", JSON.stringify([...existing, newResult]));
      setAllResults([...existing, newResult]);
    }
  }, [userName, level, score, timeUsed]);

  const handlePlayAgain = () => navigate("/welcome", { state: { userName } });
  const handleScoreboard = () => navigate("/scoreboard", { state: { userName } });
  const handleQuit = () => navigate("/");

  
  const buttonVariants = {
    hover: {
      scale: 1.1,
      boxShadow: "0 0 15px rgba(255,255,255,0.6)",
      transition: { duration: 0.3, yoyo: Infinity },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        fontFamily: "'Comic Neue', cursive",
      }}
    >
      
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
          zIndex: -1,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: 0,
        }}
      />

      
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "3rem",
            marginBottom: "30px",
            color: "#ff6f61",
            textShadow: "2px 2px #fff",
          }}
        >
          🎮 Game Over
        </motion.h1>

       
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            width: "100%",
            maxWidth: "600px",
            borderRadius: "25px",
            padding: "30px",
            backgroundImage: `url(${woodBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: "6px solid #8b5e3c",
            boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
            marginBottom: "30px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "1.2rem",
              color: "#fff",
              textShadow: "1px 1px 2px #000",
            }}
          >
            <tbody>
              {[
                { label: "Player", value: userName },
                { label: "Level", value: level },
                { label: "Score", value: score },
                { label: "Time Taken", value: `${timeUsed} seconds` },
              ].map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.4)" }}>
                  <td style={{ padding: "12px", fontWeight: "700", textAlign: "right" }}>
                    {item.label}:
                  </td>
                  <td style={{ padding: "12px", textAlign: "left" }}>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          {[
            { label: "Play Again", onClick: handlePlayAgain, bg: "#10b981" },
            { label: "Scoreboard", onClick: handleScoreboard, bg: "#3b82f6" },
            { label: "Quit", onClick: handleQuit, bg: "#ef4444" },
          ].map((btn, idx) => (
            <motion.button
              key={idx}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={btn.onClick}
              style={{
                padding: "12px 25px",
                fontSize: "1rem",
                fontWeight: "600",
                borderRadius: "12px",
                background: btn.bg,
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
