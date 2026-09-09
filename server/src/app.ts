import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import { errorHandler } from "./middlewares/error.middleware.ts";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.ts";

config();

const app = express();

const VERSION = process.env.VERSION
  ? process.env.VERSION.startsWith("/")
    ? process.env.VERSION
    : `/${process.env.VERSION}`
  : "/api/v1";

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(clerkMiddleware());

app.get(VERSION, (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Server is ready...",
  });
});

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);

app.use(errorHandler);

export default app;
