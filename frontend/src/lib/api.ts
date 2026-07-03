const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Fallback to production backend on Render when deployed
  if (typeof window !== "undefined") {
    if (window.location.hostname !== "localhost" && !window.location.hostname.includes("127.0.0.1")) {
      return "https://fraudshield-backend-jkp0.onrender.com";
    }
  }
  
  return "http://localhost:8000";
};

export const API_URL = getApiUrl();
