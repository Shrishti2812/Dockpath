const documentationService = require("../services/documentationService");
const learningPathService = require("../services/learningPathService");

async function create(req, res, next) {
  const { documentationUrl, learningGoal } = req.body || {};

  if (typeof documentationUrl !== "string" || !documentationUrl.trim()) {
    res.status(400).json({
      error: "documentationUrl is required and must be a string.",
    });
    return;
  }

  if (typeof learningGoal !== "string" || !learningGoal.trim()) {
    res.status(400).json({
      error: "learningGoal is required and must be a string.",
    });
    return;
  }

  if (learningGoal.length > 1000) {
    res.status(400).json({
      error: "learningGoal must be 1000 characters or fewer.",
    });
    return;
  }

  try {
  const documentation = await documentationService.fetchDocumentation(
  documentationUrl.trim(),
  learningGoal.trim(),
);
    const learningPath = await learningPathService.generate(
      documentation,
      learningGoal.trim(),
    );

    res.json(learningPath);
  } catch (error) {
    next(error);
  }
}

module.exports = { create };
