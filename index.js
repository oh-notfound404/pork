import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Base API URL
const BASE_API = "https://ioark-apiv1.onrender.com";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Proxy ShareBoost API
app.get("/tools/shareboost", async (req, res) => {
  try {
    const { cookie, link, count, delay } = req.query;

    if (!cookie || !link || !count || !delay) {
      return res.status(400).json({
        status: "error",
        message: "Missing parameters"
      });
    }

    const apiURL =
      `${BASE_API}/tools/shareboost?` +
      new URLSearchParams({
        cookie,
        link,
        count,
        delay
      });

    const start = Date.now();
    const response = await fetch(apiURL);
    const data = await response.json();

    data.responseTime = `${Date.now() - start}ms`;

    res.json(data);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🍁 ShareBoost running at http://localhost:${PORT}`);
});