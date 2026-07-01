"use client";

import React, { useState, useEffect } from "react";
import GraphVisualizer from "../../components/graph-visualizer";
import { ShieldAlert, Users, TrendingUp, AlertOctagon, CheckCircle, MapPin, Eye, Loader2 } from "lucide-react";

interface Stats {
  total_cases: number;
  pending_cases: number;
  investigating_cases: number;
  resolved_cases: number;
  total_amount_lost: number;
  scam_type_counts: any;
  district_counts: any;
}

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: string;
  risk_score: number;
  suspect_phone: string;
  suspect_upi: string;
  created_at: string;
}

export default function PoliceConsole() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch Stats
        const statsRes = await fetch("http://localhost:8000/dashboard");
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch Network Graph
        const graphRes = await fetch("http://localhost:8000/fraud-network");
        const graphData = await graphRes.json();
        setGraphData(graphData);

        // Fetch Recent Reports
        const reportsRes = await fetch("http://localhost:8000/report");
        const reportsData = await reportsRes.json();
        setComplaints(reportsData);
      } catch (err) {
        setError("Failed to fetch police intelligence feeds from the backend.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        <span className="text-sm text-zinc-500 font-semibold uppercase tracking-widest">Loading Police Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-100 tracking-tight">Police Intelligence Dashboard</h2>
          <p className="text-zinc-400 text-sm">
            Investigate digital extortion operations and trace fraud network connections.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 uppercase">
          Mumbai Cyber Cell Console
        </div>
      </div>

      {/* Stats Cards Row */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-xl border border-zinc-850">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Complaints</span>
            <p className="text-2xl font-extrabold text-zinc-100 mt-1">{stats.total_cases}</p>
          </div>
          <div className="glass-card p-5 rounded-xl border border-zinc-850">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Investigating</span>
            <p className="text-2xl font-extrabold text-amber-400 mt-1">{stats.investigating_cases + stats.pending_cases}</p>
          </div>
          <div className="glass-card p-5 rounded-xl border border-zinc-850">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Resolved</span>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">{stats.resolved_cases}</p>
          </div>
          <div className="glass-card p-5 rounded-xl border border-zinc-850">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Extorted Capital</span>
            <p className="text-2xl font-extrabold text-red-400 mt-1">₹{stats.total_amount_lost.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Graph and Network Tracing */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
          <Users className="h-4.5 w-4.5 text-emerald-500" /> Syndicate Network Visualizer
        </h3>
        {graphData && <GraphVisualizer data={graphData.graph} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Syndicate Clusters (1 Col) */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
            <AlertOctagon className="h-4.5 w-4.5 text-red-500" /> Active Fraud Clusters
          </h3>
          <div className="flex flex-col gap-3">
            {graphData && graphData.clusters && graphData.clusters.map((cluster: any) => (
              <div key={cluster.cluster_id} className="glass-red p-4 rounded-xl border border-red-500/20 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{cluster.cluster_id}</span>
                  <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                    Severity: HIGH
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">{cluster.description}</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Detected {cluster.suspect_nodes.length} distinct scam lines running on the same device.
                  </p>
                </div>
                <div className="text-[10px] text-zinc-400 space-y-1">
                  <p><strong>Flagged lines:</strong> {cluster.suspect_nodes.join(", ")}</p>
                  <p><strong>Primary Hardware:</strong> {cluster.primary_indicators.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Complaints Feed Table (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="h-4.5 w-4.5 text-indigo-500" /> Live Complaints Feed
          </h3>
          <div className="glass-card rounded-xl border border-zinc-850 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-900/50 border-b border-zinc-850 text-zinc-500 uppercase tracking-wider font-bold">
                    <th className="p-3">Title</th>
                    <th className="p-3">Suspect Number</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850 text-zinc-300">
                  {complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-900/10 transition-all">
                      <td className="p-3">
                        <p className="font-semibold text-zinc-200">{c.title}</p>
                        <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{c.description}</p>
                      </td>
                      <td className="p-3 font-mono text-[10px]">{c.suspect_phone || c.suspect_upi || "N/A"}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${
                          c.status === "resolved" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className={`p-3 text-center font-bold ${c.risk_score > 75 ? "text-red-400" : "text-zinc-400"}`}>
                        {c.risk_score.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
