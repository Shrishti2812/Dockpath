const express = require("express");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

router.all("/", (_req, res) => {
  res.set("Allow", "GET").status(405).json({ error: "Method not allowed." });
});

module.exports = router;
