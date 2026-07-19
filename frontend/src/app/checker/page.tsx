"use client";

import { useState } from "react";
import { Globe, Image as ImageIcon, Search } from "lucide-react";
import AnalyzerPage from "../../components/analyzer-page";

type CheckerTab = "text" | "url" | "image";

export default function ThreatChecker() {
  const [activeTab, setActiveTab] = useState<CheckerTab>("text");

  const tabClass = (tab: CheckerTab) =>
    `px-6 py-4 text-xs font-bold font-mono tracking-[0.1em] uppercase transition-all flex items-center gap-3 ${
      activeTab === tab
        ? "border-b-2 border-primary text-primary bg-[#080808]"
        : "border-b-2 border-transparent text-zinc-500 hover:text-white hover:bg-[#050505]"
    }`;

  return (
    <div className="space-y-8">
      <div className="glass-card">
        <div className="flex border-b border-border bg-[#030303]">
          <button onClick={() => setActiveTab("text")} className={tabClass("text")}>
            <Search className="h-4 w-4" /> Message
          </button>
          <button onClick={() => setActiveTab("url")} className={tabClass("url")}>
            <Globe className="h-4 w-4" /> Domain URL
          </button>
          <button onClick={() => setActiveTab("image")} className={tabClass("image")}>
            <ImageIcon className="h-4 w-4" /> Screenshot
          </button>
        </div>
      </div>

      {activeTab === "text" && (
        <AnalyzerPage
          title="Real-Time Threat Extraction API"
          description="Analyze suspicious text and get a risk score plus recommendation."
          endpoint="/scan/text"
          inputKind="text"
          payloadKey="text"
          sourceLabel="Powered by Agent 1"
          placeholder="Paste suspicious SMS, WhatsApp message, or email text..."
          submitLabel="Run Scan"
          loadingLabel="ANALYZING..."
          showExplainWithAI
        />
      )}

      {activeTab === "url" && (
        <AnalyzerPage
          title="Real-Time Threat Extraction API"
          description="Verify suspicious URLs for phishing markers."
          endpoint="/scan/url"
          inputKind="url"
          payloadKey="url"
          sourceLabel="Powered by Web Scraper Agent"
          placeholder="e.g. https://secure-sbi-login.net"
          submitLabel="Verify URL"
          loadingLabel="ANALYZING..."
          showExplainWithAI
        />
      )}

      {activeTab === "image" && (
        <AnalyzerPage
          title="Real-Time Threat Extraction API"
          description="Upload a screenshot and extract risk indicators."
          endpoint="/scan/image"
          inputKind="file"
          accept="image/*"
          sourceLabel="Powered by NVIDIA Vision Engine"
          submitLabel="Analyze Screenshot"
          loadingLabel="ANALYZING..."
          showExplainWithAI
        />
      )}
    </div>
  );
}
