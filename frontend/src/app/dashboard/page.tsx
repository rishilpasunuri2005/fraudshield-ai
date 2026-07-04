"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  ArrowRight, 
  Search, 
  Image as ImageIcon, 
  Mic, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TerminalSquare
} from "lucide-react";
import { API_URL } from "../../lib/api";

interface Report {
  id: number;
  title: string;
  description: string;
  status: string;
  risk_score: number;
  created_at: string;
}

export default function CitizenDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch(`${API_URL}/report`);
        if (response.ok) {
          const data = await response.json();
          setReports(data.slice(0, 5)); // show top 5 recent reports
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const tools = [
    { name: "Scam Text/URL Checker", desc: "Scan suspicious text messages or link URLs", href: "/checker", icon: Search },
    { name: "Screenshot Analyzer", desc: "OCR scan threat chats and bank messages", href: "/screenshot", icon: ImageIcon },
    { name: "Voice Scam Detector", desc: "Transcribe extortive voice notes or calls", href: "/audio", icon: Mic },
    { name: "Report Fraud Case", desc: "File suspect UPIs and phones to cyber cells", href: "/report", icon: FileText }
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pt-8 pb-32">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase">// CITIZEN_ACCESS_NODE</p>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-2">Public Defense <span className="text-primary">Dashboard</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 border border-border bg-[#050505] rounded-sm text-center">
            <span className="block text-[9px] font-mono text-zinc-500 tracking-widest uppercase">Network Status</span>
            <span className="block text-xs font-mono font-bold text-primary flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.8)]"/> SECURE
            </span>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-[#000000] border-l-4 border-red-500 p-6 rounded-sm shadow-[0_0_20px_rgba(255,51,51,0.1)] flex gap-4 items-start relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 relative z-10" />
        <div className="relative z-10">
          <h4 className="text-sm font-bold font-mono tracking-widest text-red-500 uppercase">Alert // Digital Arrest Syndicates</h4>
          <p className="text-xs font-mono text-zinc-400 mt-2 leading-relaxed max-w-4xl">
            Criminals are masquerading as CBI, Customs, or Police requesting Aadhaar links under threat of digital arrest. Law enforcement will <span className="text-white border-b border-white">never</span> demand payments or keep you under digital arrest over WhatsApp or Skype video calls.
          </p>
        </div>
      </div>

      {/* Grid of Tools - Bento Style */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-bold font-mono tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-2">
          <TerminalSquare className="h-4 w-4 text-accent" /> Available Extraction Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link 
                key={t.name} 
                href={t.href}
                className="glass-panel p-6 flex flex-col justify-between group hover:border-accent/50 hover:shadow-[0_0_25px_rgba(0,102,255,0.15)] transition-all duration-300 min-h-[180px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-sm font-bold font-mono tracking-widest text-zinc-100 uppercase group-hover:text-white transition-colors">{t.name}</h4>
                </div>
                <p className="text-[10px] font-mono text-zinc-500 mt-4 leading-relaxed">{t.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="glass-panel rounded-lg overflow-hidden mt-8">
        <div className="px-8 py-5 border-b border-border bg-[#030303] flex justify-between items-center">
          <h3 className="text-xs font-bold font-mono tracking-[0.2em] text-zinc-400 uppercase">Intelligence Reports Submitted</h3>
          <Link href="/report" className="text-[10px] font-bold font-mono text-primary hover:text-white flex items-center gap-2 uppercase tracking-widest bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-sm transition-colors">
            File New Report <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-[10px] font-mono tracking-widest uppercase text-zinc-500">Querying database...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-[10px] font-mono tracking-widest uppercase text-zinc-500 border-dashed border-2 border-border m-8">No intelligence reports filed yet.</div>
        ) : (
          <div className="divide-y divide-border">
            {reports.map((r) => (
              <div key={r.id} className="px-8 py-6 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-[#000000] transition-all group">
                <div className="flex-1">
                  <h4 className="text-sm font-bold font-mono tracking-wider text-white mb-2">{r.title}</h4>
                  <p className="text-[10px] font-mono text-zinc-500 truncate max-w-2xl leading-relaxed">{r.description}</p>
                </div>
                
                <div className="flex items-center gap-6 shrink-0 md:justify-end">
                  <div className="flex items-center">
                    {r.status === "resolved" ? (
                      <span className="inline-flex items-center gap-1.5 text-[9px] bg-primary/10 text-primary px-2.5 py-1 rounded-sm border border-primary/20 font-bold uppercase tracking-widest">
                        <CheckCircle className="h-3 w-3" /> Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[9px] bg-yellow-500/10 text-yellow-500 px-2.5 py-1 rounded-sm border border-yellow-500/20 font-bold uppercase tracking-widest">
                        <Clock className="h-3 w-3" /> {r.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="w-px h-8 bg-border hidden md:block" />
                  
                  <div className="text-right min-w-[120px]">
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Risk Score</span>
                    <span className={`text-lg font-bold font-mono ${r.risk_score > 75 ? "text-red-500" : "text-zinc-300"}`}>
                      {r.risk_score.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
