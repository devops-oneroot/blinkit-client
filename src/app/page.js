"use client";
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import TruckEntry from "./components/TruckEntry";
import Dashboard from "./components/Dashboard";
import { api } from "./components/api"; 
import { Loader2 } from "lucide-react"; 

export default function LogisticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login"); 
  const [sessionData, setSessionData] = useState({ truckNumber: "" });

  // 1. CHECK BOTH USER AND TRUCK ON LOAD
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTruck = localStorage.getItem("truckNumber"); // <--- NEW CHECK
    
    if (storedUser) {
      setUser(storedUser);
      
      // If we remember a truck, go straight to Dashboard
      if (storedTruck) {
        setSessionData({ truckNumber: storedTruck });
        setView("dashboard");
      } else {
        setView("form");
      }
    }
    
    setIsLoading(false);
  }, [setUser, setView]); 

  // --- ACTIONS ---
  
  const handleLogin = (username) => {
    setUser(username);
    setView("form");
    localStorage.setItem("user", username);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setView("login");
    setSessionData({ truckNumber: "" });
    localStorage.removeItem("truckNumber"); // <--- CLEAR TRUCK ON LOGOUT
  };

  const handleTruckSubmit = (data) => {
    setSessionData(data);
    setView("dashboard");
    localStorage.setItem("truckNumber", data.truckNumber); // <--- SAVE TRUCK
  };

  const handleNewEntry = () => {
    setSessionData({ truckNumber: "" });
    setView("form");
    localStorage.removeItem("truckNumber"); // <--- CLEAR TRUCK FOR NEW ENTRY
  };

  // --- RENDER LOGIC ---

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Login onLogin={handleLogin} />;
  
  return (
    <>
      {view === "form" && <TruckEntry onComplete={handleTruckSubmit} onLogout={handleLogout} />}
      {view === "dashboard" && <Dashboard data={sessionData} onNewEntry={handleNewEntry} onLogout={handleLogout} />}
    </>
  );
}