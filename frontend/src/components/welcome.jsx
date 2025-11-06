import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
      setTopScore(userData.topScore || 0);
      setEmail(userData.email || ""); // ✅ FIX: add this line
    } catch {
      setUserName("Player");
      setTopScore(0);
      setEmail("");
    }
  }, [navigate]);

  

  // 🕹 Navigate to Game Page
  const handleStartGame = (level) => {
    navigate("/game", {
      state: { userName, level, email},
    });
  };

  // 🚪 Quit & Logout
  const handleQuit = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="welcome-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="welcome-card"
      >
        <h1 className="welcome-title">
          Welcome, <span className="highlight">{userName}</span> 👋
        </h1>

        <p className="top-score">
          Your Top Score: <strong>{topScore}</strong>
        </p>

        <div className="difficulty-section">
          <h2>Select Difficulty</h2>

          <div className="difficulty-buttons">
            <div className="difficulty-row">
              <button
                onClick={() => handleStartGame("Easy")}
                className="easy-btn"
              >
                Easy
              </button>
              <p className="time-text">⏱ 00:90</p>
            </div>

            <div className="difficulty-row">
              <button
                onClick={() => handleStartGame("Medium")}
                className="medium-btn"
              >
                Medium
              </button>
              <p className="time-text">⏱ 00:60</p>
            </div>

            <div className="difficulty-row">
              <button
                onClick={() => handleStartGame("Hard")}
                className="hard-btn"
              >
                Hard
              </button>
              <p className="time-text">⏱ 00:30</p>
            </div>
          </div>
        </div>

        <button onClick={handleQuit} className="quit-btn">
          Quit
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
