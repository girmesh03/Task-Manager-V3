import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import corsOptions from "./config/corsOptions.js";
import globalErrorHandler from "./controllers/ErrorController.js";
import CustomError from "./utils/CustomError.js";

import AuthRoutes from "./routes/AuthRoutes.js";

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", AuthRoutes);

app.all("*", (req, res, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
