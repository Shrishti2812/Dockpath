
require("dotenv").config();

const express = require("express");

const guideRoutes = require("./routes/guides");
const healthRoutes = require("./routes/health");
const learningPathRoutes = require("./routes/learningPathRoutes");

const app = express();
const configuredPort = process.env.PORT && process.env.PORT.trim();
const port = configuredPort ? Number(configuredPort) : 3000;

if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error("PORT must be an integer between 0 and 65535.");
}

// Allow frontend development origins.
const developmentOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174"
];

const allowedOrigins = new Set([
  ...developmentOrigins,
  ...(process.env.FRONTEND_URLS || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean)
]);

// CORS middleware.
app.use((req, res, next) => {
  const origin = req.get("Origin");

  res.vary("Origin");

  if (origin && allowedOrigins.has(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    if (origin && !allowedOrigins.has(origin)) {
      return res.sendStatus(403);
    }

    return res.sendStatus(204);
  }

  next();
});

// Parse JSON request bodies.
app.use(express.json({ limit: "16kb" }));

// Root route.
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to the Dockpath API."
  });
});

// API routes.
app.use("/api/health", healthRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/learning-path", learningPathRoutes);

// Handle unknown routes.
app.use((_req, res) => {
  res.status(404).json({
    error: "Route not found."
  });
});

// Global error handler.
app.use((error, _req, res, _next) => {
  const status = error.status || error.statusCode || 500;

  const message =
    status >= 500
      ? "Unable to process the request."
      : error.message;

  if (status >= 500) {
    console.error("Request failed:", error.message);
  }

  res.status(status).json({
    error: message
  });
});

const server = app.listen(port, () => {
  const address = server.address();
  const listeningPort =
    address && typeof address === "object" ? address.port : port;

  console.log(`Dockpath API listening on http://localhost:${listeningPort}`);
});

server.on("error", (error) => {
  console.error("Failed to start Dockpath API:", error.message);
  process.exitCode = 1;
});
