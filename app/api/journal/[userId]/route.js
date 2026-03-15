import { connectDB } from "@/lib/db";
import Journal from "@/models/Journal";

export async function GET(req, { params }) {
  await connectDB();
   const { userId } = await params;
   console.log('userid',userId)
  const entries = await Journal.find({ userId: userId }).sort({
    createdAt: -1
  });
  console.log('entries',entries)
  return Response.json(entries);
}