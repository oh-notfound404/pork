import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Base API URL
const BASE_API = "https://ioark-apiv1.onrender.com";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS
app.use(cors());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Proxy ShareBoost API
app.get("/tools/shareboost", async (req, res) => {
  try {
    const { cookie, link, count, delay } = req.query;

    // Validate required params
    if (!cookie || !link) {
      return res.status(400).json({ status: "error", message: "Cookie and Link are required" });
    }

    const countNum = parseInt(count) || 1;
    const delayNum = parseInt(delay) || 1;

    const apiURL =
      `${BASE_API}/tools/shareboost?` +
      new URLSearchParams({
        cookie,
        link,
        count: countNum,
        delay: delayNum
      });

    const start = Date.now();
    const response = await fetch(apiURL);
    const data = await response.json();

    res.json({
      status: "success",
      responseTime: `${Date.now() - start}ms`,
      data
    });
  } catch (err) {
    console.error(err);
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