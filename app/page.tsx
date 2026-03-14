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
const [analysis, setAnalysis] = useState<AnalysisResult>({emotion:"",keywords:[],summary:""});
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
    <div style={{ padding: 40 }}>

      <h2>Journal Entry</h2>

      <select
        value={ambience}
        onChange={(e) => setAmbience(e.target.value)}
      >
        <option value="forest">Forest</option>
        <option value="ocean">Ocean</option>
        <option value="mountain">Mountain</option>
      </select>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your journal..."
      />

      <button onClick={submitEntry}>Submit</button>

      <hr />

      <h2>Entry History</h2>

      {entries.map((e) => (
        <div key={e._id}>
          <p>{e.text}</p>
          <small>{e.ambience}</small>
        </div>
      ))}

      <hr />

       <h2>Analyze Latest Entry</h2>

      {entries.length === 0 ? (
        <div>
          <p>No journal entries for analysis</p>
          <button onClick={analyzeLatest} disabled>
            Analyze Latest Entry
          </button>
        </div>
      ) : (
        <div>
          <button onClick={analyzeLatest}>
            Analyze Latest Entry
          </button>

         {analysis && <div>
            <p><strong>Emotion:</strong> {analysis.emotion}</p>
            <p><strong>Keywords:</strong> {analysis.keywords.join(", ")}</p>
            <p><strong>Summary:</strong> {analysis.summary}</p>
          </div>}
        </div>
      )}

      <hr />

    <h2>Emotion Insights</h2>
     <button onClick={() => fetchInsights(userId)}>clikc</button>
      {insights && (
        <div>
          <p>Total Entries: {insights.totalEntries}</p>
          <p>Top Emotion: {insights.topEmotion}</p>
          <p>Most Used Ambience: {insights.mostUsedAmbience}</p>
          <p>
            Keywords: {insights.recentKeywords?.join(", ")}
          </p>
        </div>
      )} 
    </div>
  );
}