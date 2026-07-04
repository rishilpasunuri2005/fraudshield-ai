"use client";

import React, { useState, useEffect } from 'react';
import { Network, Search, User, Link as LinkIcon, Database, AlertCircle } from 'lucide-react';
import { getFraudNetwork } from '@/services/api';
import { FraudNetworkData, GraphNode } from '@/types';
import { Input } from '@/components/ui/input';

export default function FraudNetworkPage() {
  const [data, setData] = useState<FraudNetworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<GraphNode | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const netData = await getFraudNetwork() as FraudNetworkData;
        setData(netData);
        if (netData.nodes.length > 0) setSelectedEntity(netData.nodes[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col md:flex-row mt-1">

      {/* Main Graph Area */}
      <div className="flex-1 flex flex-col relative bg-[#0a0a0a]">
        <div className="absolute top-4 left-4 z-10 p-4 glass-card max-w-sm">
           <h1 className="text-xl font-bold flex items-center gap-2 mb-2">
             <Network className="h-5 w-5 text-primary" /> Syndicate Graph
           </h1>
           <p className="text-xs text-muted-foreground">
             Visualizing connections between known bad actors, phishing domains, and mule accounts. Powered by Neo4j.
           </p>
           <div className="mt-4 relative">
             <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input placeholder="Search entity..." className="pl-9 h-8 text-xs bg-black/50" />
           </div>
        </div>

        {/* Graph Placeholder */}
        <div className="flex-1 flex items-center justify-center border-r border-border/50 relative overflow-hidden">
          {/* Decorative background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

          {loading ? (
            <div className="text-primary animate-pulse flex flex-col items-center">
               <Network className="h-10 w-10 mb-2 opacity-50" />
               <span className="text-sm">Loading network data...</span>
            </div>
          ) : (
             <div className="text-center relative z-10 p-8 glass-card border-dashed">
                <Network className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Neo4j Integration Pending</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  The visual graph implementation is a placeholder. In production, this area will render the interactive force-directed graph showing {data?.nodes.length} entities and {data?.edges.length} relationships.
                </p>
             </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Entity Details */}
      <div className="w-full md:w-80 lg:w-96 glass bg-black/80 flex flex-col shrink-0">
        <div className="p-4 border-b border-border/50 font-semibold text-sm flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" /> Entity Details
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {selectedEntity ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  {selectedEntity.type === 'person' ? <User className="h-6 w-6 text-primary" /> :
                   selectedEntity.type === 'url' ? <LinkIcon className="h-6 w-6 text-blue-400" /> :
                   <Database className="h-6 w-6 text-amber-400" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedEntity.label}</h2>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-muted text-muted-foreground mt-1">
                    TYPE: {selectedEntity.type}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Known Associations</h4>
                  <div className="space-y-2">
                    {data?.edges.filter(e => e.source === selectedEntity.id || e.target === selectedEntity.id).map((edge, i) => {
                      const isSource = edge.source === selectedEntity.id;
                      const connectedNodeId = isSource ? edge.target : edge.source;
                      const connectedNode = data.nodes.find(n => n.id === connectedNodeId);
                      return (
                        <div key={i} className="flex items-center justify-between text-sm p-2 bg-muted/20 rounded border border-border/30">
                           <span className="text-muted-foreground text-xs italic">{isSource ? 'Out:' : 'In:'} {edge.label}</span>
                           <span className="font-medium text-right">{connectedNode?.label || connectedNodeId}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                   <h4 className="flex items-center gap-2 text-sm font-semibold text-red-500 mb-2">
                     <AlertCircle className="h-4 w-4" /> Risk Assessment
                   </h4>
                   <p className="text-xs text-red-400/90 leading-relaxed">
                     This entity is part of an active cluster involved in financial extortion. Automatic blocking rules have been proposed to the firewall.
                   </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-10">
              Select a node in the graph to view details.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
