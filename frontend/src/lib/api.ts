/**
 * Global API URL configurations for FraudShield AI platform.
 * Dynamically resolves production hosts on Vercel deployments.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
