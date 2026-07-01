"use client";

import React, { useState } from "react";
import { Upload, ImageIcon, Loader2, AlertTriangle, ShieldCheck, FileText } from "lucide-react";
import { API_URL } from "../../lib/api";

interface AnalysisResult {
  risk_score: number;
  confidence: number;
  reasoning: string;
  recommendation: string;
  evidence: any;
  category: string;
}

export default function ScreenshotAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [demoTemplate, setDemoTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setDemoTemplate(null);
      setResult(null);
      setError(null);
    }
  };

  const handleSelectDemo = (templateKey: string) => {
    setDemoTemplate(templateKey);
    setSelectedFile(null);
    setResult(null);
    setError(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !demoTemplate) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    } else if (demoTemplate) {
      // Create a virtual mock file with the demo keyword in name to trigger backend fallback
      const mockFile = new File(["mock"], `${demoTemplate}.png`, { type: "image/png" });
      formData.append("file", mockFile);
    }

    try {
      const response = await fetch(`${API_URL}/analyze/image`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errData = await response.json();
        setError(errData.detail || "Image analysis execution failed.");
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

  const demoItems = [
    { key: "sbi_phishing_sms", name: "SBI Phishing SMS", desc: "Blocked Account PAN scam" },
    { key: "whatsapp_chat", name: "WhatsApp CBI Extortion", desc: "Digital arrest extortion call" },
    { key: "telegram_scam", name: "Telegram Hotels Tasks", desc: "Rating hotel deposits scam" },
    { key: "bank_notice", name: "Fake Bank Notice", desc: "Urgent RBI PAN linking alert" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-extrabold text-zinc-100 tracking-tight">Screenshot Analyzer</h2>
        <p className="text-zinc-400 text-sm">
          Upload screenshots of extortive chats, phishing alerts, fake bank notifications, or SMS text to extract and verify indices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Upload Form */}
        <div className="md:col-span-2 space-y-4">
          <div className="glass-card p-6 rounded-xl border border-zinc-850">
            <form onSubmit={handleUpload} className="space-y-6">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Screenshot Source
              </label>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed border-zinc-850 hover:border-zinc-700 rounded-xl p-8 text-center transition-all cursor-pointer relative bg-zinc-950/20 group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-zinc-500 group-hover:text-emerald-400 group-hover:scale-110 transition-all" />
                  <span className="text-sm font-semibold text-zinc-300">
                    {selectedFile ? selectedFile.name : "Select or drag screenshot image"}
                  </span>
                  <span className="text-xs text-zinc-500">Supports PNG, JPG, JPEG up to 10MB</span>
                </div>
              </div>

              {demoTemplate && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-xs px-3 py-2 rounded-lg text-emerald-400 flex items-center justify-between">
                  <span>Selected Template: <strong>{demoTemplate.replace("_", " ")}</strong></span>
                  <button type="button" onClick={() => setDemoTemplate(null)} className="underline hover:text-white">Clear</button>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 font-semibold uppercase">Powered by Agent 3 (OCR Analyzer)</span>
                <button
                  type="submit"
                  disabled={loading || (!selectedFile && !demoTemplate)}
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : "Run OCR Diagnostic"}
                </button>
              </div>
            </form>
          </div>

          {error && (
            <div className="glass-red p-4 rounded-xl border border-red-500/20 text-xs text-red-400 font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}
        </div>

        {/* Right Demo Side Cards */}
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-xl border border-zinc-850">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Quick Demo Templates</h4>
            <div className="flex flex-col gap-2">
              {demoItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleSelectDemo(item.key)}
                  className={`p-3 text-left rounded-lg text-xs transition-all border ${
                    demoTemplate === item.key 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : "bg-zinc-900/40 border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <p className="font-bold">{item.name}</p>
                  <p className="opacity-80 text-[10px] mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className={`glass-card p-6 rounded-xl border ${getRiskBorder(result.risk_score)} space-y-6 animate-fadeIn`}>
          {/* Header Metric */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-zinc-850 pb-4 gap-4">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Analysis Result Category</span>
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

          {/* OCR Extracted Text */}
          {result.evidence && result.evidence.extracted_text && (
            <div className="space-y-2 bg-zinc-900/40 border border-zinc-850 p-4 rounded-lg">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-zinc-400" /> OpenCV & PaddleOCR Extracted Text
              </h4>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed select-all">
                "{result.evidence.extracted_text}"
              </p>
            </div>
          )}

          {/* Diagnostic Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Model Analysis Explanation</h4>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/20 border border-zinc-850 p-4 rounded-lg">
                {result.reasoning}
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Safety Recommendation
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-lg">
                {result.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
