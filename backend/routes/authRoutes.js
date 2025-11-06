import express from "express";
import { signup, login, updateScore, getUsers } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/score", updateScore);
router.get("/users", getUsers);

export default router;
