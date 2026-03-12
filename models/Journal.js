import mongoose from "mongoose";

const JournalSchema = new mongoose.Schema(
  {
    userId: String,
    ambience: String,
    text: String,
    emotion: String,
    keywords: [String],
    summary: String
  },
  { timestamps: true }
);

export default mongoose.models.Journal ||
  mongoose.model("Journal", JournalSchema);