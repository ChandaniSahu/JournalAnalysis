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
  "keywords": [],
  "summary": ""
}

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