"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Smartphone, Mail, Phone, MapPin, Landmark, Cpu, Database, Eye, Globe } from "lucide-react";

interface Node {
  id: string;
  label: string;
  type: string;
  properties: any;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
  amount?: number;
}

interface GraphData {
  nodes: Node[];
  links: GraphLink[];
}

export default function GraphVisualizer({ data }: { data: GraphData }) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);

  useEffect(() => {
    if (!data || !data.nodes) return;

    // Apply a circular layout for the graph nodes to fit beautifully in the SVG box
    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    const mappedNodes = data.nodes.map((node, index) => {
      let x = centerX;
      let y = centerY;

      if (node.type === "Victim") {
        x = centerX;
        y = centerY;
      } else {
        // Distribute other nodes in a circle
        const angle = (index / (data.nodes.length - 1)) * 2 * Math.PI;
        const radius = 150;
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
      }

      return { ...node, x, y };
    });

    setNodes(mappedNodes);
    setLinks(data.links);
    
    // Default select first suspect node
    const firstSuspect = mappedNodes.find(n => n.type === "Phone");
    if (firstSuspect) setSelectedNode(firstSuspect);
  }, [data]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case "Victim": return { fill: "#10b981", stroke: "#047857" }; // Emerald
      case "Phone": return { fill: "#ef4444", stroke: "#b91c1c" };  // Red
      case "Device": return { fill: "#a855f7", stroke: "#7e22ce" }; // Purple
      case "UPI": return { fill: "#3b82f6", stroke: "#1d4ed8" };    // Blue
      case "IP": return { fill: "#eab308", stroke: "#a16207" };     // Yellow
      default: return { fill: "#71717a", stroke: "#3f3f46" };       // Zinc
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "Victim": return UserIcon;
      case "Phone": return Phone;
      case "Device": return Smartphone;
      case "UPI": return Landmark;
      case "IP": return Globe;
      default: return Cpu;
    }
  };

  // Mini User Icon placeholder
  const UserIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* SVG Canvas (Left 2 columns) */}
      <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden p-4 relative border border-zinc-850 bg-zinc-950/40">
        <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Victim
          </span>
          <span className="inline-flex items-center gap-1.5 text-[9px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Phone
          </span>
          <span className="inline-flex items-center gap-1.5 text-[9px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" /> Device
          </span>
          <span className="inline-flex items-center gap-1.5 text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> UPI
          </span>
          <span className="inline-flex items-center gap-1.5 text-[9px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" /> IP
          </span>
        </div>

        <svg viewBox="0 0 600 400" className="w-full h-[320px] sm:h-[400px]">
          {/* Render Connection Lines */}
          {links.map((link, idx) => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);
            if (!sourceNode || !targetNode) return null;

            return (
              <g key={`link-${idx}`}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="#3f3f46"
                  strokeWidth={1.5}
                  strokeDasharray={link.type === "TRANSFERRED" ? "4 4" : "0"}
                  className="animate-pulse"
                />
                {/* Midpoint Label */}
                <text
                  x={((sourceNode.x || 0) + (targetNode.x || 0)) / 2}
                  y={((sourceNode.y || 0) + (targetNode.y || 0)) / 2 - 5}
                  fill="#71717a"
                  fontSize="7"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {link.type}
                </text>
              </g>
            );
          })}

          {/* Render Circle Nodes */}
          {nodes.map((node) => {
            const colors = getNodeColor(node.type);
            const isSelected = selectedNode?.id === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group"
              >
                <circle
                  r={node.type === "Victim" ? 22 : 18}
                  fill={colors.fill}
                  fillOpacity={isSelected ? 0.3 : 0.15}
                  stroke={isSelected ? "#10b981" : colors.stroke}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="transition-all group-hover:scale-110"
                />
                <circle
                  r={node.type === "Victim" ? 14 : 11}
                  fill={colors.fill}
                  fillOpacity={0.8}
                  stroke={colors.stroke}
                  strokeWidth={1}
                />
                {/* Node Icon label inside center */}
                <text
                  y="4"
                  textAnchor="middle"
                  fill="#000000"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {node.type[0]}
                </text>
                
                {/* Label text under node */}
                <text
                  y={node.type === "Victim" ? 38 : 34}
                  textAnchor="middle"
                  fill="#d4d4d8"
                  fontSize="8"
                  fontWeight="semibold"
                >
                  {node.label.length > 15 ? `${node.label.slice(0, 12)}...` : node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Properties (Right column) */}
      <div className="glass-card p-6 rounded-xl border border-zinc-850 flex flex-col justify-between bg-zinc-900/10 min-h-[300px]">
        {selectedNode ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
              <div className="p-2 rounded bg-zinc-800/80 text-emerald-400">
                {React.createElement(getNodeIcon(selectedNode.type), { className: "h-5 w-5" })}
              </div>
              <div>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{selectedNode.type} Node</span>
                <h4 className="text-sm font-bold text-zinc-200 select-all">{selectedNode.label}</h4>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h5 className="font-bold text-zinc-400 uppercase tracking-widest text-[10px]">Graph Metadata</h5>
              
              {selectedNode.type === "Phone" && (
                <>
                  <div className="flex justify-between py-1 border-b border-zinc-850/60">
                    <span className="text-zinc-500">Reported Fraud Count:</span>
                    <span className="font-semibold text-red-400">{selectedNode.properties.reports || 1} cases</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-850/60">
                    <span className="text-zinc-500">Cluster Danger Level:</span>
                    <span className="font-bold text-red-500">CRITICAL</span>
                  </div>
                </>
              )}

              {selectedNode.type === "Device" && (
                <>
                  <div className="flex justify-between py-1 border-b border-zinc-850/60">
                    <span className="text-zinc-500">Model Model:</span>
                    <span className="font-semibold text-zinc-300">{selectedNode.properties.model || "Redmi Note"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-850/60">
                    <span className="text-zinc-500">Associated Sim Cards:</span>
                    <span className="font-semibold text-zinc-300">2 flagged lines</span>
                  </div>
                </>
              )}

              {selectedNode.type === "Victim" && (
                <>
                  <div className="flex justify-between py-1 border-b border-zinc-850/60">
                    <span className="text-zinc-500">Complaints Filed:</span>
                    <span className="font-semibold text-zinc-300">2 active cases</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-850/60">
                    <span className="text-zinc-500">Contact Email:</span>
                    <span className="font-semibold text-zinc-300">{selectedNode.properties.email || "N/A"}</span>
                  </div>
                </>
              )}

              {selectedNode.type === "UPI" && (
                <div className="flex justify-between py-1 border-b border-zinc-850/60">
                  <span className="text-zinc-500">Destination Account:</span>
                  <span className="font-semibold text-emerald-400">SBI verification account</span>
                </div>
              )}

              <div className="mt-4 p-3 bg-zinc-950/40 rounded border border-zinc-850 text-[10px] text-zinc-400 leading-relaxed">
                <strong>Intelligence recommendation:</strong> This suspect entity forms part of a multi-district extortion network. Cross-verify physical IMEI location with cell tower records.
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-zinc-500 flex flex-col items-center justify-center gap-2">
            <Database className="h-6 w-6 text-zinc-600" />
            Select any node on the left network graph to load live profile telemetry.
          </div>
        )}
        
        <div className="pt-4 mt-4 border-t border-zinc-800 flex justify-end">
          <Link href="/analytics" className="text-[10px] text-emerald-400 hover:underline font-bold flex items-center gap-1">
            <Eye className="h-3 w-3" /> View Flagged Directories
          </Link>
        </div>
      </div>
    </div>
  );
}
