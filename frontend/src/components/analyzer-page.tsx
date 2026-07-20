"use client";

import React, { useRef, useState } from "react";
import {
  AlertTriangle,
  FileText,
  Globe,
  Image as ImageIcon,
  Loader2,
  Search,
  ShieldCheck,
  TerminalSquare,
  Upload,
} from "lucide-react";
import { API_URL } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import ExplainWithAI from "./ExplainWithAI";

type InputKind = "text" | "url" | "file";

interface DemoItem {
  key: string;
  name: string;
  desc: string;
}

interface AnalysisResult {
  risk_score: number;
  confidence: number;
  reasoning: string;
  recommendation: string;
  evidence: Record<string, unknown>;
  category: string;
}

interface AnalyzerPageProps {
  title: string;
  description: string;
  endpoint: string;
  inputKind: InputKind;
  payloadKey?: "text" | "url";
  placeholder?: string;
  accept?: string;
  sourceLabel: string;
  submitLabel: string;
  loadingLabel: string;
  demoItems?: DemoItem[];
  demoExtension?: string;
  showExplainWithAI?: boolean;
}

export default function AnalyzerPage({
  title,
  description,
  endpoint,
  inputKind,
  payloadKey = "text",
  placeholder,
  accept,
  sourceLabel,
  submitLabel,
  loadingLabel,
  demoItems = [],
  demoExtension = "txt",
  showExplainWithAI = false,
}: AnalyzerPageProps) {
  const { authHeaders } = useAuth();
  const [textValue, setTextValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [demoTemplate, setDemoTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const canSubmit =
    inputKind === "file" ? Boolean(selectedFile || demoTemplate) : Boolean(textValue.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response: Response;
      if (inputKind === "file") {
        const formData = new FormData();
        if (selectedFile) {
          formData.append("file", selectedFile);
        } else if (demoTemplate) {
          const mockFile = new File(["mock"], `${demoTemplate}.${demoExtension}`);
          formData.append("file", mockFile);
        }
        response = await fetch(`${API_URL}${endpoint}`, { method: "POST", body: formData, headers: authHeaders() });
      } else {
        response = await fetch(`${API_URL}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ [payloadKey]: textValue }),
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.detail || "Analysis failed.");
        return;
      }

      setResult(await response.json());
    } catch {
      setError("Unable to connect to the backend analysis server.");
    } finally {
      setLoading(false);
    }
  };

  const icon = inputKind === "url" ? Globe : inputKind === "file" ? ImageIcon : Search;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-extrabold text-zinc-100 tracking-tight">{title}</h2>
        <p className="text-zinc-400 text-sm">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${demoItems.length ? "md:col-span-2" : "md:col-span-3"} space-y-4`}>
          <div className="glass-card p-6 rounded-xl border border-zinc-850">
            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {sourceLabel}
              </label>

              {inputKind === "file" ? (
                <div
                  className="border-2 border-dashed border-zinc-850 hover:border-zinc-700 rounded-xl p-8 text-center transition-all cursor-pointer relative bg-zinc-950/20 group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setSelectedFile(e.target.files[0]);
                        setDemoTemplate(null);
                      }
                    }}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-zinc-500 group-hover:text-emerald-400 group-hover:scale-110 transition-all" />
                    <span className="text-sm font-semibold text-zinc-300">
                      {selectedFile ? selectedFile.name : "Select or drag file"}
                    </span>
                  </div>
                </div>
              ) : inputKind === "url" ? (
                <input
                  type="text"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder={placeholder}
                  className="w-full text-sm font-mono leading-relaxed bg-[#000000] border border-border rounded-sm p-4 text-white placeholder-zinc-700 focus:outline-none focus:border-primary transition-colors"
                />
              ) : (
                <textarea
                  rows={5}
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  placeholder={placeholder}
                  className="w-full text-sm font-mono leading-relaxed bg-[#000000] border border-border rounded-sm p-4 text-white placeholder-zinc-700 focus:outline-none focus:border-primary transition-colors"
                />
              )}

              {demoTemplate && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-xs px-3 py-2 rounded-lg text-emerald-400 flex items-center justify-between">
                  <span>
                    Selected Template: <strong>{demoTemplate.replace("_", " ")}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setDemoTemplate(null)}
                    className="underline hover:text-white"
                  >
                    Clear
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-zinc-600 font-bold uppercase font-mono tracking-widest">
                  {sourceLabel}
                </span>
                <button
                  type="submit"
                  disabled={loading || !canSubmit}
                  className="px-6 py-3 bg-white text-black font-bold text-xs font-mono uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : React.createElement(icon, { className: "h-4 w-4" })}
                  {loading ? loadingLabel : submitLabel}
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

        {demoItems.length > 0 && (
          <div className="space-y-4">
            <div className="glass-card p-4 rounded-xl border border-zinc-850">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
                Demo Templates
              </h4>
              <div className="flex flex-col gap-2">
                {demoItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setDemoTemplate(item.key);
                      setSelectedFile(null);
                      setResult(null);
                      setError(null);
                    }}
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
        )}
      </div>

      {result && (
        <div className={`glass-card p-6 rounded-xl border ${getRiskBorder(result.risk_score)} space-y-6 animate-fadeIn`}>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-zinc-850 pb-4 gap-4">
            <div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Analysis Result Category
              </span>
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

          {result.evidence?.extracted_text && (
            <div className="space-y-2 bg-zinc-900/40 border border-zinc-850 p-4 rounded-lg">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-zinc-400" /> Extracted Text
              </h4>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed select-all">
                "{String(result.evidence.extracted_text)}"
              </p>
            </div>
          )}

          {result.evidence?.transcript && (
            <div className="space-y-2 bg-zinc-900/40 border border-zinc-850 p-4 rounded-lg">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <TerminalSquare className="h-4 w-4 text-emerald-400" /> Transcript
              </h4>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed select-all">
                "{String(result.evidence.transcript)}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Model Analysis Explanation
              </h4>
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

          {showExplainWithAI && (
            <ExplainWithAI
              query={`Explain the policy and rules regarding this fraud category: ${result.category}. Why is this considered high risk?`}
            />
          )}
        </div>
      )}
    </div>
  );
}
