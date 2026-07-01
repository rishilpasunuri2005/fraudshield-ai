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
  AlertTriangle 
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
    { name: "Scam Text/URL Checker", desc: "Scan suspicious text messages or link URLs", href: "/checker", icon: Search, color: "emerald" },
    { name: "Screenshot Analyzer", desc: "OCR scan threat chats and bank messages", href: "/screenshot", icon: ImageIcon, color: "indigo" },
    { name: "Voice Scam Detector", desc: "Transcribe extortive voice notes or calls", href: "/audio", icon: Mic, color: "pink" },
    { name: "Report Fraud Case", desc: "File suspect UPIs and phones to cyber cells", href: "/report", icon: FileText, color: "teal" }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Alert Banner */}
      <div className="glass-red p-4 rounded-xl flex gap-3 items-start">
        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-red-400">Extortion Alert: WhatsApp Extortion Calls</h4>
          <p className="text-xs text-zinc-400 mt-1">
            Criminals are masquerading as CBI, Custom officials, or police requesting Aadhaar links under threat of digital arrest. Real police will never demand payments or keep you under digital arrest over WhatsApp or Skype video calls.
          </p>
        </div>
      </div>

      {/* Grid of Tools */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100 mb-4 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-emerald-500" /> Shield Diagnostics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link 
                key={t.name} 
                href={t.href}
                className="glass-card p-6 rounded-xl hover:border-zinc-700/80 transition-all flex items-center justify-between group"
              >
                <div className="flex gap-4 items-center">
                  <div className={`h-11 w-11 rounded-lg flex items-center justify-center border bg-zinc-900/80 border-zinc-800`}>
                    <Icon className="h-5 w-5 text-zinc-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">{t.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{t.desc}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-850 bg-zinc-900/30 flex justify-between items-center">
          <h3 className="text-sm font-bold text-zinc-200">Your Filed Reports</h3>
          <Link href="/report" className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold">
            File New Report <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-500">Loading your complaints list...</div>
        ) : reports.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">No complaints filed yet. Your reports will appear here.</div>
        ) : (
          <div className="divide-y divide-zinc-850">
            {reports.map((r) => (
              <div key={r.id} className="px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:bg-zinc-900/20 transition-all">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-100">{r.title}</h4>
                  <p className="text-xs text-zinc-400 truncate max-w-md mt-1">{r.description}</p>
                </div>
                
                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                  <div className="flex items-center gap-1.5">
                    {r.status === "resolved" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold uppercase tracking-wider">
                        <CheckCircle className="h-3 w-3" /> Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 font-semibold uppercase tracking-wider">
                        <Clock className="h-3 w-3" /> {r.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <span className={`text-xs font-bold ${r.risk_score > 75 ? "text-red-400" : "text-zinc-300"}`}>
                      Risk Score: {r.risk_score.toFixed(0)}
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
