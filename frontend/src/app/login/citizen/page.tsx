"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function CitizenLogin() {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login then redirect
    setTimeout(() => {
      localStorage.setItem("user-role", "citizen");
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
      <Link href="/login" className="mb-8 text-[10px] font-mono text-zinc-500 hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
        <ArrowRight className="h-3 w-3 rotate-180" /> Back to Portals
      </Link>
      
      <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-xl m-4" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-xl m-4" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white font-mono tracking-widest">CITIZEN_LOGIN</h1>
          <p className="text-[10px] font-mono text-zinc-500 mt-2 uppercase tracking-[0.2em]">Public Access Node</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input 
                type="email" 
                required
                className="w-full bg-[#000000] border border-border rounded-lg py-3 pl-12 pr-4 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors"
                placeholder="citizen@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input 
                type="password" 
                required
                className="w-full bg-[#000000] border border-border rounded-lg py-3 pl-12 pr-4 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-black font-bold font-mono text-xs uppercase tracking-[0.2em] rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "AUTHENTICATE"}
          </button>
        </form>
      </div>
    </div>
  );
}
