"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("formal");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectedLang, setDetectedLang] = useState("");

  const detectLanguage = (input: string) => {
    const sinhalaRegex = /[\u0D80-\u0DFF]/;
    return sinhalaRegex.test(input) ? "Sinhala → English" : "English → Sinhala";
  };

  const handleConvert = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult("");

    setDetectedLang(detectLanguage(text));

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, tone }), // ✅ FIXED
      });

      const data = await res.json();

      console.log("API RESPONSE:", data);

      if (!res.ok) {
        setResult("AI service error. Try again.");
        return;
      }

      // ✅ USE ONLY THIS (as you confirmed)
      if (data.result) {
        setResult(data.result);
      } else {
        setResult("No response received.");
      }
    } catch (err) {
      console.error(err);
      setResult("Something went wrong");
    } finally {
      // ✅ ALWAYS RUNS (this fixes infinite spinner)
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  const handleClear = () => {
    setText("");
    setResult("");
    setDetectedLang("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Logo + Title */}
        <div className="text-center space-y-1">
          <div className="text-2xl font-bold flex justify-center items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
              St
            </div>
            <div className="text-indigo-700">SinguaTone</div>
          </div>
          <p className="text-xs text-gray-500">
            Translate. Refine. Sound Natural.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
          <textarea
            className="w-full text-sm outline-none resize-none bg-transparent text-gray-800"
            rows={5}
            placeholder="Type Sinhala or English text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {detectedLang && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full w-fit">
              {detectedLang}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <p className="text-black">Select Tone </p>
          <select
            className="flex-1 p-3 rounded-xl border text-sm bg-white shadow-sm text-black"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="corporate">Corporate</option>
          </select>

          <button
            onClick={handleClear}
            className="rounded-xl bg-indigo-400 text-sm hover:bg-gray-300 transition w-[75]"
          >
            Clear
          </button>
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-medium text-white 
          bg-gradient-to-r from-indigo-500 to-purple-500 
          hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Converting..." : "Convert"}
        </button>

        {/* Output Card */}
        <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3 min-h-[140px] text-gray-900">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500"></span>

            <button
              onClick={handleCopy}
              className="text-xs px-2 py-1 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Copy
            </button>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ) : (
            <div className="text-sm whitespace-pre-wrap">
              {result || "Your converted text will appear here..."}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-[10px] text-center text-gray-400">
          Powered by AI • Free & Fast • Concept by iKronyx
        </p>
      </div>
    </main>
  );
}
