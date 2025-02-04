import express from "express";
import { getStatistics } from "../controllers/StatisticsController.js";

const router = express.Router();

router.get("/", getStatistics);

export default router;
