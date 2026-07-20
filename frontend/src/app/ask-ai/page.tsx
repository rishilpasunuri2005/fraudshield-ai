"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Users, Shield, Clock, BrainCircuit, Activity, Cpu, Search, Paperclip, MoreVertical, Plus } from "lucide-react";
import { API_URL } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function AskAIPage() {
  const { authHeaders } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Agent 01 online. RAG vectors loaded. How can I assist with your investigation today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: inputValue }];
    setMessages(newMessages);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/rag/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ question: inputValue }),
      });
      if (response.ok) {
        const data = await response.json();
        setMessages([...newMessages, { role: "assistant", content: data.answer }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "[ERR_RAG_TIMEOUT] Could not connect to vector database." }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "[ERR_SERVER_DOWN] Knowledge base is currently inaccessible." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] w-full grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6">
      
      {/* Left Sidebar: Chats */}
      <div className="glass-card flex flex-col h-full overflow-hidden hidden md:flex">
        <div className="p-4 border-b border-border bg-[#030303] flex items-center justify-between">
          <h3 className="text-xs font-bold font-mono tracking-widest text-zinc-400 uppercase">Investigations</h3>
          <button className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex px-4 py-3 gap-2 border-b border-border bg-[#050505]">
          <button className="flex-1 py-1.5 bg-primary text-black font-bold text-[9px] font-mono tracking-widest rounded-sm uppercase">Active</button>
          <button className="flex-1 py-1.5 bg-[#000000] border border-border text-zinc-400 font-bold text-[9px] font-mono tracking-widest rounded-sm uppercase hover:text-white">Archived</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Mock Chat Sessions */}
          {[
            { name: "Digital Arrest Scam (Mumbai)", time: "10:00pm", active: true },
            { name: "Phishing URLs - SBI Pattern", time: "09:41am", active: false },
            { name: "WhatsApp Extortion Bot", time: "Yesterday", active: false },
            { name: "Crypto Transfer Tracing", time: "2 Days", active: false },
          ].map((chat, i) => (
            <div key={i} className={`p-3 rounded-md border cursor-pointer transition-colors ${chat.active ? 'bg-primary/5 border-primary/30' : 'bg-[#000000] border-border hover:border-zinc-700'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[10px] font-bold font-mono ${chat.active ? 'text-primary' : 'text-zinc-300'}`}>{chat.name}</span>
              </div>
              <p className="text-[9px] font-mono text-zinc-500 truncate">Last update: {chat.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Main Chat Window */}
      <div className="glass-card flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-[#030303] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <BrainCircuit className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono tracking-widest">DEFENSYS_ORACLE</h2>
              <p className="text-[9px] text-zinc-500 font-mono tracking-widest flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span> RAG ONLINE
              </p>
            </div>
          </div>
          <button className="text-zinc-500 hover:text-white">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-4 font-mono text-xs leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-accent/10 border border-accent/30 text-white shadow-[0_0_15px_rgba(0,102,255,0.1)]' 
                  : 'bg-[#000000] border border-border text-zinc-300'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/50">
                    <Cpu className="h-3 w-3 text-primary" />
                    <span className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">ORACLE_RESPONSE</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#000000] border border-border rounded-lg p-4 font-mono text-xs flex items-center gap-3 text-primary">
                <Activity className="h-4 w-4 animate-pulse" /> Retrieving context vectors...
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-border bg-[#030303]">
          <form onSubmit={handleSendMessage} className="relative flex items-center bg-[#000000] border border-border rounded-md overflow-hidden focus-within:border-primary transition-colors">
            <button type="button" className="pl-4 pr-2 text-zinc-500 hover:text-primary transition-colors">
              <Paperclip className="h-4 w-4" />
            </button>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="$ Query the knowledge base..."
              className="flex-1 bg-transparent py-4 px-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none"
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim() || loading}
              className="px-6 py-4 bg-primary text-black font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Sidebar: Intelligence / Notifications */}
      <div className="glass-card flex flex-col h-full overflow-hidden hidden lg:flex">
        <div className="p-4 border-b border-border bg-[#030303]">
          <h3 className="text-xs font-bold font-mono tracking-widest text-zinc-400 uppercase">Intelligence Feed</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-3 border border-border bg-[#000000] rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold text-accent uppercase tracking-widest flex items-center gap-1"><Search className="h-3 w-3" /> RETRIEVED</span>
              <span className="text-[9px] text-zinc-500 font-mono">2 min ago</span>
            </div>
            <p className="text-[10px] font-mono text-zinc-300">
              Matched pattern: <strong>Fake SBI App APK</strong><br/>
              Confidence: <span className="text-primary">94%</span>
            </p>
          </div>

          <div className="p-3 border border-border bg-[#000000] rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-1"><Clock className="h-3 w-3" /> ALERT</span>
              <span className="text-[9px] text-zinc-500 font-mono">15 min ago</span>
            </div>
            <p className="text-[10px] font-mono text-zinc-300">
              Surge in WhatsApp video call extortion reports from your jurisdiction.
            </p>
          </div>

          <div className="p-3 border border-border bg-[#000000] rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest flex items-center gap-1"><Users className="h-3 w-3" /> SYSTEM</span>
              <span className="text-[9px] text-zinc-500 font-mono">1 hr ago</span>
            </div>
            <p className="text-[10px] font-mono text-zinc-300">
              NVIDIA NIM model successfully re-indexed 2,400 new threat vectors.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
