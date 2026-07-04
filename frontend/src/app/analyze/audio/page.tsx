"use client";

import React, { useState, useRef } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { AnalysisCard } from '@/components/AnalysisCard';
import { analyzeAudio } from '@/services/api';
import { AnalysisResult } from '@/types';
import { Mic, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AudioAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    const url = URL.createObjectURL(uploadedFile);
    setAudioUrl(url);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysisResult = await analyzeAudio(uploadedFile) as AnalysisResult;
      setResult(analysisResult);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 mt-16">

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Mic className="h-8 w-8 text-primary" />
          Audio Analysis
        </h1>
        <p className="text-muted-foreground">
          Upload voicemails, call recordings, or voice notes (MP3/WAV). We detect synthetic voices, deepfakes, and analyze the transcript for threats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {!audioUrl ? (
             <UploadZone
                onUpload={handleUpload}
                accept={{ 'audio/*': ['.mp3', '.wav', '.ogg'] }}
                label="Drop audio file here or click to browse"
                isLoading={isAnalyzing}
             />
          ) : (
            <div className="space-y-4">
              <div className="glass-card p-6 rounded-xl flex flex-col items-center justify-center space-y-4 border-border/50">
                 <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Mic className={`h-10 w-10 text-primary ${isPlaying ? 'animate-pulse' : ''}`} />
                 </div>
                 <span className="font-mono text-sm text-muted-foreground truncate max-w-xs">{file?.name}</span>

                 <audio
                   ref={audioRef}
                   src={audioUrl}
                   onEnded={() => setIsPlaying(false)}
                   className="hidden"
                 />

                 <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={togglePlay}>
                   {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                 </Button>
              </div>

              {result?.transcript && (
                <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Generated Transcript</h4>
                  <p className="text-sm italic text-foreground/90">"{result.transcript}"</p>
                </div>
              )}

              <div className="flex justify-end">
                 <button
                   onClick={() => { setFile(null); setAudioUrl(null); setResult(null); }}
                   className="text-xs text-destructive hover:underline"
                   disabled={isAnalyzing}
                 >
                   Remove Audio
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
            <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground min-h-[300px]">
              Upload an audio file to see the analysis results here.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
