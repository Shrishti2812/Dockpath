
const OpenAI = require("openai");

async function generateWithQwen(prompt) {
    const client = new OpenAI({
        apiKey: process.env.BHARATCODE_API_KEY,
        baseURL: "https://bharatcode.ai/api/model/v1"
    });

    const response = await client.responses.create({
        model: "qwen-3.8-27b",
        input: prompt,
        text: {
            format: {
                type: "json_object"
            }
        },
        store: false
    });

    return response.output_text;
}

module.exports = { generateWithQwen };
