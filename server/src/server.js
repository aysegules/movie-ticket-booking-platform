import { config } from "dotenv";
import app from "./app.js";

config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = (exitCode) => {
  console.log("Shutting down gracefully...");

  server.close(() => {
    process.exit(exitCode);
  });
};

process.on("SIGTERM", () => shutdown(0));
process.on("SIGINT", () => shutdown(0));

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  shutdown(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  shutdown(1);
});
