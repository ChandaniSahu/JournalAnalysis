"use client";

import { useEffect, useState } from "react";

interface JournalEntry {
  _id: string;
  text: string;
  ambience: string;
  emotion?: string;
  keywords?: string[];
  summary?: string;
}

interface AnalysisResult {
  emotion: string;
  keywords: string[];
  summary: string;
}

export default function Home() {
  const [userId, setUserId] = useState("");
  const [text, setText] = useState("");
  const [ambience, setAmbience] = useState("forest");

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult>({ emotion: "", keywords: [], summary: "" });

  interface InsightsData {
    totalEntries: number;
    topEmotion: string;
    mostUsedAmbience: string;
    recentKeywords?: string[];
  }

  const [insights, setInsights] = useState<InsightsData | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("userId");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("userId", id);
    }

    setUserId(id);
    fetchEntries(id);
    fetchInsights(id);

  }, []);
  async function fetchEntries(id: string) {
    const res = await fetch(`/api/journal/${id}`);
    const data = await res.json();
    setEntries(data);

    if (data.length) {
      const latest = data[0];
      setAnalysis({
        emotion: latest.emotion,
        keywords: latest.keywords,
        summary: latest.summary
      });
    }

    return data;
  }
  async function fetchInsights(id: string) {
    const res = await fetch(`/api/journal/insights/${id}`);
    const data = await res.json();
    setInsights(data);
  }

  async function submitEntry() {
    await fetch("/api/journal", {
      method: "POST",
      body: JSON.stringify({
        userId,
        text,
        ambience
      })
    });

    setText("");
    fetchEntries(userId);
    fetchInsights(userId);
    analyzeLatest()
  }

  async function analyzeLatest() {
    if (!entries.length) return;

    const latest = entries[0];

    const res = await fetch("/api/journal/analyze", {
      method: "POST",
      body: JSON.stringify({
        text: latest.text
      })
    });

    const data = await res.json();

    setAnalysis({
      emotion: data.emotion,
      keywords: data.keywords,
      summary: data.summary
    });
  }
  return (
    <div className="p-10 bg-gray-50 text-gray-800 font-sans">

      <h1 className="text-blue-600 border-b-4 pb-3 mb-8 text-3xl font-bold">Journal Analysis</h1>

      <div className="bg-white p-5 rounded-lg shadow-md mb-8">
        <h2 className="text-gray-800 border-b pb-3 mb-5 text-xl">Journal Entry</h2>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-600">Ambience</label>
          <select
            value={ambience}
            onChange={(e) => setAmbience(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="forest">Forest</option>
            <option value="ocean">Ocean</option>
            <option value="mountain">Mountain</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-600">Journal Entry</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your journal..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[120px]"
          />
        </div>

        <button
          onClick={submitEntry}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
        >
          Submit
        </button>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md mb-8">
        <h2 className="text-gray-800 border-b pb-3 mb-5 text-xl">Entry History</h2>

        {entries.length === 0 ? (
          <p className="text-gray-500">No journal entries yet</p>
        ) : (
          entries.map((e) => (
            <div
              key={e._id}
              className="p-4 mb-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
            >
              <p className="text-gray-900 mb-1">{e.text}</p>
              <small className="text-gray-500">{e.ambience}</small>
            </div>
          ))
        )}
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md mb-8">
        <h2 className="text-gray-800 border-b pb-3 mb-5 text-xl">Analyze Latest Entry</h2>

        {entries.length === 0 ? (
          <div>
            <p className="text-gray-500">No journal entries for analysis</p>
            <button
              onClick={analyzeLatest}
              disabled
              className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-50"
            >
              Analyze Latest Entry
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={analyzeLatest}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg mb-6"
            >
              Analyze Latest Entry
            </button>

            {analysis && analysis.emotion && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">
                  <strong className="text-blue-600">Emotion:</strong> {analysis.emotion}
                </p>
                <p className="mb-2">
                  <strong className="text-blue-600">Keywords:</strong> {analysis.keywords.join(", ")}
                </p>
                <p>
                  <strong className="text-blue-600">Summary:</strong> {analysis.summary}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-gray-800 border-b pb-3 mb-5 text-xl">Emotion Insights</h2>
        <button
          onClick={() => fetchInsights(userId)}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg mb-6"
        >
          Fetch Insights
        </button>
        {insights && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>Total Entries:</strong> {insights.totalEntries}</p>
            <p><strong>Top Emotion:</strong> {insights.topEmotion}</p>
            <p><strong>Most Used Ambience:</strong> {insights.mostUsedAmbience}</p>
            <p>
              <strong>Keywords:</strong> {insights.recentKeywords?.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
