"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Calendar, Smartphone, Phone, Loader2 } from "lucide-react";
import { API_URL } from "../../lib/api";

interface AnalyticsData {
  heatmap: Array<{ name: string; lat: number; lng: number; value: number }>;
  flagged_phones: Array<{ identifier: string; risk_level: string; reports: number }>;
  flagged_devices: Array<{ identifier: string; model: string; reports: number }>;
  trends: Array<{ month: string; complaints: number }>;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`${API_URL}/analytics`);
        if (response.ok) {
          const resData = await response.json();
          setData(resData);
        } else {
          setError("Failed to fetch analytical datasets.");
        }
      } catch (err) {
        setError("Unable to connect to the backend server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
        <span className="text-sm text-zinc-500 font-semibold uppercase tracking-widest">Loading Analytics feeds...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-red p-4 rounded-xl border border-red-500/20 text-xs text-red-400 font-semibold flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" /> {error || "Failed to load data."}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-100 tracking-tight">Cyber Threat Analytics</h2>
        <p className="text-zinc-400 text-sm">
          Spatial, temporal and indicator directories trace extortive operations.
        </p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Temporal Case Trends */}
        <div className="lg:col-span-2 glass-card p-6 rounded-xl border border-zinc-850 bg-zinc-950/20 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="h-4.5 w-4.5 text-emerald-500" /> Complaint Timeline Trends
          </h3>
          
          <div className="space-y-3 pt-4">
            {data.trends.map((item) => {
              const maxComplaints = Math.max(...data.trends.map(t => t.complaints));
              const percent = (item.complaints / maxComplaints) * 100;
              return (
                <div key={item.month} className="flex items-center gap-4 text-xs">
                  <span className="w-8 font-bold text-zinc-400">{item.month}</span>
                  <div className="flex-1 bg-zinc-900 border border-zinc-850 h-5 rounded-md overflow-hidden relative">
                    <div 
                      style={{ width: `${percent}%` }}
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-1000"
                    />
                    <span className="absolute inset-y-0 right-2 flex items-center text-[10px] font-bold text-zinc-400">
                      {item.complaints} complaints
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Spatial Heatmap coordinates */}
        <div className="lg:col-span-1 glass-card p-6 rounded-xl border border-zinc-850 bg-zinc-950/20 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <MapPin className="h-4.5 w-4.5 text-indigo-500" /> Active Jurisdiction Hotspots
          </h3>
          <div className="divide-y divide-zinc-850 max-h-[220px] overflow-y-auto pr-1">
            {data.heatmap.map((loc) => (
              <div key={loc.name} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-zinc-200">{loc.name}</p>
                  <p className="text-[9px] text-zinc-500 font-mono mt-0.5">Lat: {loc.lat.toFixed(4)}, Lng: {loc.lng.toFixed(4)}</p>
                </div>
                <span className="inline-flex bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 font-bold uppercase text-[10px]">
                  {loc.value} cases
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flagged Directories Index Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Flagged Phones */}
        <div className="glass-card p-6 rounded-xl border border-zinc-850 bg-zinc-950/20 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Phone className="h-4.5 w-4.5 text-red-400" /> Suspicious Numbers Directory
          </h3>
          <div className="divide-y divide-zinc-850">
            {data.flagged_phones.map((phone) => (
              <div key={phone.identifier} className="py-3 flex justify-between items-center text-xs">
                <span className="font-mono text-zinc-200 select-all font-semibold">{phone.identifier}</span>
                <div className="flex gap-2 items-center">
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                    phone.risk_level === "critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {phone.risk_level}
                  </span>
                  <span className="text-zinc-500 text-[10px]">{phone.reports} reports</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Devices */}
        <div className="glass-card p-6 rounded-xl border border-zinc-850 bg-zinc-950/20 space-y-4">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Smartphone className="h-4.5 w-4.5 text-purple-400" /> High-Risk Hardware Device Profiles
          </h3>
          <div className="divide-y divide-zinc-850">
            {data.flagged_devices.map((device) => (
              <div key={device.identifier} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-mono text-zinc-200 select-all font-semibold">{device.identifier}</p>
                  <p className="text-[9px] text-zinc-500 mt-0.5">{device.model}</p>
                </div>
                <span className="text-zinc-500 text-[10px]">{device.reports} cases linked</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
