"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X } from "lucide-react";

export default function TopNavLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<"citizen" | "police">("citizen");

  useEffect(() => {
    const savedRole = localStorage.getItem("user-role");
    if (savedRole === "police" || savedRole === "citizen") {
      setRole(savedRole);
    }
  }, []);

  const handleRoleChange = (newRole: "citizen" | "police") => {
    setRole(newRole);
    localStorage.setItem("user-role", newRole);
    if (newRole === "police") {
      window.location.href = "/police";
    } else {
      window.location.href = "/dashboard";
    }
  };

  const navItems = [
    { name: "FEATURES", href: "/", roles: ["citizen", "police"] },
    { name: "DASHBOARD", href: "/dashboard", roles: ["citizen"] },
    { name: "FRAUD CHECKER", href: "/checker", roles: ["citizen"] },
    { name: "POLICE PORTAL", href: "/police", roles: ["police"] },
    { name: "ADMIN", href: "/admin", roles: ["citizen", "police"] },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-black/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <Shield className="h-5 w-5 text-primary group-hover:drop-shadow-[0_0_8px_rgba(0,255,102,0.8)] transition-all duration-300" />
              <span className="font-bold text-sm tracking-[0.2em] font-mono text-white">
                FRAUDSHIELD_
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {navItems
                .filter((item) => item.roles.includes(role))
                .map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-[10px] font-bold tracking-[0.15em] transition-colors font-mono ${
                        active ? "text-white" : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-zinc-900/50 border border-border rounded-[2px] px-3 py-1.5 text-[9px] text-zinc-400 font-mono tracking-widest">
              <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,102,0.6)]" />
              <span>SYSTEM ONLINE</span>
            </div>
            
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value as "citizen" | "police")}
              className="text-[10px] font-bold uppercase font-mono bg-black border border-border rounded-[2px] px-3 py-1.5 text-zinc-300 hover:text-white focus:outline-none focus:border-primary cursor-pointer transition-colors"
            >
              <option value="citizen">CITIZEN</option>
              <option value="police">POLICE</option>
            </select>
            
            <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md" onClick={() => setMobileOpen(false)}>
            <div className="flex flex-col w-full h-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="font-bold text-base tracking-[0.2em] font-mono text-white">FRAUDSHIELD_</span>
                </div>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="h-6 w-6 text-zinc-400 hover:text-white" />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {navItems
                  .filter((item) => item.roles.includes(role))
                  .map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`text-sm font-bold tracking-[0.2em] font-mono uppercase ${
                          active ? "text-primary" : "text-zinc-400"
                        }`}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8 relative">
        {children}
      </main>
    </div>
  );
}
