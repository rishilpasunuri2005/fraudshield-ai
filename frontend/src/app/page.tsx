"use client";

import Link from "next/link";
import { Shield, Eye, AlertOctagon, HelpCircle, PhoneCall, Layers, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center relative py-12">
        <div className="absolute inset-0 -top-8 flex justify-center -z-10">
          <div className="h-44 w-[600px] rounded-full bg-emerald-500/10 blur-[100px]" />
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-6 uppercase tracking-wider animate-bounce">
          <Shield className="h-4 w-4" /> ET AI Hackathon 2026 Submission
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-100 to-emerald-400 bg-clip-text text-transparent">
          Proactive Digital Public Safety
        </h1>
        
        <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto font-medium">
          FraudShield AI is an intelligent public safety ecosystem detecting and investigations scam networks, WhatsApp extortion, phishing links, and digital arrest threats.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            Access Citizen Portal
          </Link>
          <button
            onClick={() => {
              localStorage.setItem("user-role", "police");
              window.location.href = "/police";
            }}
            className="px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold text-sm hover:bg-zinc-850 hover:text-white transition-all flex items-center gap-2"
          >
            <Eye className="h-4 w-4 text-emerald-400" /> Enter Police Console
          </button>
        </div>
      </div>

      {/* Feature Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20">
            <Shield className="h-5 w-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">Citizen Fraud Shield</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Instantly checks suspicious SMS texts, extortive chat messages, and domain links using LangChain diagnostics.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20">
            <PhoneCall className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">Voice Scam Detector</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Filters static via Silero VAD, transcribes threat calls using Whisper, and extracts digital arrest indicators.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-pink-500/30 transition-all">
          <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 border border-pink-500/20">
            <AlertOctagon className="h-5 w-5 text-pink-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">Screenshot Analyzer</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Extracts text from chat, banking, and email screenshots using CV pre-processing and PaddleOCR.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-teal-500/30 transition-all">
          <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4 border border-teal-500/20">
            <Layers className="h-5 w-5 text-teal-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-2">Network Intelligence</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Connects suspects, device identifiers, and UPIs in a Neo4j knowledge graph to trace fraud clusters.
          </p>
        </div>
      </div>

      {/* Statistics / Trust Banner */}
      <div className="mt-16 glass-card p-8 rounded-3xl border border-zinc-800/80 bg-zinc-950/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-[80px]" />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-extrabold text-emerald-400 tracking-tight">100%</p>
            <p className="mt-1 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Structured JSON Output</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-indigo-400 tracking-tight">&lt; 3s</p>
            <p className="mt-1 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Analysis Latency</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-teal-400 tracking-tight">Neo4j</p>
            <p className="mt-1 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Syndicate Clustering</p>
          </div>
        </div>
      </div>
    </div>
  );
}
