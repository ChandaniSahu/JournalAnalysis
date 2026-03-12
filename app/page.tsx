"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [text, setText] = useState("");
  const [ambience, setAmbience] = useState("forest");

  const [entries, setEntries] = useState([]);
  const [analysis, setAnalysis] = useState({emotion:"",keywords:[],summary:""});
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    let id = localStorage.getItem("userId");

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("userId", id);
    }

    setUserId(id);
    fetchEntries(id);
    // fetchInsights(id);
  }, []);

  async function fetchEntries(id) {
    const res = await fetch(`/api/journal/${id}`);
    const data = await res.json();
    setEntries(data);
  }

  // async function fetchInsights(id) {
  //   const res = await fetch(`/api/journal/insights/${id}`);
  //   const data = await res.json();
  //   setInsights(data);
  // }

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
    // fetchInsights(userId);
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

// remove markdown wrapper
const cleaned = data.result
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

// convert to object
const parsed = JSON.parse(cleaned);

setAnalysis({
  emotion: parsed.emotion,
  keywords: parsed.keywords,
  summary: parsed.summary
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

      <button onClick={analyzeLatest}>
        Click Analyze Latest Entry
      </button>

     {analysis && <div>
  <p><strong>Emotion:</strong> {analysis.emotion}</p>

  <p><strong>Keywords:</strong> {analysis.keywords.join(", ")}</p>

  <p><strong>Summary:</strong> {analysis.summary}</p>
</div>}

      <hr />

      {/*<h2>Emotion Insights</h2>

      {insights && (
        <div>
          <p>Total Entries: {insights.totalEntries}</p>
          <p>Top Emotion: {insights.topEmotion}</p>
          <p>Most Used Ambience: {insights.mostUsedAmbience}</p>
          <p>
            Keywords: {insights.recentKeywords?.join(", ")}
          </p>
        </div>
      )} */}
    </div>
  );
}