"use client";

import Link from "next/link";
import { Shield, Eye, AlertOctagon, HelpCircle, PhoneCall, Layers, Globe, Radio } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Section */}
      <div className="text-center relative py-12 border border-border bg-card/60 p-8 rounded-[4px] overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute -top-12 left-1/4 h-32 w-32 rounded-full bg-primary/10 blur-[80px]" />
        <div className="absolute -bottom-12 right-1/4 h-32 w-32 rounded-full bg-accent/10 blur-[80px]" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/5 text-[10px] font-bold text-primary uppercase tracking-widest font-mono rounded-[4px] mb-6">
          <Radio className="h-3 w-3 animate-pulse" /> [ STATE INTELLIGENCE ACTIVATED ]
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-widest uppercase font-mono text-zinc-100">
          FRAUDSHIELD_AI
        </h1>
        <p className="text-xs font-bold text-primary uppercase tracking-widest font-mono mt-2 mb-6">
          // Proactive Digital Public Safety Infrastructure
        </p>
        
        <p className="text-xs text-zinc-400 max-w-xl mx-auto leading-relaxed font-mono uppercase">
          Autonomous multi-agent scanner detecting syndicate phone networks, WhatsApp extortion, audio threat VAD signals, and phishing vectors.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-[4px] bg-primary text-zinc-950 font-bold text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all font-mono shadow-sm hover:shadow-primary/20"
          >
            Access Citizen Portal
          </Link>
          <button
            onClick={() => {
              localStorage.setItem("user-role", "police");
              window.location.href = "/police";
            }}
            className="px-6 py-3 rounded-[4px] bg-background border border-border text-zinc-200 font-bold text-xs uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all flex items-center gap-2 font-mono"
          >
            <Eye className="h-4 w-4" /> Enter Police Console
          </button>
        </div>
      </div>

      {/* Feature Section */}
      <div>
        <div className="text-left border-l-2 border-primary pl-4 mb-8">
          <h2 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest font-mono">System Directory</h2>
          <p className="text-lg font-bold text-zinc-100 uppercase tracking-wider font-mono">Active Defense Modules</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-[4px] relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="absolute top-0 right-0 p-2 font-mono text-[9px] text-zinc-600 font-bold uppercase select-none">
              [ MOD_01 ]
            </div>
            <div className="h-10 w-10 border border-primary/20 bg-primary/5 flex items-center justify-center mb-4 rounded-[4px]">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono mb-2">Citizen Shield</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-mono uppercase">
              Immediate heuristic and LLM scanning of suspicious SMS texts, extortion logs, and domain links.
            </p>
          </div>

          <div className="glass-card p-6 rounded-[4px] relative overflow-hidden group hover:border-accent/40 transition-all">
            <div className="absolute top-0 right-0 p-2 font-mono text-[9px] text-zinc-600 font-bold uppercase select-none">
              [ MOD_02 ]
            </div>
            <div className="h-10 w-10 border border-accent/20 bg-accent/5 flex items-center justify-center mb-4 rounded-[4px]">
              <PhoneCall className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono mb-2">Audio Scanner</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-mono uppercase">
              Silero Voice Activity Detection filtering static, transcribed with Whisper to target arrest threats.
            </p>
          </div>

          <div className="glass-card p-6 rounded-[4px] relative overflow-hidden group hover:border-accent/40 transition-all">
            <div className="absolute top-0 right-0 p-2 font-mono text-[9px] text-zinc-600 font-bold uppercase select-none">
              [ MOD_03 ]
            </div>
            <div className="h-10 w-10 border border-accent/20 bg-accent/5 flex items-center justify-center mb-4 rounded-[4px]">
              <AlertOctagon className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono mb-2">OCR Extract</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-mono uppercase">
              Chat, bank transaction logs, and video call screenshot extraction powered by PaddleOCR.
            </p>
          </div>

          <div className="glass-card p-6 rounded-[4px] relative overflow-hidden group hover:border-primary/40 transition-all">
            <div className="absolute top-0 right-0 p-2 font-mono text-[9px] text-zinc-600 font-bold uppercase select-none">
              [ MOD_04 ]
            </div>
            <div className="h-10 w-10 border border-primary/20 bg-primary/5 flex items-center justify-center mb-4 rounded-[4px]">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono mb-2">Network intel</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-mono uppercase">
              Neo4j-powered syndicate mapping connecting suspect identifiers, phone nodes, and UPI vectors.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics / Metrics Banner */}
      <div className="border border-border bg-card/40 p-8 rounded-[4px] relative overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center font-mono">
          <div className="border-r border-border/60 last:border-none sm:pr-4">
            <p className="text-3xl font-extrabold text-primary tracking-tight">100%</p>
            <p className="mt-2 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Structured JSON Output</p>
          </div>
          <div className="border-r border-border/60 last:border-none sm:px-4">
            <p className="text-3xl font-extrabold text-accent tracking-tight">&lt; 3.0s</p>
            <p className="mt-2 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Real-time analysis latency</p>
          </div>
          <div className="sm:pl-4">
            <p className="text-3xl font-extrabold text-primary tracking-tight">NEO4J</p>
            <p className="mt-2 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Syndicate Hotspot Clustering</p>
          </div>
        </div>
      </div>
    </div>
  );
}
