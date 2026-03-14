import { connectDB } from "@/lib/db";
import Journal from "@/models/Journal";

export async function GET(req, { params }) {
  const {userId} = await params 
  await connectDB();

  const entries = await Journal.find({ userId: userId });

  const totalEntries = entries.length;

  const emotionCount = {};
  const ambienceCount = {};
  const keywords = [];

  entries.forEach((e) => {
    if (e.emotion) {
      emotionCount[e.emotion] =
        (emotionCount[e.emotion] || 0) + 1;
    }

    ambienceCount[e.ambience] =
      (ambienceCount[e.ambience] || 0) + 1;

    if (e.keywords) keywords.push(...e.keywords);
  });

  const topEmotion =
    Object.keys(emotionCount).sort(
      (a, b) => emotionCount[b] - emotionCount[a]
    )[0];

  const mostUsedAmbience =
    Object.keys(ambienceCount).sort(
      (a, b) => ambienceCount[b] - ambienceCount[a]
    )[0];

  return Response.json({
    totalEntries,
    topEmotion,
    mostUsedAmbience,
    recentKeywords: keywords.slice(-5)
  });
}