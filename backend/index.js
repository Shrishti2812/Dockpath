require("dotenv").config();

const cheerio = require("cheerio");
const { GoogleGenAI } = require("@google/genai");

async function main() {
  const url = "https://react.dev/learn";

  console.log("Fetching documentation...");

  const response = await fetch(url, {
    headers: { "User-Agent": "DocPath-Prototype/1.0" },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Website returned status ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove content that isn't part of the main text.
  $("script, style, nav, footer, header").remove();

  const headings = $("h1, h2, h3")
    .map((_, el) => $(el).text().trim())
    .get();

  const content = $("main").text().replace(/\s+/g, " ").trim();

  console.log("\nHTTP status:", response.status);
  console.log("HTML size:", html.length, "characters");
  console.log("Headings found:", headings.length);
  console.log("Headings:", headings.slice(0, 12));
  console.log("\nExtracted text preview:\n", content.slice(0, 1200));

  if (!content) {
    throw new Error("No main content extracted. Inspect the page HTML.");
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from .env");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  console.log("\nGenerating a learning path...");

  const result = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `Create a beginner learning path from this extracted
React documentation.

Return 3 ordered steps. Each step must have a topic, a short
explanation, and a relevant source heading when possible.

Learning goal: Learn enough React to build a small project.

Documentation headings:
${headings.slice(0, 30).join("\n")}

Extracted documentation:
${content.slice(0, 12000)}`,
  });

  console.log("\nLEARNING PATH:\n");
  console.log(result.text);
}

main().catch((error) => {
  console.error("\nTEST FAILED:", error.message);
  process.exitCode = 1;
});
