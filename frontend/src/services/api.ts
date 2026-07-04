export const analyzeImage = async (file: File) => {
  // TODO: Connect to FastAPI POST /analyze/image
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "img_" + Math.random().toString(36).substr(2, 9),
        riskScore: 85,
        confidence: 92,
        scamType: "Phishing",
        indicators: ["Fake login page", "Suspicious URL", "Urgency language"],
        reasoning: "The image contains a login page that closely resembles a known legitimate service, but the URL is slightly different.",
        recommendation: "Do not enter any credentials. Block the sender and report the URL.",
        evidence: ["Text match: 'Urgent action required'", "Logo mismatch detected"]
      });
    }, 2000);
  });
};

export const analyzeText = async (text: string) => {
  // TODO: Connect to FastAPI POST /analyze/text
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "txt_" + Math.random().toString(36).substr(2, 9),
        riskScore: 90,
        confidence: 88,
        scamType: "Social Engineering",
        indicators: ["Urgency", "Request for money", "Unknown sender"],
        reasoning: "The text creates a false sense of urgency and requests a money transfer to an unknown account.",
        recommendation: "Do not reply or send money. Verify the sender through other channels.",
        evidence: ["Keywords: 'urgent', 'transfer', 'account'"]
      });
    }, 1500);
  });
};

export const analyzeAudio = async (file: File) => {
  // TODO: Connect to FastAPI POST /analyze/audio
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "aud_" + Math.random().toString(36).substr(2, 9),
        riskScore: 75,
        confidence: 80,
        scamType: "Voice Cloning / Impersonation",
        indicators: ["Unnatural cadence", "Audio artifacts", "Request for sensitive info"],
        reasoning: "The audio exhibits signs of synthetic generation and requests sensitive personal information.",
        recommendation: "Do not provide the requested information. Hang up and contact the supposed caller directly.",
        evidence: ["Deepfake artifacts detected", "Transcript analysis indicates high risk"],
        transcript: "Hello, this is your bank calling. We have detected suspicious activity on your account. Please confirm your social security number immediately."
      });
    }, 3000);
  });
};

export const analyzeUrl = async (url: string) => {
  // TODO: Connect to FastAPI POST /analyze/url
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "url_" + Math.random().toString(36).substr(2, 9),
        riskScore: 95,
        confidence: 98,
        scamType: "Malware / Phishing",
        indicators: ["Known malicious domain", "Blacklisted IP", "Typosquatting"],
        reasoning: "The URL is on several blacklists and attempts to typosquat a popular banking website.",
        recommendation: "Do not click the link or visit the website. Block the domain.",
        evidence: ["Domain registered recently", "Matches known phishing patterns"]
      });
    }, 1000);
  });
};

export const getDashboardStats = async () => {
  // TODO: Connect to FastAPI GET /dashboard
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalAnalyzed: 15420,
        threatsPrevented: 3205,
        activeNetworks: 12,
        systemStatus: "Operational"
      });
    }, 500);
  });
};

export const getFraudNetwork = async () => {
  // TODO: Connect to FastAPI GET /fraud-network
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        nodes: [
          { id: "1", label: "Suspect A", type: "person" },
          { id: "2", label: "Phishing Site X", type: "url" },
          { id: "3", label: "Bank Account Y", type: "account" }
        ],
        edges: [
          { source: "1", target: "2", label: "operates" },
          { source: "1", target: "3", label: "owns" }
        ]
      });
    }, 1500);
  });
};
