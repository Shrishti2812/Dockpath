const { generateWithGemini } = require("./geminiService");
const { generateWithQwen } = require("./qwenService");

const providers = {
    gemini: generateWithGemini,
    qwen: generateWithQwen
};

function getAIProvider() {
    const providerName = process.env.AI_PROVIDER || "gemini";
    const generateFunction = providers[providerName];

    if (!generateFunction) {
        throw new Error(`AI provider ${providerName} is not supported.`);
    }

    return generateFunction;
}

module.exports = { getAIProvider };