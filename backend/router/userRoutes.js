import express from "express";
import { fetchLeaderboard, getProfile, login, logout, register } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",isAuthenticated,logout );
router.get("/leaderboard",fetchLeaderboard );
router.get("/getuser",isAuthenticated,getProfile);

export default router;