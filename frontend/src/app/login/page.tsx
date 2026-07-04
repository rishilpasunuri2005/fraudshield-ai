"use client";

import React from "react";
import Link from "next/link";
import { Shield, Users, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Access <span className="text-gradient-accent">Portals</span>
        </h1>
        <p className="text-sm font-mono text-zinc-400 max-w-md mx-auto">
          Select your designated portal to access the Defensys AI network. Unauthorized access is strictly prohibited.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Citizen Portal */}
        <Link href="/login/citizen" className="group">
          <div className="glass-card h-full p-8 flex flex-col items-center text-center space-y-6 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="h-20 w-20 rounded-full bg-zinc-900/80 border border-border flex items-center justify-center group-hover:bg-primary/5 transition-colors">
              <Users className="h-10 w-10 text-zinc-400 group-hover:text-primary transition-colors" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 font-mono tracking-widest">CITIZEN</h2>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                Report incidents, check threat scores, and monitor case status through the public portal.
              </p>
            </div>
            
            <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-bold font-mono text-primary uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
              ENTER PORTAL <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </Link>

        {/* Police Portal */}
        <Link href="/login/police" className="group">
          <div className="glass-card h-full p-8 flex flex-col items-center text-center space-y-6 hover:border-accent/50 hover:shadow-[0_0_30px_rgba(0,102,255,0.15)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="h-20 w-20 rounded-full bg-zinc-900/80 border border-border flex items-center justify-center group-hover:bg-accent/5 transition-colors">
              <Shield className="h-10 w-10 text-zinc-400 group-hover:text-accent transition-colors" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 font-mono tracking-widest">LAW ENFORCEMENT</h2>
              <p className="text-xs font-mono text-zinc-500 leading-relaxed">
                Access advanced analytics, geographical clustering, and cross-jurisdictional intelligence.
              </p>
            </div>
            
            <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-bold font-mono text-accent uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
              SECURE LOGIN <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
