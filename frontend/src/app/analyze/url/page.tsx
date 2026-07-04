"use client";

import React, { useState } from 'react';
import { AnalysisCard } from '@/components/AnalysisCard';
import { analyzeUrl } from '@/services/api';
import { AnalysisResult } from '@/types';
import { Link as LinkIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function UrlAnalysisPage() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysisResult = await analyzeUrl(url) as AnalysisResult;
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 mt-16">

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <LinkIcon className="h-8 w-8 text-primary" />
          URL Analysis
        </h1>
        <p className="text-muted-foreground">
          Enter a suspicious link. We will check it against global threat intelligence databases, analyze its behavior, and detect phishing attempts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="url"
              placeholder="https://example.com/suspicious-link"
              className="glass-card flex-1 h-12"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isAnalyzing}
            />
            <Button
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={handleAnalyze}
              disabled={!url.trim() || isAnalyzing}
            >
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Scan URL'}
            </Button>
          </div>

          <div className="p-4 bg-muted/10 border border-border/40 rounded-lg">
             <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase">Scanning Process</h4>
             <ul className="text-xs space-y-2 text-muted-foreground/80">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Domain Reputation Check</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Redirect Chain Analysis</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Typosquatting Detection</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Malware Signature Match</li>
             </ul>
          </div>
        </div>

        <div>
          {isAnalyzing ? (
            <AnalysisCard result={{} as AnalysisResult} isLoading={true} />
          ) : result ? (
            <AnalysisCard result={result} />
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground min-h-[300px]">
              Enter a URL and click Scan to see the risk report here.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
