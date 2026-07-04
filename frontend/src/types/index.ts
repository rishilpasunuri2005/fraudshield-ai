export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface AnalysisResult {
  id: string;
  riskScore: number;
  confidence: number;
  scamType: string;
  indicators: string[];
  reasoning: string;
  recommendation: string;
  evidence: string[];
  transcript?: string;
}

export interface DashboardStats {
  totalAnalyzed: number;
  threatsPrevented: number;
  activeNetworks: number;
  systemStatus: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

export interface FraudNetworkData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
