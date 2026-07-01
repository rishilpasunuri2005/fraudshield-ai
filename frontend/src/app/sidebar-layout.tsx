"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, 
  LayoutDashboard, 
  Search, 
  Image, 
  Mic, 
  FileText, 
  BarChart2, 
  UserCheck, 
  Settings, 
  Home, 
  Menu, 
  X, 
  Eye,
  AlertTriangle
} from "lucide-react";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<"citizen" | "police">("citizen");

  // Load role selection from localStorage if available
  useEffect(() => {
    const savedRole = localStorage.getItem("user-role");
    if (savedRole === "police" || savedRole === "citizen") {
      setRole(savedRole);
    }
  }, []);

  const handleRoleChange = (newRole: "citizen" | "police") => {
    setRole(newRole);
    localStorage.setItem("user-role", newRole);
    // Redirect to dashboard matching role for convenience
    if (newRole === "police") {
      window.location.href = "/police";
    } else {
      window.location.href = "/dashboard";
    }
  };

  const navItems = [
    { name: "Landing", href: "/", icon: Home, roles: ["citizen", "police"] },
    { name: "Citizen Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["citizen"] },
    { name: "Fraud Checker", href: "/checker", icon: Search, roles: ["citizen"] },
    { name: "Upload Screenshot", href: "/screenshot", icon: Image, roles: ["citizen"] },
    { name: "Upload Audio", href: "/audio", icon: Mic, roles: ["citizen"] },
    { name: "Report Scam", href: "/report", icon: FileText, roles: ["citizen"] },
    
    // Police Portal
    { name: "Police Dashboard", href: "/police", icon: Eye, roles: ["police"] },
    { name: "Analytics & Trends", href: "/analytics", icon: BarChart2, roles: ["police"] },
    
    // Admin
    { name: "Admin Panel", href: "/admin", icon: Settings, roles: ["citizen", "police"] },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 glass border-r border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-zinc-800/80">
          <Shield className="h-7 w-7 text-emerald-500 animate-pulse" />
          <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            FRAUDSHIELD AI
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="text-zinc-500 text-xs font-semibold px-3 mb-2 tracking-widest uppercase">
            {role === "citizen" ? "Citizen Portal" : "Police Operations"}
          </div>
          
          {navItems
            .filter((item) => item.roles.includes(role))
            .map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-md shadow-emerald-500/5" 
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-emerald-400" : "text-zinc-400"}`} />
                  {item.name}
                </Link>
              );
            })}
        </nav>

        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Simulation Role:</span>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value as "citizen" | "police")}
              className="text-xs font-semibold bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-emerald-400 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="citizen">Citizen</option>
              <option value="police">Police Officer</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-64 max-w-xs h-full bg-zinc-900 border-r border-zinc-800 p-4 z-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-emerald-500" />
                <span className="font-bold text-md text-emerald-400">FraudShield AI</span>
              </div>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-6 w-6 text-zinc-400" />
              </button>
            </div>
            
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navItems
                .filter((item) => item.roles.includes(role))
                .map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        active 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
            </nav>

            <div className="pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Role:</span>
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value as "citizen" | "police")}
                  className="text-xs bg-zinc-900 border border-zinc-850 rounded px-2 py-1 text-emerald-400 focus:outline-none"
                >
                  <option value="citizen">Citizen</option>
                  <option value="police">Police Officer</option>
                </select>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between md:justify-end px-6 h-16 glass border-b border-zinc-800/80 shrink-0">
          <button className="md:hidden p-1 text-zinc-400 hover:text-zinc-100" onClick={() => setMobileOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-850 rounded-full px-3.5 py-1.5 text-xs text-zinc-300">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Safety Server Connected</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-zinc-100">
                  {role === "citizen" ? "Rahul Verma" : "Inspector A. Sharma"}
                </p>
                <p className="text-xs text-zinc-400 font-medium">
                  {role === "citizen" ? "Citizen User" : "Mumbai Cyber Cell (Admin)"}
                </p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center font-bold text-zinc-950 shadow-md">
                {role === "citizen" ? "RV" : "AS"}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content Body */}
        <main className="flex-grow overflow-y-auto bg-zinc-950/20 p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
