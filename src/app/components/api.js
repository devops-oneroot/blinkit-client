// src/app/components/api.js

// MAKE SURE THIS IS YOUR CURRENT NGROK URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { 
    "Authorization": token ? `Bearer ${token}` : "",
    "ngrok-skip-browser-warning": "true", 
    "Content-Type": "application/json"
  };
};

export const api = {
  login: async (username, password) => {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not set. Please configure NEXT_PUBLIC_API_BASE_URL environment variable.");
      return { error: "API endpoint not configured" };
    }

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "ngrok-skip-browser-warning": "true" 
        },
        body: formData,
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = "Login failed";
        
        if (res.status === 401) {
          errorMessage = "Invalid username or password";
        } else if (res.status === 404) {
          errorMessage = "Login endpoint not found. Please check API URL.";
        } else {
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.detail || errorData.message || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
        }
        
        console.error(`Login Error (${res.status}):`, errorMessage);
        return { error: errorMessage };
      }
      
      const data = await res.json();
      if (!data.access_token) {
        console.error("Login response missing access_token:", data);
        return { error: "Invalid response from server" };
      }
      
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", username);
      return { success: true, user: username };
    } catch (error) {
      console.error("Login Error:", error);
      return { error: error.message || "Network error. Please check your connection." };
    }
  },

  updateTruck: async (truckNumber) => {
    try {
      const res = await fetch(`${API_BASE_URL}/update_truck`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ truck_number: truckNumber }),
      });
      if (!res.ok) throw new Error("Truck update failed");
      return { success: true };
    } catch (error) {
      console.error("Update Truck Error:", error);
      return { error: error.message };
    }
  },

  startRecording: async () => {
    try {
      console.log("Calling Start API...");
      const res = await fetch(`${API_BASE_URL}/start`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      console.log("Start API Status:", res.status);
      return await res.json();
    } catch (error) {
      console.error("Start Recording Error:", error);
      return { status: "error" };
    }
  },

  stopRecording: async () => {
    try {
      console.log("Calling Stop API...");
      const res = await fetch(`${API_BASE_URL}/stop`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      console.log("Stop API Status:", res.status);
      return await res.json();
    } catch (error) {
      console.error("Stop Recording Error:", error);
      return { status: "error" };
    }
  },

  getCount: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/count`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if(res.ok) {
        const data = await res.json();
        return data.count;
      }
      return 0;
    } catch (error) {
      return 0;
    }
  },

  // ✅ FIXED FUNCTION
  getYoutubeLink: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/youtube`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        // Updated to use the correct key from your backend
        return data.youtube_url; 
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch video URL:", error);
      return null;
    }
  },
  
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("truckNumber");
  }
};