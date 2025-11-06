import db from "../config/db.js";

const User = {
  findByEmail: (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
  },

  create: (name, email, password, callback) => {
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      callback
    );
  },

  updateScore: (email, score, callback) => {
    db.query("UPDATE users SET score = ? WHERE email = ?", [score, email], callback);
  },

  getAll: (callback) => {
    db.query("SELECT id, name, email, score FROM users ORDER BY score DESC", callback);
  },
};

export default User;
