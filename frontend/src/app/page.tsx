"use client";

import Link from "next/link";
import { Shield, Play, Terminal, Layers, Search, Server } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-32 max-w-[1000px] mx-auto text-center space-y-16">
      
      {/* Top Badge */}
      <div className="inline-flex items-center gap-4 px-4 py-1.5 bg-[#050505] border border-border rounded-sm">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
            TRUSTED BY LAW ENFORCEMENT
          </span>
        </div>
        <div className="h-3 w-px bg-border" />
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-mono">
          99.9% UPTIME
        </span>
      </div>

      {/* Hero Headline */}
      <div className="space-y-6">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          Ultimate Public Safety<br />
          <span className="text-gradient-primary">AI Infrastructure</span>
        </h1>
        
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-mono leading-relaxed">
          Extract clean analysis, structured JSON, and threat metrics from any URL, image, or text. The fastest <span className="text-white border-b border-white">fraud detection API</span> for preventing digital arrest networks and syndicates.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap justify-center gap-6 mt-8">
        <Link
          href="/checker"
          className="px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors flex items-center gap-3 font-mono"
        >
          <Play className="h-3 w-3" fill="currentColor" /> START SCANNING FREE
        </Link>
        <button
          onClick={() => {
            localStorage.setItem("user-role", "police");
            window.location.href = "/police";
          }}
          className="px-8 py-3 bg-black border border-border text-zinc-300 font-bold text-xs uppercase tracking-[0.2em] hover:text-white hover:border-zinc-700 transition-colors font-mono"
        >
          SEE HOW IT WORKS
        </button>
      </div>

      {/* Metrics */}
      <div className="flex justify-center gap-16 pt-12 pb-16 w-full border-b border-border/50">
        <div className="text-center">
          <p className="text-3xl font-bold text-white mb-1">99.9%</p>
          <p className="text-[10px] text-zinc-500 font-mono tracking-[0.2em]">UPTIME SLA</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-white mb-1">&lt;2s</p>
          <p className="text-[10px] text-zinc-500 font-mono tracking-[0.2em]">AVG RESPONSE</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-white mb-1">1M+</p>
          <p className="text-[10px] text-zinc-500 font-mono tracking-[0.2em]">SCANS PROCESSED</p>
        </div>
      </div>

      {/* Video / Terminal Demo Area */}
      <div className="w-full max-w-4xl mx-auto mt-16 text-left">
        <div className="glass-card overflow-hidden">
          <div className="flex items-center px-4 py-3 border-b border-border bg-[#030303]">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-primary/80" />
            </div>
            <div className="mx-auto text-[10px] font-mono text-zinc-500">fraudshield-cli</div>
          </div>
          <div className="p-8 bg-[#050505] font-mono text-xs sm:text-sm leading-relaxed text-zinc-300">
            <div className="text-primary mb-4">$ fraudshield analyze screenshot.png</div>
            <div className="text-zinc-500 mb-1">→ Initializing Vision Model...</div>
            <div className="text-zinc-500 mb-1">→ Extracting OCR context...</div>
            <div className="text-zinc-500 mb-4">→ Analyzing threat vectors...</div>
            <div className="text-primary mb-4">✓ Analysis complete in 1.2s</div>
            <pre className="text-emerald-300">
{`{
  "category": "Likely Fraud",
  "risk_score": 92.5,
  "confidence": 0.95,
  "indicators": ["pan card", "sbi", "urgent request"],
  "recommendation": "Block immediately."
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* Hate Section Header */}
      <div className="pt-32 text-center">
        <p className="text-[10px] text-zinc-500 font-mono mb-4">// the problem</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Why Citizens <span className="text-red-500">Hate</span> Fraud Reporting
        </h2>
      </div>

      {/* Problem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left pt-12">
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <span className="text-xs font-bold font-mono">!</span>
            </div>
            <h3 className="text-sm font-bold text-white font-mono uppercase">ENDLESS SETUP TIME</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-mono">
            Days wasted trying to file FIRs, gathering evidence, and finding the right jurisdiction.
          </p>
        </div>
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <span className="text-xs font-bold font-mono">$</span>
            </div>
            <h3 className="text-sm font-bold text-white font-mono uppercase">FINANCIAL LOSS</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-mono">
            Victims lose life savings while waiting for manual analysis of digital arrest threats and phishing links.
          </p>
        </div>
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <span className="text-xs font-bold font-mono">×</span>
            </div>
            <h3 className="text-sm font-bold text-white font-mono uppercase">CONSTANT BREAKAGE</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-mono">
            Scammers constantly change their tactics, using WhatsApp, Telegram, and deepfakes to evade old static rules.
          </p>
        </div>
      </div>

      {/* Solution Section Header */}
      <div className="pt-32 text-center">
        <p className="text-[10px] text-zinc-500 font-mono mb-4">// the solution</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          AI-Powered <span className="border-b border-white">Defense Infrastructure</span>
        </h2>
        <p className="text-xs text-zinc-500 font-mono mt-6">
          Everything you need to extract and analyze threats. Built for <span className="text-zinc-300 border-b border-zinc-700">modern public safety</span>.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left pt-12 pb-32">
        <div className="glass-card p-8 group hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-widest">MULTI-MODAL EXTRACTION</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-mono">
            Extract text, visual elements, and metadata from screenshots and audio. Perfect for AI analysis.
          </p>
        </div>
        <div className="glass-card p-8 group hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Layers className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-widest">GRAPH CLUSTERING</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-mono">
            Automatically map out syndicates using Neo4j graph databases to connect phones, UPI IDs, and IPs.
          </p>
        </div>
        <div className="glass-card p-8 group hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Search className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-widest">SEARCH & ANALYZE</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-mono">
            Search internal RAG databases to explain fraud patterns and match them against known historical cases.
          </p>
        </div>
        <div className="glass-card p-8 group hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Server className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-widest">STRUCTURED JSON OUTPUT</h3>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed font-mono">
            Get clean, typed responses with risk scores, categories, indicators, and exact threat recommendations.
          </p>
        </div>
      </div>

    </div>
  );
}
