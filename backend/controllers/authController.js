import bcrypt from "bcryptjs";
import User from "../models/usermodel.js";

// 📝 Signup
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  User.findByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length > 0)
      return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    User.create(name, email, hashedPassword, (err) => {
      if (err) return res.status(500).json({ error: "Failed to register" });
      res.status(201).json({ message: "User registered successfully" });
    });
  });
};

// 🔐 Login
export const login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0)
      return res.status(400).json({ error: "Invalid email or password" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, score: user.score },
    });
  });
};

// 🏆 Update Score
export const updateScore = (req, res) => {
  const { email, score } = req.body;
  if (!email || score === undefined)
    return res.status(400).json({ error: "Email and score are required" });

  User.updateScore(email, score, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Score updated successfully" });
  });
};

// 👥 Get All Users (Leaderboard)
export const getUsers = (req, res) => {
  User.getAll((err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
};
