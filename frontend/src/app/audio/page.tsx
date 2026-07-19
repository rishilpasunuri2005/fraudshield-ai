import AnalyzerPage from "../../components/analyzer-page";

export default function VoiceScamDetector() {
  return (
    <AnalyzerPage
      title="Voice Scam Detector"
      description="Upload suspect call recordings or voice notes to detect extortion patterns."
      endpoint="/scan/audio"
      inputKind="file"
      accept="audio/*"
      sourceLabel="Audio Recording Target"
      submitLabel="Run Speech Diagnostic"
      loadingLabel="ANALYZING..."
      demoExtension="mp3"
      demoItems={[
        { key: "digital_arrest", name: "CBI Narcotics Extortion Call", desc: "Digital arrest voice threats" },
        { key: "bank_fraud", name: "Bank Verification Extortion", desc: "Suspicious KYC details claim" },
        { key: "lottery", name: "KBC Lottery Reward Alert", desc: "Won reward lucky cash prizes" },
        { key: "upi_scam", name: "UPI QR Cashback Check", desc: "UPI collect requests" },
      ]}
    />
  );
}
