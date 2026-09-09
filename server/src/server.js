import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "../lib/prisma.ts";
import { errorHandler } from "./middlewares/error.middleware.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

config();

const app = express();
const VERSION = process.env.VERSION
  ? process.env.VERSION.startsWith("/")
    ? process.env.VERSION
    : `/${process.env.VERSION}`
  : "/api/v1";
const PORT = process.env.PORT || 3000;

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

/**API Routes */
app.get(`${VERSION}`, (req, res) => {
  return res.status(200).json({ message: "Server is ready..." });
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use(errorHandler);

let server;
let isShuttingDown = false;

const shutdown = async (exitCode) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log("Shutting down gracefully...");

  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(exitCode);
    });
    return;
  }

  await disconnectDB();
  process.exit(exitCode);
};

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err);
      shutdown(1);
    });

    process.on("uncaughtException", async (err) => {
      console.error("Uncaught Exception:", err);
      await shutdown(1);
    });

    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully");
      await shutdown(0);
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received, shutting down gracefully");
      await shutdown(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await disconnectDB();
    process.exit(1);
  }
};

startServer();
