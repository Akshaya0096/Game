import express from "express";
import { signup, login, updateScore, getUsers, getScore } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// JWT-protected route
router.put("/score", verifyToken, updateScore);

router.get("/users", getUsers);
router.get("/score/:email", getScore);

export default router;
