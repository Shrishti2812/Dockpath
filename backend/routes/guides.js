const express = require("express");

const router = express.Router();

router.post("/", (_req, res) => {
  res.status(501).json({ error: "Guide generation is not implemented yet." });
});

router.all("/", (_req, res) => {
  res.set("Allow", "POST").status(405).json({ error: "Method not allowed." });
});

module.exports = router;
