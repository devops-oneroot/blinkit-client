"use client";
import React, { useState } from "react";
import { User, Lock, AlertCircle, Loader2 } from "lucide-react";
import { Logo } from "./Shared";
import { api } from "./api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Call Python Backend
    const response = await api.login(username, password);

    if (response.success) {
      onLogin(response.user);
    } else {
      setError("Invalid credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
       {/* Background Decor */}
       <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50" />
       <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl opacity-50" />

       <div className="w-full max-w-md bg-card border border-border/50 shadow-2xl rounded-3xl p-8 relative z-10 animate-scale-in">
        <div className="mb-8 text-center">
          <Logo large />
          <h2 className="text-xl font-bold text-foreground mt-6">Operator Login</h2>
          <p className="text-sm text-muted-foreground mt-1">Secure Logistics Access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
             <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Username</label>
             <div className="relative group">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
               <input type="text" placeholder="Enter ID" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" />
             </div>
          </div>
          <div className="space-y-1">
             <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Password</label>
             <div className="relative group">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
               <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-secondary/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium" />
             </div>
          </div>
          {error && (<div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg animate-fade-in"><AlertCircle className="w-4 h-4" />{error}</div>)}
          <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2">{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}</button>
        </form>
      </div>
    </div>
  );
}