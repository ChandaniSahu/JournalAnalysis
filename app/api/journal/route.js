import { connectDB } from "@/lib/db";
import Journal from "@/models/Journal";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const entry = await Journal.create(body);

  return Response.json(entry);
}