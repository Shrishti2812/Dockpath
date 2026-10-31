require("dotenv").config();

const express = require("express");
const guideRoutes = require("./routes/guides");
const healthRoutes = require("./routes/health");
const learningPathRoutes = require("./routes/learningPathRoutes");

const app = express();
const port = process.env.PORT || 3000;

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
