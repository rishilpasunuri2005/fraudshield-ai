"use client";

import React, { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { API_URL } from "../../lib/api";

interface ExplainWithAIProps {
  query: string;
}

export default function ExplainWithAI({ query }: ExplainWithAIProps) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/rag/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <div className="mt-6 border-t border-zinc-850 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-emerald-500" /> Deep Legal & Policy Explanation
        </h4>
        {!explanation && (
          <button
            onClick={handleExplain}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] hover:bg-emerald-500/20 transition-all flex items-center gap-2 uppercase tracking-wider"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Query RAG Knowledge Base"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {explanation && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
          <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
