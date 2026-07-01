"use client";

import React, { useState } from "react";
import { Search, Globe, AlertTriangle, ShieldCheck, HelpCircle, Loader2 } from "lucide-react";

interface AnalysisResult {
  risk_score: number;
  confidence: number;
  reasoning: string;
  recommendation: string;
  evidence: any;
  category: string;
}

export default function ThreatChecker() {
  const [activeTab, setActiveTab] = useState<"text" | "url">("text");
  const [inputText, setInputText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch("http://localhost:8000/analyze/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText })
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to analyze text.");
      }
    } catch (err) {
      setError("Unable to connect to the backend analysis server.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch("http://localhost:8000/analyze/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl })
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to analyze URL.");
      }
    } catch (err) {
      setError("Unable to connect to the backend analysis server.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    if (score < 70) return "text-amber-400 border-amber-500/20 bg-amber-500/5";
    return "text-red-400 border-red-500/20 bg-red-500/5";
  };

  const getRiskBorder = (score: number) => {
    if (score < 30) return "border-emerald-500/20";
    if (score < 70) return "border-amber-500/20";
    return "border-red-500/20";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-extrabold text-zinc-100 tracking-tight">Threat Checker</h2>
        <p className="text-zinc-400 text-sm">
          Run immediate, structured diagnostics on suspicious messages, extortive emails, or phishing URLs.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => { setActiveTab("text"); setResult(null); setError(null); }}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "text" 
              ? "border-emerald-500 text-emerald-400" 
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Search className="h-4 w-4" /> Message Scan
        </button>
        <button
          onClick={() => { setActiveTab("url"); setResult(null); setError(null); }}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "url" 
              ? "border-emerald-500 text-emerald-400" 
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Globe className="h-4 w-4" /> Link URL Scan
        </button>
      </div>

      {/* Input Form */}
      <div className="glass-card p-6 rounded-xl border border-zinc-850">
        {activeTab === "text" ? (
          <form onSubmit={handleAnalyzeText} className="space-y-4">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Suspicious Message Text
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              placeholder="Paste the SMS, WhatsApp text, extortive demand message, or email body here..."
              className="w-full text-sm bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase">Powered by Agent 1 (Citizen Shield)</span>
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : "Run Scan"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAnalyzeUrl} className="space-y-4">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Suspicious Domain Link
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="e.g. http://secure-sbi-login.net, https://check-your-lottery.in"
              className="w-full text-sm bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase">Powered by Agent 1 (Phishing Analyzer)</span>
              <button
                type="submit"
                disabled={loading || !inputUrl.trim()}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : "Verify Link"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="glass-red p-4 rounded-xl border border-red-500/20 text-xs text-red-400 font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className={`glass-card p-6 rounded-xl border ${getRiskBorder(result.risk_score)} space-y-6 animate-fadeIn`}>
          {/* Header Metric */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-zinc-850 pb-4 gap-4">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Scam Risk Category</span>
              <h3 className="text-lg font-bold text-zinc-200 mt-1">{result.category}</h3>
            </div>
            
            <div className="flex gap-3">
              <div className={`px-4 py-2 rounded-lg border text-center ${getRiskColor(result.risk_score)}`}>
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-60">Risk Score</span>
                <span className="text-xl font-extrabold">{result.risk_score.toFixed(0)}/100</span>
              </div>
              <div className="px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/40 text-center">
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Confidence</span>
                <span className="text-xl font-extrabold text-zinc-300">{(result.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Model Explanation</h4>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/20 border border-zinc-850 p-4 rounded-lg">
                {result.reasoning}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Recommended Action
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-lg">
                {result.recommendation}
              </p>
            </div>
          </div>

          {/* Evidence Details */}
          {result.evidence && Object.keys(result.evidence).length > 0 && (
            <div className="border-t border-zinc-850 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Metadata Evidence Flags</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(result.evidence).map(([key, val]) => (
                  <span key={key} className="inline-flex items-center gap-1 text-[10px] bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded text-zinc-400">
                    <span className="font-semibold text-zinc-500">{key}:</span> {JSON.stringify(val)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
