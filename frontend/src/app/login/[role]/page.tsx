"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Fingerprint, Loader2, Lock, Mail, Shield, Users } from "lucide-react";

type Role = "citizen" | "police";

const ROLE_UI = {
  citizen: {
    icon: Users,
    title: "CITIZEN_LOGIN",
    subtitle: "Public Access Node",
    accent: "primary",
    backHover: "hover:text-primary",
    destination: "/dashboard",
    fieldLabel: "Email Address",
    fieldPlaceholder: "citizen@example.com",
    fieldType: "email",
    fieldIcon: Mail,
    buttonText: "AUTHENTICATE",
  },
  police: {
    icon: Shield,
    title: "LE_SECURE_LOGIN",
    subtitle: "Law Enforcement Intelligence Node\nLevel 4 Clearance Required",
    accent: "accent",
    backHover: "hover:text-accent",
    destination: "/police",
    fieldLabel: "Badge ID / Operator Number",
    fieldPlaceholder: "OP-9942",
    fieldType: "text",
    fieldIcon: Fingerprint,
    buttonText: "ESTABLISH SECURE CONNECTION",
  },
} as const;

function isRole(value: string): value is Role {
  return value === "citizen" || value === "police";
}

export default function RoleLoginPage({ params }: { params: { role: string } }) {
  const [loading, setLoading] = useState(false);
  const role: Role = isRole(params.role) ? params.role : "citizen";
  const ui = useMemo(() => ROLE_UI[role], [role]);
  const AccentIcon = ui.icon;
  const FieldIcon = ui.fieldIcon;
  const accentText = ui.accent === "primary" ? "text-primary" : "text-accent";
  const accentBg = ui.accent === "primary" ? "bg-primary" : "bg-accent";
  const accentBorder = ui.accent === "primary" ? "border-primary/40" : "border-accent/60";
  const focusBorder = ui.accent === "primary" ? "focus:border-primary" : "focus:border-accent";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("user-role", role);
      window.location.href = ui.destination;
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12">
      <Link
        href="/login"
        className={`mb-8 text-[10px] font-mono text-zinc-500 ${ui.backHover} transition-colors uppercase tracking-widest flex items-center gap-2`}
      >
        <ArrowRight className="h-3 w-3 rotate-180" /> Back to Portals
      </Link>

      <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${accentBorder} rounded-tl-xl m-4`} />
        <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${accentBorder} rounded-br-xl m-4`} />

        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-zinc-900/80 border border-border flex items-center justify-center mb-4">
            <AccentIcon className={`h-8 w-8 ${accentText}`} />
          </div>
          <h1 className="text-2xl font-bold text-white font-mono tracking-widest">{ui.title}</h1>
          <p className="text-[10px] font-mono text-zinc-500 mt-2 uppercase tracking-[0.2em] text-center whitespace-pre-line">
            {ui.subtitle}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{ui.fieldLabel}</label>
            <div className="relative">
              <FieldIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type={ui.fieldType}
                required
                className={`w-full bg-[#000000] border border-border rounded-lg py-3 pl-12 pr-4 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none ${focusBorder} transition-colors`}
                placeholder={ui.fieldPlaceholder}
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
                className={`w-full bg-[#000000] border border-border rounded-lg py-3 pl-12 pr-4 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none ${focusBorder} transition-colors`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 ${accentBg} text-black font-bold font-mono text-xs uppercase tracking-[0.2em] rounded-lg transition-colors flex items-center justify-center gap-2 mt-4`}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : ui.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
