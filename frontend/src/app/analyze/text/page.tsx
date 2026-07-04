"use client";

import React, { useState } from 'react';
import { AnalysisCard } from '@/components/AnalysisCard';
import { analyzeText } from '@/services/api';
import { AnalysisResult } from '@/types';
import { FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function TextAnalysisPage() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysisResult = await analyzeText(text) as AnalysisResult;
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
          <FileText className="h-8 w-8 text-primary" />
          Text Analysis
        </h1>
        <p className="text-muted-foreground">
          Paste suspicious emails, SMS messages, or chat transcripts. Our NLP models will detect coercion, urgency, and social engineering patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Textarea
            placeholder="Paste the suspicious text here..."
            className="min-h-[300px] resize-none glass-card focus-visible:ring-primary"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isAnalyzing}
          />
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            onClick={handleAnalyze}
            disabled={!text.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
              </>
            ) : (
              'Analyze Text'
            )}
          </Button>
        </div>

        <div>
          {isAnalyzing ? (
            <AnalysisCard result={{} as AnalysisResult} isLoading={true} />
          ) : result ? (
            <AnalysisCard result={result} />
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground min-h-[300px]">
              Paste text and click Analyze to see the results here.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
