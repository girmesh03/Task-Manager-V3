import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import corsOptions from "./config/corsOptions.js";
import globalErrorHandler from "./controllers/ErrorController.js";
import CustomError from "./utils/CustomError.js";

import DepartmentRoutes from "./routes/DepartmentRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import StatisticsRoutes from "./routes/StatisticsRoutes.js";
import TaskRoutes from "./routes/TaskRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";

import verifyJwt from "./middlewares/verifyJwt.js";

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/departments", DepartmentRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/statistics", verifyJwt, StatisticsRoutes);
app.use("/api/tasks", verifyJwt, TaskRoutes);
app.use("/api/users", verifyJwt, UserRoutes);

app.all("*", (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    // return next(new CustomError(`Can't find ${req.originalUrl} on this server!`, 404));
    next(new CustomError(`Can't find ${req.originalUrl} on this server!`, 404));
  } else {
    next(new CustomError('Can\'t find the requested resource', 404));
    // return next(new CustomError(`Can't find ${req.originalUrl} on this server!`, 404));
  }
});

app.use(globalErrorHandler);

export default app;
