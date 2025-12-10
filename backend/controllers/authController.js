import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

// 🔐 Login with JWT
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

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token, // <-- JWT token
      user: { id: user.id, name: user.name, email: user.email, score: user.score },
    });
  });
};

// 🏆 Update Score (JWT-protected route)
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

// 🏅 Get user score by email
export const getScore = (req, res) => {
  const email = req.params.email;
  if (!email) return res.status(400).json({ error: "Email required" });

  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.json({ score: 0 });

    res.json({ score: results[0].score || 0 });
  });
};
