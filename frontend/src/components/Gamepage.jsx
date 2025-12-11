import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "../assets/bgg.jpg"; 

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { userName = "Player", level = "Easy", email = "" } = location.state || {};

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
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [bananaQuestion, setBananaQuestion] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const [pokemon, setPokemon] = useState(null);

  const [showReward, setShowReward] = useState(false);
  const [rewardEmojis, setRewardEmojis] = useState([]);
  const [showHeartBreak, setShowHeartBreak] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);

  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  
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

  
  const fetchPokemon = async () => {
    try {
      const randomId = Math.floor(Math.random() * 151) + 1;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await res.json();
      setPokemon({
        name: data.name,
        image: data.sprites.front_default,
      });
    } catch (error) {
      console.error("Error fetching Pokémon", error);
    }
  };

  useEffect(() => {
    fetchPuzzle();
    fetchPokemon();
  }, []);

  
  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => `00:${seconds.toString().padStart(2, "0")}`;

  
  const updateScoreInDB = async (email, score) => {
    try {
      const token = localStorage.getItem("token"); 

      const res = await fetch("http://localhost:5000/api/auth/score", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ email, score }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Score update failed:", data);
        alert("Failed to update score. Make sure you are logged in.");
      }
    } catch (err) {
      console.error("Error updating score:", err);
      alert("Error updating score. Check console for details.");
    }
  };

  const triggerRewardAnimation = () => {
    const emojis = ["🎉", "⭐", "🪙", "✨", "💎"];
    const particles = Array.from({ length: 12 }).map(() => ({
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 80 + 10,
      rotation: Math.random() * 360,
    }));
    setRewardEmojis(particles);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 1500);
  };

  const triggerHeartBreakAnimation = () => {
    setShowHeartBreak(true);
    setTimeout(() => setShowHeartBreak(false), 1500);
  };

  const handleConfirmGuess = () => {
    if (!guess) {
      alert("Please enter your answer!");
      return;
    }
    const isAnswerCorrect = parseInt(guess) === correctAnswer;
    if (isAnswerCorrect) {
      setScore(score + 1);
      setFeedback("✅ Correct!");
      setIsCorrect(true);
      setGuess("");
      fetchPuzzle();
      fetchPokemon();
      triggerRewardAnimation();
    } else {
      setFeedback("❌ Wrong! Try again!");
      setIsCorrect(false);
      setGuess("");
      setShakeCard(true);
      triggerHeartBreakAnimation();
      setTimeout(() => setShakeCard(false), 800);
    }
  };

  const handleQuit = async () => {
    await updateScoreInDB(email, score);
    navigate("/welcome");
  };

  const handleTimeUp = async () => {
    await updateScoreInDB(email, score);
    navigate("/result", {
      state: { userName, level, score, gameResult: "timeup", timeUsed: totalTime },
    });
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
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
          backgroundColor: "rgba(0,0,0,0.3)",
          zIndex: 0,
        }}
      />

      
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          style={{
            width: "950px",
            maxWidth: "100%",
            padding: "35px",
            borderRadius: "30px",
            background: "linear-gradient(to bottom right, #fef3c7, #fde68a)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
            border: "4px solid #fcd34d",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontWeight: "900",
              fontSize: "36px",
              marginBottom: "25px",
              color: "#f59e0b",
              textAlign: "center",
              textShadow: "3px 3px 6px #000",
            }}
          >
            🎮 Game On, {userName}!
          </h1>

          
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "25px",
              gap: "10px",
            }}
          >
            <div
              style={{
                flex: 1,
                background: "#86efac",
                padding: "10px",
                borderRadius: "12px",
                fontWeight: "700",
                boxShadow: "0 5px 12px rgba(0,0,0,0.3)",
                textAlign: "center",
                fontSize: "20px",
              }}
            >
              👤 {userName}
            </div>
            <div
              style={{
                flex: 1,
                background: "#fde047",
                padding: "10px",
                borderRadius: "12px",
                fontWeight: "700",
                boxShadow: "0 5px 12px rgba(0,0,0,0.3)",
                textAlign: "center",
                fontSize: "20px",
              }}
            >
              ⚙️ {level}
            </div>
            <div
              style={{
                flex: 1,
                background: "#f87171",
                padding: "10px",
                borderRadius: "12px",
                fontWeight: "700",
                color: "#fff",
                boxShadow: "0 5px 12px rgba(0,0,0,0.3)",
                textAlign: "center",
                fontSize: "20px",
                animation: timeLeft <= 10 ? "blink 1s infinite alternate" : "none",
              }}
            >
              ⏱ {formatTime(timeLeft)}
            </div>
            <button
              onClick={handleQuit}
              style={{
                padding: "8px 12px",
                background: "#ef4444",
                borderRadius: "12px",
                border: "none",
                color: "#fff",
                boxShadow: "0 5px 10px rgba(0,0,0,0.25)",
                fontSize: "20px",
              }}
            >
              Quit ❌
            </button>
          </div>

          
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            
            <motion.div
              style={{
                flex: 2,
                background: "#fffacd",
                borderRadius: "20px",
                padding: "15px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
                position: "relative",
              }}
              animate={shakeCard ? { x: [-10, 10, -8, 8, -5, 5, 0] } : { x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {bananaQuestion ? (
                <img
                  src={bananaQuestion}
                  alt="Banana Puzzle"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "15px",
                  }}
                />
              ) : (
                <p style={{ fontWeight: "600", fontSize: "18px" }}>Loading puzzle...</p>
              )}

              
              {showReward &&
                rewardEmojis.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: -50, opacity: 1, rotate: item.rotation }}
                    animate={{ y: 250, opacity: 0 }}
                    transition={{ duration: 1.2 + Math.random() }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: `${item.left}%`,
                      fontSize: "40px",
                      pointerEvents: "none",
                    }}
                  >
                    {item.emoji}
                  </motion.div>
                ))}

              {showHeartBreak &&
                Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -30, opacity: 1, rotate: Math.random() * 360 }}
                    animate={{ y: 220 + Math.random() * 50, opacity: 0 }}
                    transition={{ duration: 1 + Math.random() }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: `${Math.random() * 80 + 10}%`,
                      fontSize: "40px",
                      color: "red",
                      pointerEvents: "none",
                    }}
                  >
                    💔
                  </motion.div>
                ))}
            </motion.div>

            
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <div
                style={{
                  background: "#dbeafe",
                  padding: "10px",
                  borderRadius: "12px",
                  fontWeight: "700",
                  color: "#1e40af",
                  fontSize: "20px",
                  width: "100%",
                  textAlign: "center",
                  boxShadow: "0 5px 12px rgba(0,0,0,0.2)",
                }}
              >
                🏆 Score: {score}
              </div>

              {pokemon && (
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ marginBottom: "10px" }}>Random Pokémon: {pokemon.name}</h3>
                  <img src={pokemon.image} alt={pokemon.name} style={{ width: "120px", height: "auto" }} />
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  style={{
                    width: "60px",
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "12px",
                    border: "2px solid #fcd34d",
                    fontWeight: "700",
                    fontSize: "20px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleConfirmGuess}
                  style={{
                    padding: "10px 15px",
                    borderRadius: "12px",
                    background: "#10b981",
                    border: "none",
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#fff",
                    boxShadow: "0 5px 12px rgba(0,0,0,0.25)",
                    cursor: "pointer",
                  }}
                >
                  Confirm ✅
                </motion.button>
              </div>

              {feedback && (
                <p
                  style={{
                    fontWeight: "700",
                    fontSize: "16px",
                    color: isCorrect ? "#16a34a" : "#dc2626",
                    textAlign: "center",
                    marginTop: "5px",
                  }}
                >
                  {feedback}
                </p>
              )}
            </div>
          </div>

          <style>
            {`
              @keyframes blink {
                0% { opacity: 1; }
                50% { opacity: 0.3; }
                100% { opacity: 1; }
              }
            `}
          </style>
        </motion.div>
      </div>
    </div>
  );
};

export default GamePage;
