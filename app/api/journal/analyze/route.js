import { GoogleGenerativeAI } from "@google/generative-ai";
import Journal from "@/models/Journal";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { text } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

const prompt = `
Analyze the following journal entry and return ONLY valid JSON in this format:

{
  "emotion": "",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "summary": ""
}

Rules:
- "keywords" must be an array of separate words or short phrases.
- Each keyword must be its own string element in the array.
- Never combine multiple keywords into one element.
- Example: ["stress", "work", "deadline"]
  NOT ["stress", "work deadline"]

Journal text:
${text}
`;

    const result = await model.generateContent(prompt);

const responseText = result.response.text();

    // Remove markdown code block wrapper if present
    const cleanedText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Parse the JSON response
    const analysis = JSON.parse(cleanedText);

    // Find the latest journal entry to update with analysis
    const latestEntry = await Journal.findOne({ text }).sort({ createdAt: -1 });

    if (latestEntry) {
      // Update the entry with analysis results
      latestEntry.emotion = analysis.emotion;
      latestEntry.keywords = analysis.keywords;
      latestEntry.summary = analysis.summary;
      await latestEntry.save();
    }

    return Response.json(analysis);

  } catch (error) {
    console.error("Gemini error:", error);

    return Response.json(
      { error: "Failed to analyze journal entry" },
      { status: 500 }
    );
  }
}
