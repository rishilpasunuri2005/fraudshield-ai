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
  TrendingUp,
  Activity,
  Network
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { getDashboardStats } from "@/services/api";
import { DashboardStats } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats() as DashboardStats;
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const tools = [
    { name: "Scam Text Checker", desc: "Detect urgency and coercion in messages", href: "/analyze/text", icon: FileText, color: "emerald" },
    { name: "Screenshot Analyzer", desc: "OCR scan threat chats and fake UIs", href: "/analyze/screenshot", icon: ImageIcon, color: "indigo" },
    { name: "Voice Scam Detector", desc: "Identify deepfakes and extortive calls", href: "/analyze/audio", icon: Mic, color: "pink" },
    { name: "URL Scanner", desc: "Check links for phishing and malware", href: "/analyze/url", icon: Search, color: "teal" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 mt-8 w-full">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Threat Dashboard</h1>
           <p className="text-muted-foreground mt-1">Real-time overview of your security landscape.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
           <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             SYSTEM {stats?.systemStatus || 'ONLINE'}
           </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Analyzed"
          value={loading ? "..." : stats?.totalAnalyzed.toLocaleString() || "0"}
          icon={Activity}
          trend={{ value: 12, isPositive: true }}
          description="vs last week"
        />
        <StatCard
          title="Threats Prevented"
          value={loading ? "..." : stats?.threatsPrevented.toLocaleString() || "0"}
          icon={ShieldAlert}
          trend={{ value: 8, isPositive: true }}
          description="vs last week"
        />
        <StatCard
          title="Active Networks"
          value={loading ? "..." : stats?.activeNetworks || "0"}
          icon={Network}
        />
        <StatCard
          title="Avg. Response"
          value="1.2s"
          icon={Clock}
          trend={{ value: 5, isPositive: false }}
          description="speed improvement"
        />
      </div>

      {/* Alert Banner */}
      <div className="glass-red p-4 rounded-xl flex gap-3 items-start border border-red-500/20 mt-8">
        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-red-400">Critical Threat Alert: "Digital Arrest" Campaign</h4>
          <p className="text-xs text-zinc-400 mt-1">
            We are tracking a 400% spike in automated calls claiming to be from FedEx/Customs leading to Skype "interrogations". All law enforcement agencies are advised to update their filtering rules.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4">
        <h2 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2 uppercase tracking-wider text-xs font-mono">
          // Analysis Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link 
                key={t.name} 
                href={t.href}
                className="glass-card p-6 rounded-xl hover:border-primary/50 transition-all flex flex-col group h-full"
              >
                <div className="h-10 w-10 rounded-lg flex items-center justify-center border bg-zinc-900/80 border-zinc-800 mb-4 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                  <Icon className="h-5 w-5 text-zinc-300 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100 group-hover:text-primary transition-colors">{t.name}</h4>
                  <p className="text-xs text-zinc-500 mt-1">{t.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
