import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FraudShield AI — Protect Yourself from Digital Fraud",
  description:
    "AI-powered public safety platform. Analyze screenshots, suspicious messages, scam calls, URLs and documents to detect digital arrest scams, phishing, UPI fraud and more.",
};

export const viewport: Viewport = {
  themeColor: "#0b0f1e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-background" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-svh antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
