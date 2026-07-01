import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SidebarLayout from "./sidebar-layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FraudShield AI - Public Safety Intelligence",
  description: "AI-powered public safety platform to analyze, prevent and investigate scams and digital arrest networks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-zinc-950 text-zinc-100 dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}>
        <SidebarLayout>{children}</SidebarLayout>
      </body>
    </html>
  );
}
