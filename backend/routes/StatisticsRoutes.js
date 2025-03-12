import express from "express";
import { getDashboardStats, getLeaderboardStats, getUserStatistics } from "../controllers/StatisticsController.js";

const router = express.Router();

router.get("/", getDashboardStats);

router.get("/leaderboard", getLeaderboardStats);

router.get("/user", getUserStatistics);

export default router;
