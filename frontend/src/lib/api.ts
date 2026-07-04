const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const API_URL = rawApiUrl.replace(/\/$/, "");
