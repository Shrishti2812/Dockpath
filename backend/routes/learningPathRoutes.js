const express = require("express");
const learningPathController = require("../controllers/learningPathController");

const router = express.Router();

router.post("/", learningPathController.create);
router.all("/", (_req, res) => {
  res.set("Allow", "POST").status(405).json({ error: "Method not allowed." });
});

module.exports = router;
