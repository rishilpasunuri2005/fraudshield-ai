import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border/40 bg-[#020202] py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm tracking-widest text-white uppercase font-mono">
              FRAUDSHIELD<span className="text-primary">_</span>
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-mono text-center md:text-left">
            © {new Date().getFullYear()} FraudShield AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
