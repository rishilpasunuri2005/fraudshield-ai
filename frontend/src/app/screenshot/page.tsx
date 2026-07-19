import AnalyzerPage from "../../components/analyzer-page";

export default function ScreenshotAnalyzer() {
  return (
    <AnalyzerPage
      title="Screenshot Analyzer"
      description="Upload screenshots of chats, phishing alerts, or fake bank notices."
      endpoint="/scan/image"
      inputKind="file"
      accept="image/*"
      sourceLabel="Screenshot Source"
      submitLabel="Run OCR Diagnostic"
      loadingLabel="ANALYZING..."
      demoExtension="png"
      demoItems={[
        { key: "sbi_phishing_sms", name: "SBI Phishing SMS", desc: "Blocked Account PAN scam" },
        { key: "whatsapp_chat", name: "WhatsApp CBI Extortion", desc: "Digital arrest extortion call" },
        { key: "telegram_scam", name: "Telegram Hotels Tasks", desc: "Rating hotel deposits scam" },
        { key: "bank_notice", name: "Fake Bank Notice", desc: "Urgent RBI PAN linking alert" },
      ]}
    />
  );
}
