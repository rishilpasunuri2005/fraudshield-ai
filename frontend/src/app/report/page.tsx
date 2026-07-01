"use client";

import React, { useState } from "react";
import { Send, FileText, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

export default function ReportScam() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scam_category: "Digital Arrest",
    reporter_phone: "",
    reporter_email: "",
    suspect_phone: "",
    suspect_upi: "",
    suspect_bank_account: "",
    suspect_device_id: "",
    suspect_ip: "",
    suspect_email: "",
    amount_lost: 0,
    sender_bank: "",
    receiver_bank: "",
    district: "Mumbai Cyber Cell"
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ["Digital Arrest", "Bank Fraud", "UPI Fraud", "OTP Scam", "Lottery Scam"];
  const districts = ["Mumbai Cyber Cell", "Delhi Cyber Cell", "Bengaluru Cyber Crime", "Hyderabad Crime Branch", "Pune Cyber Cell"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount_lost" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8000/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setFormData({
          title: "",
          description: "",
          scam_category: "Digital Arrest",
          reporter_phone: "",
          reporter_email: "",
          suspect_phone: "",
          suspect_upi: "",
          suspect_bank_account: "",
          suspect_device_id: "",
          suspect_ip: "",
          suspect_email: "",
          amount_lost: 0,
          sender_bank: "",
          receiver_bank: "",
          district: "Mumbai Cyber Cell"
        });
      } else {
        const errData = await response.json();
        setError(errData.detail || "Failed to file report.");
      }
    } catch (err) {
      setError("Unable to connect to the backend server to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-extrabold text-zinc-100 tracking-tight">Report Scam Incident</h2>
        <p className="text-zinc-400 text-sm">
          File a detailed report with coordinates, phone numbers, and transactional records to help investigators trace connection rings.
        </p>
      </div>

      {success && (
        <div className="glass-emerald p-6 rounded-xl border border-emerald-500/25 flex gap-3 items-center animate-fadeIn">
          <CheckCircle className="h-6 w-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-emerald-400">Scam Report Submitted Successfully</h4>
            <p className="text-xs text-zinc-400 mt-1">
              Your case has been logged and the suspicious phone numbers, devices, and UPI identifiers have been registered to our intelligence graph.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="glass-red p-4 rounded-xl border border-red-500/25 text-xs text-red-400 font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: General Details */}
        <div className="glass-card p-6 rounded-xl border border-zinc-850 space-y-4">
          <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-850 pb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-500" /> Incident Description
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Report Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. extortion call from fake CBI agent"
                className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded p-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Scam Category</label>
              <select
                name="scam_category"
                value={formData.scam_category}
                onChange={handleChange}
                className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded p-2.5 text-emerald-400 focus:outline-none focus:border-emerald-500 font-medium"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400">Detailed Narrative</label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain the entire conversation, threats made, links shared, and instructions given by the suspect..."
              className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded p-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Step 2: Suspect Details */}
        <div className="glass-card p-6 rounded-xl border border-zinc-850 space-y-4">
          <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-850 pb-2">
            Suspect Trace Indicators
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Suspect Phone Number</label>
              <input
                type="text"
                name="suspect_phone"
                value={formData.suspect_phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded p-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Suspect UPI ID</label>
              <input
                type="text"
                name="suspect_upi"
                value={formData.suspect_upi}
                onChange={handleChange}
                placeholder="e.g. suspect@ybl"
                className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded p-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Suspect Bank Account</label>
              <input
                type="text"
                name="suspect_bank_account"
                value={formData.suspect_bank_account}
                onChange={handleChange}
                placeholder="e.g. 9988771122"
                className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded p-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Suspect Device Identifier (IMEI)</label>
              <input
                type="text"
                name="suspect_device_id"
                value={formData.suspect_device_id}
                onChange={handleChange}
                placeholder="e.g. IMEI-869234059"
                className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded p-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Suspect IP Address</label>
              <input
                type="text"
                name="suspect_ip"
                value={formData.suspect_ip}
                onChange={handleChange}
                placeholder="e.g. 192.168.1.105"
                className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded p-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Suspect Email Address</label>
              <input
                type="text"
                name="suspect_email"
                value={formData.suspect_email}
                onChange={handleChange}
                placeholder="e.g. scammer@gmail.com"
                className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded p-2.5 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Transaction & Reporter metadata */}
        <div className="glass-card p-6 rounded-xl border border-zinc-850 space-y-4">
          <h3 className="text-sm font-bold text-zinc-200 border-b border-zinc-850 pb-2">
            Transaction details & Local Jurisdiction
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Amount Lost (INR)</label>
              <input
                type="number"
                name="amount_lost"
                value={formData.amount_lost}
                onChange={handleChange}
                className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Your Bank Name</label>
              <input
                type="text"
                name="sender_bank"
                value={formData.sender_bank}
                onChange={handleChange}
                placeholder="e.g. HDFC Bank"
                className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded p-2.5 text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Cyber Cell Jurisdiction</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full text-xs bg-zinc-900 border border-zinc-800 rounded p-2.5 text-zinc-300 focus:outline-none focus:border-emerald-500"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <><Send className="h-4 w-4" /> File Cyber Complaint</>}
          </button>
        </div>
      </form>
    </div>
  );
}
