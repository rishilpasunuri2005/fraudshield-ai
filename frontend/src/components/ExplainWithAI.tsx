"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Database } from "lucide-react";
import { API_URL } from "../lib/api";
import { useAuth } from "../lib/auth-context";

interface ExplainWithAIProps {
  query: string;
}

export default function ExplainWithAI({ query }: ExplainWithAIProps) {
  const { authHeaders } = useAuth();
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/rag/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ question: query }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setExplanation(data.answer);
      } else {
        setError("Failed to get explanation from RAG system.");
      }
    } catch (err) {
      setError("Unable to connect to RAG service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t border-border pt-8">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2 font-mono">
          <Database className="h-3 w-3" /> {"// RAG KNOWLEDGE BASE QUERY"}
        </h4>
        {!explanation && (
          <button
            onClick={handleExplain}
            disabled={loading}
            className="px-6 py-2 rounded-sm border border-border bg-[#000000] text-zinc-300 font-bold text-[10px] hover:text-white hover:border-primary transition-all flex items-center gap-2 uppercase tracking-widest font-mono disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            {loading ? "SEARCHING VECTOR DB..." : "EXTRACT DEEP CONTEXT"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-[10px] font-mono text-red-500 font-bold bg-red-500/10 px-4 py-2 rounded-sm border border-red-500/20">{error}</p>
      )}

      {explanation && (
        <div className="bg-[#000000] border border-border rounded-sm overflow-hidden">
          <div className="flex items-center px-4 py-2 border-b border-border bg-[#030303]">
             <span className="text-[9px] font-mono text-primary uppercase tracking-widest">RAG_OUTPUT.md</span>
          </div>
          <div className="p-6">
            <p className="text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
