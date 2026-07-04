"use client";

import React, { useState } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { AnalysisCard } from '@/components/AnalysisCard';
import { analyzeImage } from '@/services/api';
import { AnalysisResult } from '@/types';
import { ShieldAlert } from 'lucide-react';
import Image from 'next/image';

export default function ScreenshotAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);

    // Create preview
    const objectUrl = URL.createObjectURL(uploadedFile);
    setPreview(objectUrl);

    setIsAnalyzing(true);
    setResult(null);

    try {
      // Simulate API call
      const analysisResult = await analyzeImage(uploadedFile) as AnalysisResult;
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
          <ShieldAlert className="h-8 w-8 text-primary" />
          Screenshot Analysis
        </h1>
        <p className="text-muted-foreground">
          Upload screenshots of suspicious messages, emails, or websites. Our AI will analyze the visual elements and text to detect fraud indicators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {!preview ? (
             <UploadZone onUpload={handleUpload} isLoading={isAnalyzing} />
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                <Image
                  src={preview}
                  alt="Screenshot preview"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-sm text-muted-foreground truncate max-w-[200px]">{file?.name}</span>
                 <button
                   onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                   className="text-xs text-destructive hover:underline"
                   disabled={isAnalyzing}
                 >
                   Remove Image
                 </button>
              </div>
            </div>
          )}
        </div>

        <div>
          {isAnalyzing ? (
            <AnalysisCard result={{} as AnalysisResult} isLoading={true} />
          ) : result ? (
            <AnalysisCard result={result} />
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
              Upload an image to see the analysis results here.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
