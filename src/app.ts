import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

const app = express();


app.use(helmet());


app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 100,
  message: "Too many requests. Please try again later.",
});

app.use(limiter);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());


app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    success: true,
    version: "1.0.0",
    message: "Welcome to the FixItNow Backend Server! ",
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)} seconds`,
  });
});

export default app;