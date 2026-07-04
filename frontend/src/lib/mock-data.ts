export type RiskLevel = "critical" | "high" | "medium" | "low" | "safe";

export interface AnalysisResult {
  riskScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  scamType: string;
  indicators: string[];
  reasoning: string;
  recommendation: string;
  evidence: string[];
}

export const dashboardStats = [
  { label: "Total Analyses", value: 12847, change: "+12.4%", trend: "up" },
  { label: "Threats Detected", value: 3129, change: "+8.1%", trend: "up" },
  { label: "High Risk", value: 842, change: "-3.2%", trend: "down" },
  { label: "Safe Reports", value: 9718, change: "+14.9%", trend: "up" },
] as const;

export const recentAnalyses = [
  {
    id: "AN-4821",
    type: "Screenshot",
    target: "fake-sbi-kyc-update.png",
    scamType: "Phishing",
    riskScore: 94,
    riskLevel: "critical" as RiskLevel,
    time: "2 min ago",
  },
  {
    id: "AN-4820",
    type: "Text",
    target: "Your electricity will be disconnected tonight...",
    scamType: "Utility Scam",
    riskScore: 88,
    riskLevel: "high" as RiskLevel,
    time: "14 min ago",
  },
  {
    id: "AN-4819",
    type: "URL",
    target: "hdfc-netbanking-verify.xyz",
    scamType: "Fake Banking Site",
    riskScore: 97,
    riskLevel: "critical" as RiskLevel,
    time: "26 min ago",
  },
  {
    id: "AN-4818",
    type: "Audio",
    target: "recorded_call_0412.mp3",
    scamType: "Digital Arrest",
    riskScore: 91,
    riskLevel: "critical" as RiskLevel,
    time: "38 min ago",
  },
  {
    id: "AN-4817",
    type: "Text",
    target: "Hi mom, this is my new number...",
    scamType: "Impersonation",
    riskScore: 62,
    riskLevel: "medium" as RiskLevel,
    time: "1 hr ago",
  },
  {
    id: "AN-4816",
    type: "URL",
    target: "amazon.in/deals/electronics",
    scamType: "None Detected",
    riskScore: 4,
    riskLevel: "safe" as RiskLevel,
    time: "1 hr ago",
  },
  {
    id: "AN-4815",
    type: "Screenshot",
    target: "upi-cashback-offer.jpg",
    scamType: "UPI Fraud",
    riskScore: 79,
    riskLevel: "high" as RiskLevel,
    time: "2 hrs ago",
  },
];

export const threatDistribution = [
  { name: "Phishing", value: 32, fill: "var(--chart-1)" },
  { name: "Digital Arrest", value: 24, fill: "var(--chart-2)" },
  { name: "UPI Fraud", value: 18, fill: "var(--chart-3)" },
  { name: "Fake Banking", value: 15, fill: "var(--chart-4)" },
  { name: "Other", value: 11, fill: "var(--chart-5)" },
];

export const riskTimeline = [
  { date: "Jun 28", high: 42, medium: 78, low: 120 },
  { date: "Jun 29", high: 51, medium: 82, low: 132 },
  { date: "Jun 30", high: 38, medium: 91, low: 141 },
  { date: "Jul 1", high: 64, medium: 88, low: 128 },
  { date: "Jul 2", high: 72, medium: 96, low: 152 },
  { date: "Jul 3", high: 58, medium: 84, low: 148 },
  { date: "Jul 4", high: 81, medium: 102, low: 161 },
];

export const fraudCategories = [
  { category: "Phishing", count: 1024 },
  { category: "Digital Arrest", count: 762 },
  { category: "UPI Fraud", count: 581 },
  { category: "Fake Bank SMS", count: 476 },
  { category: "QR Fraud", count: 318 },
  { category: "Scam Calls", count: 289 },
];

export const activityFeed = [
  {
    id: 1,
    action: "Critical threat blocked",
    detail: "Digital arrest call flagged in Hyderabad region",
    time: "2 min ago",
    severity: "critical" as RiskLevel,
  },
  {
    id: 2,
    action: "New phishing domain indexed",
    detail: "hdfc-netbanking-verify.xyz added to blocklist",
    time: "26 min ago",
    severity: "high" as RiskLevel,
  },
  {
    id: 3,
    action: "Knowledge base updated",
    detail: "RBI advisory on KYC frauds ingested into RAG",
    time: "1 hr ago",
    severity: "low" as RiskLevel,
  },
  {
    id: 4,
    action: "Fraud network expanded",
    detail: "3 new UPI handles linked to existing cluster",
    time: "2 hrs ago",
    severity: "medium" as RiskLevel,
  },
  {
    id: 5,
    action: "Bulk SMS campaign detected",
    detail: "Electricity disconnection scam targeting Maharashtra",
    time: "3 hrs ago",
    severity: "high" as RiskLevel,
  },
];

export const mockScreenshotResult: AnalysisResult = {
  riskScore: 94,
  riskLevel: "critical",
  confidence: 96,
  scamType: "Phishing — Fake Bank KYC",
  indicators: [
    "Sender impersonates SBI official channel",
    "Urgency language: account will be blocked in 24 hours",
    "Shortened URL redirects to non-bank domain",
    "Requests PAN and OTP — banks never ask for OTP",
    "Grammatical inconsistencies typical of scam templates",
  ],
  reasoning:
    "The screenshot displays an SMS claiming to be from SBI requesting immediate KYC verification. The embedded link resolves to a recently registered domain (sbi-kyc-verify.xyz, registered 6 days ago) that is not affiliated with sbi.co.in. The message uses urgency manipulation and requests sensitive credentials, matching 3 known phishing templates in the fraud intelligence database with 92% textual similarity. Visual analysis of the linked page shows a cloned SBI login interface with mismatched branding assets.",
  recommendation:
    "Do NOT click the link or share any OTP, PAN, or banking credentials. Block the sender and report to your bank via official channels (1930 cybercrime helpline). Delete the message.",
  evidence: [
    "Domain registered 6 days ago via privacy-shielded registrar",
    "92% similarity to known phishing template #PT-2214",
    "URL not present in official SBI domain allowlist",
    "OCR extracted text matches 'urgent KYC' scam corpus",
  ],
};

export const mockTextResult: AnalysisResult = {
  riskScore: 88,
  riskLevel: "high",
  confidence: 93,
  scamType: "Utility Disconnection Scam",
  indicators: [
    "Threatens immediate service disconnection",
    "Requests payment via personal UPI ID",
    "Sender number is a 10-digit personal mobile",
    "Official providers never ask payment via personal UPI",
  ],
  reasoning:
    "The message threatens electricity disconnection tonight and directs payment to a personal UPI handle rather than an official collection channel. Legitimate utility providers send notices from registered sender IDs, reference your consumer number, and collect through official gateways. This pattern matches the widespread 'electricity disconnection' scam campaign active since 2022.",
  recommendation:
    "Ignore the payment request. Verify any dues directly on your electricity board's official app or website. Report the number to 1930.",
  evidence: [
    "Payment requested to personal VPA: powerdesk@okaxis",
    "Sender not a registered DLT header",
    "Matches scam corpus cluster 'UTILITY-DISCONNECT-IN'",
  ],
};

export const mockAudioResult: AnalysisResult = {
  riskScore: 91,
  riskLevel: "critical",
  confidence: 89,
  scamType: "Digital Arrest Scam",
  indicators: [
    "Caller claims to be CBI/Police officer",
    "Victim told they are 'under digital arrest'",
    "Demands victim stay on video call and isolate",
    "Requests fund transfer to 'safe government account'",
    "Background call-center noise inconsistent with police station",
  ],
  reasoning:
    "The transcript contains hallmark phrases of digital arrest scams: impersonation of law enforcement, fabricated money-laundering charges linked to the victim's Aadhaar, instructions to remain on continuous video call, and pressure to transfer funds to a 'verification account'. No legitimate Indian law enforcement agency conducts arrests over video calls or requests fund transfers.",
  recommendation:
    "Hang up immediately. Police never arrest over video calls or demand money. Report to cybercrime.gov.in or call 1930. Do not transfer any funds.",
  evidence: [
    "Keyword matches: 'digital arrest', 'safe account', 'money laundering case'",
    "Voice stress patterns consistent with scripted call-center delivery",
    "Callback number traced to VoIP service, not police exchange",
  ],
};

export const mockAudioTranscript = `[00:04] CALLER: Hello, I am Inspector Rajesh Kumar calling from CBI Cyber Cell, Delhi. Am I speaking with the account holder?

[00:12] VICTIM: Yes, speaking. What is this about?

[00:15] CALLER: Sir, a money laundering case has been registered against your Aadhaar number. A parcel containing illegal items was intercepted with your identity documents.

[00:29] VICTIM: What? I never sent any parcel...

[00:32] CALLER: Sir, you are now under digital arrest. Do not disconnect this call. Do not contact anyone. You must remain on video call until verification is complete.

[00:45] CALLER: To prove your innocence, you must transfer your account balance to an RBI safe account for verification. The money will be returned in 48 hours after clearance.`;

export const mockUrlResult: AnalysisResult = {
  riskScore: 97,
  riskLevel: "critical",
  confidence: 98,
  scamType: "Fake Banking Website",
  indicators: [
    "Domain registered 6 days ago",
    "Typosquats official bank domain",
    "No valid extended-validation certificate",
    "Hosted on infrastructure linked to prior phishing campaigns",
    "Login form posts credentials to third-party server",
  ],
  reasoning:
    "The URL hdfc-netbanking-verify.xyz imitates HDFC Bank's netbanking portal. The official domain is hdfcbank.com; this domain was registered less than a week ago through a privacy-shielded registrar and is hosted on an ASN previously associated with 14 confirmed phishing sites. The page source posts login credentials to an external endpoint, confirming credential-harvesting intent.",
  recommendation:
    "Do not enter any credentials. If you already did, change your netbanking password immediately and contact HDFC Bank. Report the URL to cybercrime.gov.in.",
  evidence: [
    "WHOIS: created 6 days ago, registrant hidden",
    "ASN linked to 14 confirmed phishing incidents",
    "Certificate: free DV cert issued 5 days ago",
    "Form action posts to unrelated .ru endpoint",
  ],
};

export const knowledgeDocuments = [
  {
    id: "rbi-001",
    title: "RBI Advisory: KYC Update Frauds",
    source: "Reserve Bank of India",
    category: "RBI Advisories",
    date: "2026-05-18",
    excerpt:
      "The Reserve Bank cautions members of public against frauds in the name of KYC updation. Customers are advised not to share account login credentials, card information, PINs or OTPs with unidentified persons.",
    content: `The Reserve Bank of India has been receiving complaints and reports about customers falling prey to frauds being perpetrated in the name of KYC updation.

The usual modus operandi in such cases includes receipt of unsolicited communication such as calls, SMS, emails, etc., by the customer, urging them to share certain personal details, account or login details, card information, PIN, OTP, or install some unauthorised or unverified application for KYC updation using a link provided in the communication.

Such communications also carry threats of account freeze, blocking or closure. Once a customer shares information over calls, messages or unauthorised applications, fraudsters get access to the customer's account and defraud them.

Key recommendations:
1. Banks never ask for OTP, PIN or passwords over calls or SMS.
2. Approach your bank branch directly for any KYC updation requirement.
3. Do not click on links received in unsolicited messages.
4. Do not download unverified applications on the advice of unknown callers.
5. Report any fraud immediately to the National Cyber Crime helpline 1930.`,
  },
  {
    id: "cert-001",
    title: "CERT-In Alert: Phishing Campaigns Targeting Banking Users",
    source: "CERT-In",
    category: "CERT-In",
    date: "2026-04-02",
    excerpt:
      "CERT-In has observed large-scale phishing campaigns using typosquatted banking domains and SMS spoofing to harvest netbanking credentials of Indian users.",
    content: `The Indian Computer Emergency Response Team (CERT-In) has observed ongoing phishing campaigns targeting customers of major Indian banks.

Attack vectors observed:
- Typosquatted domains imitating official netbanking portals
- SMS spoofing using headers similar to official bank sender IDs
- Malicious APK files distributed via WhatsApp claiming to be bank apps
- QR codes that initiate collect requests instead of payments

Indicators of compromise include newly registered domains with free DV certificates, credential forms posting to third-party endpoints, and APKs requesting SMS-read permissions.

Recommended countermeasures:
1. Type your bank URL manually; never follow links from SMS or email.
2. Verify app publishers on official app stores before installing.
3. Remember: scanning a QR code is for PAYING money, never for receiving.
4. Enable transaction alerts and review statements regularly.`,
  },
  {
    id: "cyber-001",
    title: "Understanding Digital Arrest Scams",
    source: "I4C — Indian Cybercrime Coordination Centre",
    category: "Cybercrime",
    date: "2026-03-11",
    excerpt:
      "Digital arrest is a scam where fraudsters impersonate law enforcement over video calls, fabricate criminal cases, and coerce victims into transferring money to so-called safe accounts.",
    content: `"Digital arrest" is not a legal concept. No law enforcement agency in India arrests individuals over video calls or keeps them under surveillance via video conferencing.

Modus operandi:
1. Victim receives a call claiming a parcel with contraband was booked in their name, or their Aadhaar/phone is linked to a money laundering case.
2. Call is escalated to a fake "senior officer" over video, often in a staged police-station backdrop with uniforms and props.
3. Victim is told they are under "digital arrest" and must not contact anyone.
4. Victim is coerced into transferring funds to a "safe account" or "RBI verification account" to prove innocence.

Red flags:
- Law enforcement never conducts interrogation over WhatsApp/Skype video calls.
- There is no provision called digital arrest in Indian law.
- Government agencies never ask for money transfers for verification.

If targeted: disconnect immediately, note the number, and report to 1930 or cybercrime.gov.in.`,
  },
  {
    id: "bank-001",
    title: "Banking Safety: UPI Fraud Prevention Guide",
    source: "NPCI Guidelines",
    category: "Banking Safety",
    date: "2026-02-20",
    excerpt:
      "Practical guidance for safe UPI usage: understand collect requests, verify VPAs before payment, and never share your UPI PIN with anyone including bank staff.",
    content: `UPI fraud prevention essentials:

1. UPI PIN is only for SENDING money. If someone asks you to enter your PIN to RECEIVE money, it is a scam.
2. Collect request fraud: fraudsters send a collect request labelled as "refund" or "cashback". Approving it debits your account.
3. QR code fraud: scanning a QR code and entering your PIN pays money out of your account. QR codes are never needed to receive funds.
4. Verify the payee name displayed before confirming any transaction.
5. Never share the OTP or UPI PIN with anyone, including callers claiming to be from your bank or NPCI.
6. Screen-sharing apps (AnyDesk, TeamViewer) allow fraudsters to watch you enter credentials. Never install them on the instruction of a caller.
7. Register complaints at 1930 within the golden hour to maximise recovery chances.`,
  },
  {
    id: "rbi-002",
    title: "RBI: Safe Digital Banking Practices",
    source: "Reserve Bank of India",
    category: "RBI Advisories",
    date: "2026-01-15",
    excerpt:
      "BE(A)WARE — A booklet on modus operandi of financial frauds covering phishing, vishing, remote access frauds, and money mule operations.",
    content: `Common fraud typologies and safe practices:

Phishing: Fraudulent emails/SMS with links to fake websites. Always verify the domain and look for official URLs.

Vishing: Voice calls impersonating bank officials, RBI, or police. Banks never call asking for credentials.

Remote access fraud: Victims are tricked into installing screen-sharing apps, exposing OTPs and PINs.

SIM swap: Fraudsters obtain a duplicate SIM to intercept OTPs. Sudden loss of mobile network can be an indicator — contact your operator immediately.

Money mules: Criminals use others' accounts to launder fraud proceeds. Never lend your account or accept unknown credits followed by transfer requests.

Golden rules:
- Your bank will never ask for your password, PIN, OTP or CVV.
- Do not act on unsolicited urgent payment requests.
- Report unauthorised transactions to your bank immediately — liability is limited if reported within 3 days.`,
  },
  {
    id: "cyber-002",
    title: "Cybercrime Reporting: How to Use Helpline 1930",
    source: "Ministry of Home Affairs",
    category: "Cybercrime",
    date: "2025-12-08",
    excerpt:
      "The national cybercrime helpline 1930 enables immediate reporting of financial frauds, triggering the Citizen Financial Cyber Fraud Reporting system to freeze fraudulent transactions.",
    content: `The 1930 helpline connects to the Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS), which coordinates between banks, wallets, and law enforcement in real time.

How it works:
1. Call 1930 immediately after discovering a fraudulent transaction.
2. Provide transaction details: amount, time, account/UPI details of receiver if known.
3. The system alerts the beneficiary bank to freeze the fraudulent funds in transit.
4. A formal complaint is registered on cybercrime.gov.in with a tracking ID.

The "golden hour" matters: funds are typically layered across multiple accounts within hours. Reporting within the first hour dramatically increases recovery probability.

You can also report non-financial cybercrimes (stalking, impersonation, obscene content) directly at cybercrime.gov.in.`,
  },
];

export const networkNodes = [
  { id: "victim-1", label: "Victim", type: "Victim", x: 20, y: 45 },
  { id: "phone-1", label: "+91 98XXX 21453", type: "Phone", x: 40, y: 20 },
  { id: "phone-2", label: "+91 73XXX 88104", type: "Phone", x: 42, y: 68 },
  { id: "upi-1", label: "powerdesk@okaxis", type: "UPI", x: 62, y: 32 },
  { id: "upi-2", label: "refundhelp@ybl", type: "UPI", x: 64, y: 78 },
  { id: "bank-1", label: "A/C ****4821 (Axis)", type: "Bank", x: 82, y: 25 },
  { id: "device-1", label: "Device IMEI ****9917", type: "Device", x: 58, y: 55 },
  { id: "location-1", label: "Jamtara, JH", type: "Location", x: 84, y: 60 },
];

export const networkEdges = [
  { from: "victim-1", to: "phone-1", label: "received call" },
  { from: "victim-1", to: "phone-2", label: "received SMS" },
  { from: "phone-1", to: "upi-1", label: "linked VPA" },
  { from: "phone-2", to: "upi-2", label: "linked VPA" },
  { from: "upi-1", to: "bank-1", label: "settles to" },
  { from: "upi-2", to: "bank-1", label: "settles to" },
  { from: "phone-1", to: "device-1", label: "active on" },
  { from: "phone-2", to: "device-1", label: "active on" },
  { from: "device-1", to: "location-1", label: "last seen" },
];

export const entityDetails: Record<
  string,
  {
    label: string;
    type: string;
    riskScore: number;
    firstSeen: string;
    connections: string[];
    timeline: { date: string; event: string }[];
  }
> = {
  "victim-1": {
    label: "Victim",
    type: "Victim",
    riskScore: 0,
    firstSeen: "2026-07-01",
    connections: ["+91 98XXX 21453", "+91 73XXX 88104"],
    timeline: [
      { date: "Jul 1, 10:42", event: "Received digital arrest call" },
      { date: "Jul 1, 11:15", event: "Received follow-up SMS with UPI request" },
      { date: "Jul 1, 11:40", event: "Reported incident via FraudShield" },
    ],
  },
  "phone-1": {
    label: "+91 98XXX 21453",
    type: "Phone",
    riskScore: 92,
    firstSeen: "2026-06-12",
    connections: ["powerdesk@okaxis", "Device IMEI ****9917", "Victim"],
    timeline: [
      { date: "Jun 12", event: "First flagged in scam call report" },
      { date: "Jun 20", event: "Linked to 14 additional victim reports" },
      { date: "Jul 1", event: "Used in digital arrest call to victim" },
    ],
  },
  "phone-2": {
    label: "+91 73XXX 88104",
    type: "Phone",
    riskScore: 84,
    firstSeen: "2026-06-18",
    connections: ["refundhelp@ybl", "Device IMEI ****9917", "Victim"],
    timeline: [
      { date: "Jun 18", event: "First seen in bulk SMS campaign" },
      { date: "Jul 1", event: "Sent UPI collect request to victim" },
    ],
  },
  "upi-1": {
    label: "powerdesk@okaxis",
    type: "UPI",
    riskScore: 95,
    firstSeen: "2026-06-10",
    connections: ["+91 98XXX 21453", "A/C ****4821 (Axis)"],
    timeline: [
      { date: "Jun 10", event: "VPA created" },
      { date: "Jun 14", event: "First fraudulent collect request reported" },
      { date: "Jun 28", event: "₹4.2L in flagged inflows across 31 victims" },
    ],
  },
  "upi-2": {
    label: "refundhelp@ybl",
    type: "UPI",
    riskScore: 89,
    firstSeen: "2026-06-16",
    connections: ["+91 73XXX 88104", "A/C ****4821 (Axis)"],
    timeline: [
      { date: "Jun 16", event: "VPA created" },
      { date: "Jun 22", event: "Linked to fake refund campaign" },
    ],
  },
  "bank-1": {
    label: "A/C ****4821 (Axis)",
    type: "Bank",
    riskScore: 97,
    firstSeen: "2026-06-10",
    connections: ["powerdesk@okaxis", "refundhelp@ybl"],
    timeline: [
      { date: "Jun 10", event: "Account linked to first flagged VPA" },
      { date: "Jun 30", event: "Freeze requested via CFCFRMS" },
      { date: "Jul 2", event: "Account frozen by issuing bank" },
    ],
  },
  "device-1": {
    label: "Device IMEI ****9917",
    type: "Device",
    riskScore: 90,
    firstSeen: "2026-06-12",
    connections: ["+91 98XXX 21453", "+91 73XXX 88104", "Jamtara, JH"],
    timeline: [
      { date: "Jun 12", event: "Device fingerprint first recorded" },
      { date: "Jun 25", event: "SIM rotation pattern detected (4 SIMs)" },
    ],
  },
  "location-1": {
    label: "Jamtara, JH",
    type: "Location",
    riskScore: 76,
    firstSeen: "2026-06-12",
    connections: ["Device IMEI ****9917"],
    timeline: [
      { date: "Jun 12", event: "Cell tower triangulation places device" },
      { date: "Jul 2", event: "Cluster of 3 related devices in same area" },
    ],
  },
};

export const landingStats = [
  { label: "Scams Analyzed", value: 12847 },
  { label: "Threats Blocked", value: 3129 },
  { label: "Detection Accuracy", value: 96, suffix: "%" },
  { label: "Knowledge Sources", value: 240 },
];
