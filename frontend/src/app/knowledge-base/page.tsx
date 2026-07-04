"use client";

import React, { useState } from 'react';
import { BookOpen, Search, ChevronRight, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const MOCK_DOCS = [
  { id: 1, title: "Anatomy of a Digital Arrest Scam", category: "Scam Profiles", date: "Oct 12, 2026" },
  { id: 2, title: "Identifying Deepfake Audio in WhatsApp Calls", category: "Detection Guides", date: "Sep 28, 2026" },
  { id: 3, title: "Standard Operating Procedure: Freezing Suspect Accounts", category: "Law Enforcement", date: "Nov 05, 2026" },
  { id: 4, title: "Analysis of the 'FedEx Package' Phishing Campaign", category: "Threat Intel", date: "Aug 14, 2026" },
  { id: 5, title: "Guide to Extracting Headers from Suspicious Emails", category: "Tutorials", date: "Jul 02, 2026" },
];

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(MOCK_DOCS[0]);

  const filteredDocs = MOCK_DOCS.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl h-[calc(100vh-4rem)] flex flex-col mt-4">

      <div className="mb-8 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Threat Knowledge Base
        </h1>
        <p className="text-muted-foreground">
          Access our comprehensive database of known scam tactics, standard operating procedures, and threat intelligence reports.
        </p>
      </div>

      <div className="flex-1 border border-border/50 rounded-xl overflow-hidden glass-card flex flex-col md:flex-row min-h-0">

        {/* Sidebar */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border/50 flex flex-col bg-muted/10">
          <div className="p-4 shrink-0 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-9 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left px-3 py-3 rounded-md transition-colors flex items-start gap-3 ${
                    selectedDoc.id === doc.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50 text-foreground'
                  }`}
                >
                  <FileText className={`h-5 w-5 shrink-0 mt-0.5 ${selectedDoc.id === doc.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="overflow-hidden">
                    <p className="font-medium text-sm truncate">{doc.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{doc.category}</span>
                      <span className="text-[10px] text-muted-foreground/50">{doc.date}</span>
                    </div>
                  </div>
                </button>
              ))}
              {filteredDocs.length === 0 && (
                <div className="text-center p-4 text-sm text-muted-foreground">No documents found.</div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 flex flex-col bg-black/40 min-h-0">
          <div className="p-6 border-b border-border/50 shrink-0">
            <div className="flex items-center text-xs text-muted-foreground mb-2">
               Knowledge Base <ChevronRight className="h-3 w-3 mx-1" /> {selectedDoc.category}
            </div>
            <h2 className="text-2xl font-bold">{selectedDoc.title}</h2>
            <div className="text-xs text-muted-foreground mt-2">Last updated: {selectedDoc.date}</div>
          </div>

          <ScrollArea className="flex-1 p-6 lg:p-10">
            <div className="prose prose-invert prose-emerald max-w-none">
              <h3>Overview</h3>
              <p>
                This document details the mechanics of the <strong>{selectedDoc.title}</strong>. This specific threat vector has seen a 300% increase in the last quarter, primarily targeting vulnerable demographics through social engineering.
              </p>

              <h3>Modus Operandi</h3>
              <p>
                The attackers typically initiate contact via unsolicited messages claiming an urgent issue (e.g., a blocked package, a compromised account, or an outstanding warrant). They quickly escalate the situation, moving the victim to a voice or video call on platforms like Skype or WhatsApp to establish dominance and induce panic.
              </p>

              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-md my-6">
                <h4 className="text-red-500 mt-0 mb-2 font-semibold">Critical Warning Signs</h4>
                <ul>
                  <li>Requests for payment via untraceable methods (crypto, gift cards, specific UPI accounts).</li>
                  <li>Insistence on keeping the victim isolated (e.g., "Do not tell anyone, you are under digital arrest").</li>
                  <li>Use of official-looking but fabricated documents sent via chat.</li>
                </ul>
              </div>

              <h3>Mitigation Strategies</h3>
              <p>
                Immediate action involves severing communication. Do not attempt to negotiate or extract information once the scam is identified. Report the specific indicators (phone numbers, UPI IDs) to the FraudShield network immediately to initiate blocking protocols.
              </p>
            </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  );
}
