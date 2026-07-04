"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/risk-badge";
import type { AnalysisResult } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  FileSearch,
  Lightbulb,
} from "lucide-react";

function scoreColor(score: number) {
  if (score >= 75) return "text-destructive";
  if (score >= 40) return "text-warning";
  return "text-success";
}

export function AnalysisResultCard({ result }: { result: AnalysisResult }) {
  const [reasoningOpen, setReasoningOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      <Card className="glass">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-lg">Analysis Result</CardTitle>
            <RiskBadge level={result.riskLevel} />
          </div>
          <CardDescription>{result.scamType}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p
                  className={cn(
                    "text-3xl font-semibold tabular-nums",
                    scoreColor(result.riskScore),
                  )}
                >
                  {result.riskScore}
                  <span className="text-base text-muted-foreground">/100</span>
                </p>
              </div>
              <Progress value={result.riskScore} aria-label="Risk score" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-3xl font-semibold tabular-nums text-primary">
                  {result.confidence}
                  <span className="text-base text-muted-foreground">%</span>
                </p>
              </div>
              <Progress value={result.confidence} aria-label="Confidence" />
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle
                className="size-4 text-warning"
                aria-hidden="true"
              />
              Fraud Indicators
            </h3>
            <ul className="flex flex-col gap-2">
              {result.indicators.map((indicator) => (
                <li
                  key={indicator}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive"
                    aria-hidden="true"
                  />
                  {indicator}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-primary/25 bg-primary/10 p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="size-4 text-primary" aria-hidden="true" />
              Recommendation
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {result.recommendation}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <FileSearch className="size-4 text-accent" aria-hidden="true" />
              Evidence
            </h3>
            <ul className="flex flex-col gap-2">
              {result.evidence.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => setReasoningOpen((v) => !v)}
              aria-expanded={reasoningOpen}
              className="justify-between"
            >
              <span className="flex items-center gap-2">
                <BrainCircuit data-icon="inline-start" />
                AI Reasoning
              </span>
              <ChevronDown
                data-icon="inline-end"
                className={cn(
                  "transition-transform duration-200",
                  reasoningOpen && "rotate-180",
                )}
              />
            </Button>
            {reasoningOpen ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="rounded-xl border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                  {result.reasoning}
                </p>
              </motion.div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
