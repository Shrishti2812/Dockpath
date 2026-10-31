require("dotenv").config();

const express = require("express");
const guideRoutes = require("./routes/guides");
const healthRoutes = require("./routes/health");
const learningPathRoutes = require("./routes/learningPathRoutes");

const app = express();
const port = process.env.PORT || 3000;
const developmentOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const allowedOrigins = new Set(
  [
    ...developmentOrigins,
    ...(process.env.FRONTEND_URLS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  ],
);

app.use((req, res, next) => {
  const origin = req.get("Origin");
  res.vary("Origin");

  if (origin && allowedOrigins.has(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json({ limit: "16kb" }));

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the Dockpath API." });
});

app.use("/api/health", healthRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/learning-path", learningPathRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.use((error, _req, res, _next) => {
  const status = error.status || error.statusCode || 500;
  const message = status >= 500 ? "Unable to process the request." : error.message;

  if (status >= 500) {
    console.error("Request failed:", error.message);
  }

  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Dockpath API listening on http://localhost:${port}`);
});