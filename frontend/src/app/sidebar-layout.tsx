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
      <aside className="hidden md:flex md:flex-col md:w-64 bg-card border-r border-border shrink-0">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
          <Shield className="h-5 w-5 text-primary animate-pulse" />
          <span className="font-bold text-base tracking-widest text-zinc-100 font-mono">
            FRAUDSHIELD_AI
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="text-zinc-500 text-[10px] font-bold px-4 mb-3 tracking-widest uppercase font-mono">
            {role === "citizen" ? "[ CITIZEN PORTAL ]" : "[ POLICE PORTAL ]"}
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
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-[4px] text-xs font-semibold tracking-wider uppercase transition-all ${
                    active 
                      ? "bg-primary/5 text-primary border border-primary/20 shadow-sm shadow-primary/5" 
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/40 border border-transparent"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-zinc-400"}`} />
                  {item.name}
                </Link>
              );
            })}
        </nav>

        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Role:</span>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value as "citizen" | "police")}
              className="text-[10px] font-bold uppercase font-mono bg-background border border-border rounded-[4px] px-2.5 py-1 text-primary focus:outline-none focus:border-primary cursor-pointer"
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-64 max-w-xs h-full bg-card border-r border-border p-4 z-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-bold text-sm tracking-wider text-zinc-100 font-mono">FRAUDSHIELD_AI</span>
              </div>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>
            
            <nav className="flex-1 space-y-1.5 overflow-y-auto">
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
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-[4px] text-xs font-semibold tracking-wider uppercase transition-all ${
                        active 
                          ? "bg-primary/5 text-primary border border-primary/20" 
                          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/40 border border-transparent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
            </nav>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-bold uppercase font-mono">Role:</span>
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value as "citizen" | "police")}
                  className="text-[10px] font-bold uppercase font-mono bg-background border border-border rounded-[4px] px-2 py-1 text-primary focus:outline-none"
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
        <header className="flex items-center justify-between md:justify-end px-6 h-16 bg-card border-b border-border shrink-0">
          <button className="md:hidden p-1 text-zinc-400 hover:text-zinc-100" onClick={() => setMobileOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-background border border-border rounded-[4px] px-3.5 py-1.5 text-[9px] text-zinc-300 font-mono uppercase tracking-wider">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span>Safety Server Connected</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-zinc-100 uppercase tracking-wide">
                  {role === "citizen" ? "Rahul Verma" : "Inspector A. Sharma"}
                </p>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono">
                  {role === "citizen" ? "Citizen User" : "Mumbai Cyber Cell"}
                </p>
              </div>
              <div className="h-9 w-9 border border-primary/20 bg-primary/5 text-primary flex items-center justify-center font-mono font-bold text-xs rounded-[4px]">
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
