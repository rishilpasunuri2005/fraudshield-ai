"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, LayoutDashboard, Image as ImageIcon, FileText, Mic, Link as LinkIcon, BookOpen, Network, Settings, Menu, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Screenshot', href: '/analyze/screenshot', icon: ImageIcon },
    { name: 'Text', href: '/analyze/text', icon: FileText },
    { name: 'Audio', href: '/analyze/audio', icon: Mic },
    { name: 'URL', href: '/analyze/url', icon: LinkIcon },
    { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
    { name: 'Network', href: '/fraud-network', icon: Network },
  ];

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Shield className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-bold text-lg tracking-widest text-white uppercase font-mono">
                FRAUDSHIELD<span className="text-primary">_</span>
              </span>
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-sm text-xs uppercase tracking-wider font-bold transition-colors ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white rounded-sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="-mr-2 flex lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#050505] absolute top-16 left-0 w-full border-b border-border/40">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 block px-3 py-3 rounded-sm text-xs font-bold uppercase tracking-wider ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 block px-3 py-3 rounded-sm text-xs font-bold uppercase tracking-wider text-zinc-400 hover:bg-zinc-900 hover:text-white"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
