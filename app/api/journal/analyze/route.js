import { GoogleGenerativeAI } from "@google/generative-ai";

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

    return Response.json({
      result: responseText
    });

  } catch (error) {
    console.error("Gemini error:", error);

    return Response.json(
      { error: "Failed to analyze journal entry" },
      { status: 500 }
    );
  }
}