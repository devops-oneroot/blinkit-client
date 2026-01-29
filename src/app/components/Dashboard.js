"use client";
import React, { useState, useEffect } from "react";
import { Truck, ScanEye, Play, Square, Loader2, CheckCircle, LogOut } from "lucide-react";
import { Logo, LiveBadge, StatCard, StatusBadge, StreamModal, cn } from "./Shared";
import { api } from "./api"; 

export default function Dashboard({ data, onNewEntry, onLogout }) {
  const { truckNumber } = data;
  const [cvCount, setCvCount] = useState(0); 
  const [isStreamOpen, setIsStreamOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState("idle"); 

  // POLL THE PYTHON BACKEND
  useEffect(() => {
    const fetchCount = async () => {
      const count = await api.getCount();
      setCvCount(count);
    };

    fetchCount(); // Fetch immediately on load

    // Poll every 2 minutes (120000 ms)
    const interval = setInterval(fetchCount, 120000); 
    
    return () => clearInterval(interval);
  }, []);

  // --- HANDLERS WITH SAFETY LOGIC ---

  const handleStartServer = async () => {
    if (serverStatus === "running") return;
    setServerStatus("starting");
    try {
      await api.startRecording();
      setServerStatus("running");
    } catch (error) {
      console.error("Failed to start:", error);
      setServerStatus("idle"); 
    }
  };

  const handleStopServer = async () => {
    if (serverStatus === "idle") return;
    setServerStatus("stopping");
    try {
      await api.stopRecording();
      setServerStatus("idle");
    } catch (error) {
      console.error("Failed to stop:", error);
      setServerStatus("running"); 
    }
  };

  const handleTerminate = async () => {
    await handleStopServer();
    console.log("Terminate clicked");
  };

  const handleViewInvoice = () => {
    // TODO: Navigate to invoice view when available
    console.log("View Invoice clicked");
  };

  return (
    <div className="min-h-screen bg-background relative">
      <StreamModal isOpen={isStreamOpen} onClose={() => setIsStreamOpen(false)} />

      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
          <Logo onClick={onNewEntry} />
          <div className="flex items-center gap-4">
            <LiveBadge />
            <button
              type="button"
              onClick={() => {}}
              className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-border text-xs md:text-sm font-medium text-foreground bg-background hover:bg-muted transition-colors"
            >
              History
            </button>
            <button onClick={onLogout} className="text-muted-foreground hover:text-destructive transition-colors p-2" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
        
        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
            <StatCard icon={Truck} label="Truck No." value={truckNumber} subtext="Unloading Now" highlight={true} />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
            <StatCard icon={ScanEye} label="Computer Vision Count" value={cvCount} subtext="Live from Python Backend" />
          </div>
        </div>

        {/* SERVER CONTROLS */}
        <div className="bg-card border border-border rounded-2xl p-5 md:p-6 mb-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
           <div className="flex flex-col">
               <h3 className="font-bold text-2xl md:text-3xl text-foreground font-mono tracking-tight">Truck {truckNumber}</h3>
               <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">Status: <span className={cn("font-semibold uppercase", serverStatus === "running" ? "text-success" : "text-muted-foreground")}>{serverStatus === "idle" ? "Stopped" : serverStatus}</span></p>
           </div>
           <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full md:w-auto">
               <button onClick={handleStartServer} disabled={serverStatus === "running" || serverStatus === "starting"} className={cn("flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-lg transition-all transform active:scale-95 w-full sm:w-auto", serverStatus === "running" ? "bg-secondary text-black cursor-not-allowed opacity-50" : "bg-success text-black hover:bg-success/90 shadow-lg shadow-success/20")}>
                   {serverStatus === "starting" ? <Loader2 className="w-6 h-6 animate-spin"/> : <Play className="w-6 h-6 fill-current" />} Start
               </button>
               <button onClick={handleStopServer} disabled={serverStatus === "idle" || serverStatus === "stopping"} className={cn("flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-lg transition-all transform active:scale-95 w-full sm:w-auto", serverStatus === "idle" ? "bg-secondary text-black cursor-not-allowed opacity-50" : "bg-destructive text-black hover:bg-destructive/90 shadow-lg shadow-destructive/20")}>
                   {serverStatus === "stopping" ? <Loader2 className="w-6 h-6 animate-spin"/> : <Square className="w-6 h-6 fill-current" />} Stop
               </button>
               <button
                 type="button"
                 onClick={handleTerminate}
                 className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-lg transition-all transform active:scale-95 w-full sm:w-auto bg-secondary text-black hover:bg-secondary/80"
               >
                 Terminate
               </button>
               <button
                 type="button"
                 onClick={handleViewInvoice}
                 className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-lg transition-all transform active:scale-95 w-full sm:w-auto bg-secondary text-black hover:bg-secondary/80"
               >
                 View Invoice
               </button>
           </div>
        </div>

        {/* NEW ENTRY BANNER */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0"><CheckCircle className="w-5 h-5 text-primary-foreground" /></div>
            <div><p className="font-medium text-foreground">Entry Logged Successfully</p><p className="text-sm text-muted-foreground">Truck {truckNumber}</p></div>
          </div>
          <button onClick={onNewEntry} className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"><Truck className="w-4 h-4" /> New Entry</button>
        </div>

        {/* LIVE TABLE */}
        <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="px-6 py-4 border-b border-border flex items-center justify-between"><div><h2 className="text-lg font-semibold text-foreground">Session Entries</h2><p className="text-sm text-muted-foreground">Live logs</p></div></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-secondary/30">
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stream</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Truck No</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">CV Count</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                  <tr className="bg-primary/5 hover:bg-primary/10 transition-colors animate-pulse-soft">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap"><button onClick={() => setIsStreamOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-border rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"><Play className="w-3.5 h-3.5 fill-current" />Watch Live</button></td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap font-mono text-sm font-medium text-foreground">{truckNumber}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-foreground font-semibold text-primary">{cvCount}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap"><StatusBadge status="unloading" /></td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}