"use client";

import Link from "next/link";
import { Shield, Play, Terminal, Layers, Search, Server, Activity, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-24 pb-32 w-full mx-auto text-center space-y-24">
      
      {/* Hero Headline */}
      <div className="space-y-8 max-w-[1000px] px-6">
        <div className="inline-flex items-center gap-4 px-5 py-2 bg-accent/10 border border-accent/20 rounded-full shadow-[0_0_20px_rgba(0,102,255,0.2)]">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(0,102,255,0.8)]" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest font-mono">
              SECURE INFRASTRUCTURE
            </span>
          </div>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white leading-[1.1]">
          Next-Gen AI for<br />
          <span className="text-gradient-accent">Cyber Defense</span>
        </h1>
        
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-mono leading-relaxed">
          Extract, analyze, and neutralize digital threats in real-time. The ultimate <span className="text-white border-b border-white">intelligence platform</span> built for modern law enforcement and proactive citizen defense.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-6 pt-4">
          <Link
            href="/login"
            className="px-8 py-4 bg-accent text-white font-bold text-xs uppercase tracking-[0.2em] rounded-lg shadow-[0_0_30px_rgba(0,102,255,0.3)] hover:bg-accent/90 hover:shadow-[0_0_40px_rgba(0,102,255,0.5)] transition-all font-mono"
          >
            ACCESS PORTALS
          </Link>
          <Link
            href="/checker"
            className="px-8 py-4 bg-[#050505] border border-border text-zinc-300 font-bold text-xs uppercase tracking-[0.2em] rounded-lg hover:text-white hover:border-zinc-700 transition-colors font-mono"
          >
            RUN PUBLIC SCAN
          </Link>
        </div>
      </div>

      {/* Metrics Bento Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-6">
        <div className="glass-panel p-8 text-center flex flex-col items-center justify-center">
          <Activity className="h-6 w-6 text-accent mb-4" />
          <p className="text-4xl font-bold text-white mb-2 font-mono">99.9%</p>
          <p className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase">Uptime SLA</p>
        </div>
        <div className="glass-panel p-8 text-center flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
          <Terminal className="h-6 w-6 text-primary mb-4 relative z-10" />
          <p className="text-4xl font-bold text-white mb-2 font-mono relative z-10">&lt;1.2s</p>
          <p className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase relative z-10">Threat Extraction</p>
        </div>
        <div className="glass-panel p-8 text-center flex flex-col items-center justify-center">
          <Shield className="h-6 w-6 text-accent mb-4" />
          <p className="text-4xl font-bold text-white mb-2 font-mono">1.2M+</p>
          <p className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase">Scans Processed</p>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="w-full max-w-6xl px-6 text-left">
        <div className="pt-16 pb-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Comprehensive <span className="text-primary">Intelligence</span> Network
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {/* Large Hero Card - Spans 2 cols, 2 rows */}
          <div className="glass-panel md:col-span-2 md:row-span-2 p-10 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -mr-10 -mt-10 transition-all group-hover:bg-accent/20" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Search className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-white font-mono uppercase tracking-widest">ASK AI / RAG Oracle</h3>
            </div>
            
            <p className="text-sm text-zinc-400 leading-relaxed font-mono relative z-10 max-w-md">
              Query our massive knowledge base of historical threats, cybercrime patterns, and legal policies using natural language. The system instantly retrieves contextual evidence to aid investigations.
            </p>

            <div className="mt-auto bg-[#000000] border border-border rounded-lg p-5 font-mono text-xs leading-relaxed text-zinc-300 relative z-10">
              <div className="text-accent mb-2">$ query_database --target="Digital Arrest"</div>
              <div className="text-primary">✓ Retrieved 14 matched cases from Mumbai jurisdiction. Confidence: 94%.</div>
            </div>
          </div>

          {/* Small Top Right Card */}
          <div className="glass-panel p-8 flex flex-col justify-between group hover:border-primary/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Terminal className="h-6 w-6 text-primary" />
                <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase">Active</span>
              </div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest mb-2">JSON Extraction</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                Clean, typed responses with risk scores and indicators.
              </p>
            </div>
          </div>

          {/* Small Bottom Right Card */}
          <div className="glass-panel p-8 flex flex-col justify-between group hover:border-accent/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Layers className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-widest mb-2">Graph Clustering</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-mono">
                Map syndicates automatically using Neo4j graph databases.
              </p>
            </div>
          </div>

          {/* Bottom Wide Card - Spans 3 cols */}
          <div className="glass-panel md:col-span-3 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
            
            <div className="flex-1 space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-bold text-white font-mono uppercase tracking-widest">Endless Setup & Breakage</h3>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed font-mono max-w-2xl">
                Legacy systems fail because scammers constantly change tactics using deepfakes and burner VoIPs. Defensys AI eliminates setup time and adapts in real-time.
              </p>
            </div>

            <Link href="/checker" className="px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] rounded-lg hover:bg-zinc-200 transition-colors font-mono whitespace-nowrap relative z-10">
              TRY THE SCANNER
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
