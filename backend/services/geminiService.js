
const { GoogleGenAI } = require("@google/genai");

async function generateWithGemini(prompt) {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    const result = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        config: {
            responseMimeType: "application/json"
        },
        contents: prompt
    });

    return result.text;
}

module.exports = { generateWithGemini };
