# AI Journal Analysis

A Next.js application that analyzes journal entries using AI to provide emotional insights, keywords, and summaries.

## Live Demo

Checkout here : [https://chandani-journal-analysis.netlify.app/](https://chandani-journal-analysis.netlify.app/)


## Features

- **Journal Entry**: Write and submit journal entries with different ambience settings (Forest, Ocean, Mountain)
- **AI Analysis**: Automatically analyzes the latest entry for emotion, keywords, and summary using OpenAI
- **Entry History**: View all your previous journal entries
- **Emotion Insights**: Get statistics about your journaling patterns including total entries, top emotion, and most used ambience



## Tech Stack

- **Frontend**: Next.js 16, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Node.js with API routes
- **Database**: MongoDB (via Mongoose)
- **AI Services**: OpenAI, Google Generative AI

## Getting Started

1. Clone the repository: 
```base
git clone https://github.com/ChandaniSahu/JournalAnalysis.git\```
2. Install dependencies: 
```base
npm install
```
3. Set up environment variables:
   ```base
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Run the development server: 
```base 
npm run dev
```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

- `POST /api/journal/create` - Create a new journal entry
- `GET /api/journal/[userId]` - Get all entries for a user
- `POST /api/journal/analyze` - Analyze text for emotion, keywords, and summary
- `GET /api/journal/insights/[userId]` - Get insights about journaling patterns