import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResult } from '@/types';
import { RiskBadge } from './RiskBadge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ShieldAlert, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalysisCardProps {
  result: AnalysisResult;
  isLoading?: boolean;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="glass-card animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-2 bg-muted rounded w-full"></div>
            <div className="h-20 bg-muted rounded w-full"></div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card overflow-hidden border-border/50">
        <div className={`h-1 w-full ${result.riskScore >= 90 ? 'bg-destructive' : result.riskScore >= 70 ? 'bg-orange-500' : result.riskScore >= 40 ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Analysis Results
              <RiskBadge score={result.riskScore} />
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              Scam Type: {result.scamType}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">Confidence</div>
            <div className="flex items-center gap-2">
              <Progress value={result.confidence} className="w-20 h-2 bg-muted [&>div]:bg-emerald-500" />
              <span className="text-xs text-muted-foreground">{result.confidence}%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

          <div>
            <h4 className="text-sm font-medium flex items-center gap-2 mb-2 text-primary">
              <Info className="h-4 w-4" /> Reasoning
            </h4>
            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border border-border/50">
              {result.reasoning}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" /> Key Indicators
              </h4>
              <ul className="space-y-1">
                {result.indicators.map((indicator, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-orange-500" />
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Evidence
              </h4>
              <ul className="space-y-1">
                {result.evidence.map((item, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-md">
            <h4 className="text-sm font-semibold text-destructive mb-1">Recommendation</h4>
            <p className="text-sm text-destructive/80">{result.recommendation}</p>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  );
};
