"use client";

import React, { useState, useRef } from "react";
import { Search, Globe, Image as ImageIcon, AlertTriangle, ShieldCheck, Loader2, Upload, TerminalSquare } from "lucide-react";
import { API_URL } from "../../lib/api";
import ExplainWithAI from "../../components/ExplainWithAI";

interface AnalysisResult {
  risk_score: number;
  confidence: number;
  reasoning: string;
  recommendation: string;
  evidence: any;
  category: string;
}

export default function ThreatChecker() {
  const [activeTab, setActiveTab] = useState<"text" | "url" | "image">("text");
  const [inputText, setInputText] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyzeText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch(`${API_URL}/analyze/text`, {
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
      const response = await fetch(`${API_URL}/analyze/url`, {
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
  
  const handleAnalyzeImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    const formData = new FormData();
    formData.append("file", selectedImage);
    
    try {
      const response = await fetch(`${API_URL}/analyze/image`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to analyze image.");
      }
    } catch (err) {
      setError("Unable to connect to the backend analysis server.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-primary border-primary/20 bg-primary/5";
    if (score < 70) return "text-yellow-500 border-yellow-500/20 bg-yellow-500/5";
    return "text-red-500 border-red-500/20 bg-red-500/5";
  };

  const getRiskBorder = (score: number) => {
    if (score < 30) return "border-primary/20";
    if (score < 70) return "border-yellow-500/20";
    return "border-red-500/20";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pt-12 pb-32">
      <div className="flex flex-col gap-4 text-center items-center">
        <p className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase">// the analyzer</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Real-Time Threat <span className="border-b border-primary text-primary">Extraction API</span></h2>
        <p className="text-zinc-400 text-sm font-mono max-w-xl leading-relaxed">
          Input suspicious text, URLs, or screenshots to extract immediate, structured insights and threat assessments from our core engine.
        </p>
      </div>

      <div className="glass-card">
        {/* Tabs Menu */}
        <div className="flex border-b border-border bg-[#030303]">
          <button
            onClick={() => { setActiveTab("text"); setResult(null); setError(null); }}
            className={`px-6 py-4 text-xs font-bold font-mono tracking-[0.1em] uppercase transition-all flex items-center gap-3 ${
              activeTab === "text" 
                ? "border-b-2 border-primary text-primary bg-[#080808]" 
                : "border-b-2 border-transparent text-zinc-500 hover:text-white hover:bg-[#050505]"
            }`}
          >
            <Search className="h-4 w-4" /> Message
          </button>
          <button
            onClick={() => { setActiveTab("url"); setResult(null); setError(null); }}
            className={`px-6 py-4 text-xs font-bold font-mono tracking-[0.1em] uppercase transition-all flex items-center gap-3 ${
              activeTab === "url" 
                ? "border-b-2 border-primary text-primary bg-[#080808]" 
                : "border-b-2 border-transparent text-zinc-500 hover:text-white hover:bg-[#050505]"
            }`}
          >
            <Globe className="h-4 w-4" /> Domain URL
          </button>
          <button
            onClick={() => { setActiveTab("image"); setResult(null); setError(null); }}
            className={`px-6 py-4 text-xs font-bold font-mono tracking-[0.1em] uppercase transition-all flex items-center gap-3 ${
              activeTab === "image" 
                ? "border-b-2 border-primary text-primary bg-[#080808]" 
                : "border-b-2 border-transparent text-zinc-500 hover:text-white hover:bg-[#050505]"
            }`}
          >
            <ImageIcon className="h-4 w-4" /> Screenshot
          </button>
        </div>

        {/* Input Form */}
        <div className="p-8">
          {activeTab === "text" && (
            <form onSubmit={handleAnalyzeText} className="space-y-6">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] font-mono">
                $ input_text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={5}
                placeholder="Paste the SMS, WhatsApp text, extortive demand message, or email body here..."
                className="w-full text-sm font-mono leading-relaxed bg-[#000000] border border-border rounded-sm p-4 text-white placeholder-zinc-700 focus:outline-none focus:border-primary transition-colors"
              />
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-zinc-600 font-bold uppercase font-mono tracking-widest">
                  {"// Powered by Agent 1"}
                </span>
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="px-6 py-3 bg-white text-black font-bold text-xs font-mono uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <TerminalSquare className="h-4 w-4" />}
                  {loading ? "ANALYZING..." : "RUN SCAN"}
                </button>
              </div>
            </form>
          )}
          
          {activeTab === "url" && (
            <form onSubmit={handleAnalyzeUrl} className="space-y-6">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] font-mono">
                $ target_url
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="e.g. https://secure-sbi-login.net"
                className="w-full text-sm font-mono leading-relaxed bg-[#000000] border border-border rounded-sm p-4 text-white placeholder-zinc-700 focus:outline-none focus:border-primary transition-colors"
              />
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-zinc-600 font-bold uppercase font-mono tracking-widest">
                  {"// Powered by Web Scraper Agent"}
                </span>
                <button
                  type="submit"
                  disabled={loading || !inputUrl.trim()}
                  className="px-6 py-3 bg-white text-black font-bold text-xs font-mono uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                  {loading ? "EXTRACTING..." : "VERIFY URL"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "image" && (
            <form onSubmit={handleAnalyzeImage} className="space-y-6">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] font-mono">
                $ input_screenshot
              </label>
              <div 
                className="border-2 border-dashed border-border rounded-sm p-12 text-center bg-[#030303] hover:bg-[#080808] transition-all cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedImage(e.target.files[0]);
                    }
                  }}
                />
                <Upload className="h-8 w-8 text-zinc-600 group-hover:text-primary transition-colors mx-auto mb-4" />
                {selectedImage ? (
                  <p className="text-sm font-bold font-mono text-primary">{selectedImage.name}</p>
                ) : (
                  <p className="text-sm font-mono text-zinc-500">Drop screenshot here or <span className="text-white border-b border-white">browse</span></p>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-zinc-600 font-bold uppercase font-mono tracking-widest">
                  {"// Powered by NVIDIA Vision Engine"}
                </span>
                <button
                  type="submit"
                  disabled={loading || !selectedImage}
                  className="px-6 py-3 bg-white text-black font-bold text-xs font-mono uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                  {loading ? "PROCESSING..." : "ANALYZE SCREENSHOT"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="glass-red p-4 rounded-sm flex items-center gap-3">
          <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
          <span className="text-xs font-mono font-bold text-red-500">{error}</span>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className={`glass-card p-0 border ${getRiskBorder(result.risk_score)} animate-fadeIn`}>
          {/* Header Metric */}
          <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-border p-6 gap-6 bg-[#030303]">
            <div>
              <p className="text-[10px] text-zinc-500 font-mono mb-2 uppercase tracking-[0.2em]">// THREAT CATEGORY</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{result.category}</h3>
            </div>
            
            <div className="flex gap-4">
              <div className={`px-6 py-4 rounded-sm border ${getRiskColor(result.risk_score)} flex flex-col items-center justify-center min-w-[120px]`}>
                <span className="text-3xl font-bold font-mono leading-none mb-2">{result.risk_score.toFixed(0)}</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] opacity-80 font-mono">RISK SCORE</span>
              </div>
              <div className="px-6 py-4 rounded-sm border border-border bg-[#000000] flex flex-col items-center justify-center min-w-[120px]">
                <span className="text-3xl font-bold text-white font-mono leading-none mb-2">{(result.confidence * 100).toFixed(0)}%</span>
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.1em] font-mono">CONFIDENCE</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8 bg-[#050505]">
            {/* Diagnostic Outputs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-[0.2em]">
                  {"// MODEL REASONING ENGINE"}
                </h4>
                <div className="bg-[#000000] border border-border rounded-sm p-5 font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap h-full min-h-[160px]">
                  {result.reasoning}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-primary font-mono uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3" /> {"// SAFETY RECOMMENDATION"}
                </h4>
                <div className="bg-primary/5 border border-primary/20 rounded-sm p-5 font-mono text-xs leading-relaxed text-primary h-full min-h-[160px] flex items-center">
                  {result.recommendation}
                </div>
              </div>
            </div>

            {/* Evidence Details */}
            {result.evidence && Object.keys(result.evidence).length > 0 && (
              <div className="border-t border-border pt-6 space-y-4">
                <h4 className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-[0.2em]">
                  {"// STRUCTURED METADATA"}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(result.evidence).map(([key, val]) => (
                    <div key={key} className="flex flex-col bg-[#000000] border border-border px-3 py-2 rounded-sm max-w-full overflow-hidden">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase font-mono tracking-widest">{key}</span>
                      <span className="text-xs font-mono text-zinc-300 truncate mt-1">{JSON.stringify(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t border-border pt-8 pb-4">
              {/* RAG Integration */}
              <ExplainWithAI query={`Explain the policy and rules regarding this fraud category: ${result.category}. Why is this considered high risk? Provide context on similar known scam patterns.`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
