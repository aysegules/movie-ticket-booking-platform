import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const VERSION = process.env.VERSION || "api/v1";

app.get(`${VERSION}/`, (req, res) => {
  return res.status(200).json({ message: "Server is ready..." });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
