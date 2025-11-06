import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { userName = "Player", level = "Easy", email = "" } = location.state || {};

  // Set total time based on level
  const getTime = () => {
    switch (level.toLowerCase()) {
      case "easy":
        return 90;
      case "medium":
        return 60;
      case "hard":
        return 30;
      default:
        return 0;
    }
  };

  const totalTime = getTime();

  // Game states
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  // Puzzle
  const [bananaQuestion, setBananaQuestion] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  // Fetch puzzle from API
  const fetchPuzzle = async () => {
    try {
      const res = await fetch("https://marcconrad.com/uob/banana/api.php");
      const data = await res.json();
      setBananaQuestion(data.question);
      setCorrectAnswer(data.solution);
      setFeedback("");
      setIsCorrect(null);
    } catch (err) {
      console.error("Error fetching puzzle:", err);
    }
  };

  // Fetch the first puzzle
  useEffect(() => {
    fetchPuzzle();
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) {
      // When time ends, go to results
      updateScoreInDB(email, score);
      navigate("/result", {
        state: {
          userName,
          level,
          score,
          gameResult: "timeup",
          timeUsed: totalTime,
        },
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format timer
  const formatTime = (seconds) => `00:${seconds.toString().padStart(2, "0")}`;

  const updateScoreInDB = async (email, score) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/score", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, score }),
      });
  
      const data = await res.json();
      console.log("Update response:", data);
  
      if (!res.ok) {
        console.error("Score update failed:", data);
      }
    } catch (err) {
      console.error("Error updating score:", err);
    }
  };
  

  // ✅ Handle Answer Confirmation
  const handleConfirmGuess = () => {
    if (guess === "") {
      alert("Please enter your answer!");
      return;
    }

    const isAnswerCorrect = parseInt(guess) === correctAnswer;

    if (isAnswerCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      setFeedback("✅ Correct!");
      setIsCorrect(true);
      setGuess("");
      fetchPuzzle(); // 🔁 Load new question
    } else {
      setFeedback("❌ Wrong! Try again!");
      setIsCorrect(false);
      setGuess(""); // clear input, keep same question
    }
  };

  const handleQuit = () => {
    updateScoreInDB(email, score);

    navigate("/welcome");
  };

  return (
    <div
      className="game-wrapper"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dbeafe, #fef9c3, #fde68a)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="game-card"
        style={{
          background: "#fff",
          borderRadius: "25px",
          padding: "40px",
          width: "650px",
          textAlign: "center",
          boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ marginBottom: "30px", fontWeight: "700" }}>🎮 Game On!</h1>

        {/* Player Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "35px",
            gap: "10px",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#e0f2fe",
              padding: "12px",
              borderRadius: "12px",
              fontWeight: "600",
            }}
          >
            👤 {userName}
          </div>

          <div
            style={{
              flex: 1,
              background: "#fef9c3",
              padding: "12px",
              borderRadius: "12px",
              fontWeight: "600",
            }}
          >
            ⚙️ {level}
          </div>

          <div
            style={{
              flex: 1,
              background: "#dcfce7",
              padding: "12px",
              borderRadius: "12px",
              fontWeight: "600",
              color: timeLeft <= 10 ? "#ef4444" : "#166534",
              animation: timeLeft <= 10 ? "blink 1s infinite alternate" : "none",
            }}
          >
            ⏱ {formatTime(timeLeft)}
          </div>

          <button
            onClick={handleQuit}
            style={{
              padding: "10px 15px",
              background: "#ef4444",
              borderRadius: "12px",
              border: "none",
              color: "#fff",
            }}
          >
            Quit
          </button>
        </div>

        {/* Score */}
        <div
          style={{
            background: "#f0f9ff",
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "20px",
            fontWeight: "700",
            color: "#0c4a6e",
            fontSize: "18px",
          }}
        >
          🏆 Score: {score}
        </div>

 
     {/* Puzzle */}
<div
  style={{
    background: "#fff8dc",
    borderRadius: "20px",
    marginBottom: "35px",

    /* center content */
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    /* container sizing */
    width: "100%",
    maxWidth: "560px",   
    height: "360px",     
    padding: "12px",     
    boxSizing: "border-box",
    overflow: "hidden",  
    marginLeft: "auto",
    marginRight: "auto",
  }}
>
  {bananaQuestion ? (
    <img
      src={bananaQuestion}
      alt="Banana Puzzle"
      style={{
        /* ensure the image always fits inside the container */
        maxWidth: "100%",
        maxHeight: "100%",

        /* keep image aspect ratio and center it */
        width: "auto",
        height: "auto",
        objectFit: "contain",

        /* styling */
        borderRadius: "14px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
        display: "block",
      }}
    />
  ) : (
    <p style={{ fontWeight: "600", fontSize: "18px" }}>Loading puzzle...</p>
  )}
</div>


        {/* Answer Input */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <input
            type="number"
            min="0"
            max="9"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            style={{
              width: "70px",
              padding: "10px",
              textAlign: "center",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontWeight: "600",
              fontSize: "18px",
            }}
          />

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleConfirmGuess}
            style={{
              padding: "10px 18px",
              borderRadius: "10px",
              background: "#10b981",
              border: "none",
              fontWeight: "600",
              color: "#fff",
            }}
          >
            Confirm
          </motion.button>
        </div>

        {/* Feedback */}
        {feedback && (
          <p
            style={{
              marginTop: "25px",
              fontWeight: "700",
              fontSize: "18px",
              color: isCorrect ? "#16a34a" : "#dc2626",
            }}
          >
            {feedback}
          </p>
        )}

        <style>
          {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }`}
        </style>
      </motion.div>
    </div>
  );
};

export default GamePage;
