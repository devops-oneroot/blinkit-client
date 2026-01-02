"use client";
import React, { useState } from "react";
import { Truck, Loader2, AlertCircle, ArrowRight, LogOut } from "lucide-react";
import { Logo, SuccessAnimation, cn } from "./Shared";
import { api } from "./api";

export default function TruckEntry({ onComplete, onLogout }) {
  const [truckNumber, setTruckNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleTruckNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setTruckNumber(value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(truckNumber)) {
      setError("Please enter the last 4 digits (e.g., 1234)");
      return;
    }

    setIsLoading(true);

    // Call Python Backend to update truck
    const response = await api.updateTruck(truckNumber);

    if (response.success) {
      setIsSuccess(true);
      setTimeout(() => {
          // Pass truckNumber to Dashboard (manualCount is not used)
          onComplete({ truckNumber }); 
      }, 1500);
    } else {
      setError("Failed to update truck on server.");
      setIsLoading(false);
    }
  };

  if (isSuccess) return <SuccessAnimation onComplete={() => {}} />;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-md relative">
        <button onClick={onLogout} className="absolute top-0 right-0 -mt-12 text-sm text-muted-foreground hover:text-destructive flex items-center gap-2 transition-colors z-20">
            <LogOut className="w-4 h-4" /> Sign Out
        </button>

        <div className="bg-card rounded-3xl shadow-medium p-6 md:p-8 border border-border/50 animate-scale-in">
            <div className="text-center mb-8 md:mb-10">
               <Logo large={true} />
               <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="h-px w-8 bg-border"></div>
                  <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-widest">Inbound Logistics Portal</span>
                  <div className="h-px w-8 bg-border"></div>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Truck Number (Last 4 Digits)</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" value={truckNumber} onChange={handleTruckNumberChange} placeholder="1234" className={cn("w-full px-4 py-4 bg-secondary/50 border rounded-xl text-2xl text-center font-mono tracking-[0.5em] text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all", error && "border-destructive focus:ring-destructive/50")} disabled={isLoading} />
                  <Truck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-50" />
                </div>
              </div>

              {error && (<div className="flex items-center gap-2 text-destructive text-sm animate-fade-in"><AlertCircle className="w-4 h-4" />{error}</div>)}

              <button type="submit" disabled={isLoading} className={cn("w-full py-4 bg-accent text-accent-foreground rounded-xl font-semibold text-lg shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2", isLoading && "opacity-80 cursor-not-allowed hover:transform-none")}>
                {isLoading ? <><Loader2 className="w-5 h-5 animate-spin-slow" />Processing...</> : <>Submit Entry<ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
        </div>
      </div>
    </div>
  );
}