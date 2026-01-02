"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, X, ArrowRight, Loader2 } from "lucide-react";
import { api } from "./api"; 

export const cn = (...classes) => classes.filter(Boolean).join(" ");

// --- HELPER: CONVERT ANY YOUTUBE LINK TO EMBED ---
const getEmbedUrl = (url) => {
  if (!url) return "";
  
  let videoId = "";

  // Case 1: Standard URL (youtube.com/watch?v=ID)
  if (url.includes("v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  } 
  // Case 2: Live URL (youtube.com/live/ID)
  else if (url.includes("/live/")) {
    videoId = url.split("/live/")[1].split("?")[0];
  }
  // Case 3: Short URL (youtu.be/ID)
  else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }
  // Case 4: Already Embed (youtube.com/embed/ID)
  else if (url.includes("/embed/")) {
    return `${url}?autoplay=1&mute=1`;
  }

  // Fallback: If we found an ID, make the embed link
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
  }

  return url; // Return original if we can't figure it out
};

export const Logo = ({ large = false, onClick }) => (
  <div onClick={onClick} className={cn("relative transition-all select-none", onClick ? "cursor-pointer hover:opacity-80 active:scale-95" : "")}>
    <img src="/logo.svg" alt="Blinkit Logo" className={cn("object-contain transition-all", large ? "h-16 md:h-24 mx-auto" : "h-8 md:h-12")} />
  </div>
);

export const LiveBadge = () => (
  <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-success/10 rounded-full border border-success/20 shadow-sm">
    <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-success"></span>
    </span>
    <span className="text-xs md:text-sm font-medium text-success whitespace-nowrap">Live Ops</span>
  </div>
);

// --- UPDATED STREAM MODAL WITH SMART CONVERTER ---
export const StreamModal = ({ isOpen, onClose }) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      api.getYoutubeLink().then((url) => {
        if (url) {
          // USE THE NEW HELPER FUNCTION HERE
          const safeUrl = getEmbedUrl(url);
          setVideoUrl(safeUrl);
        }
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-4 md:p-8">
      <div className="bg-card w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <div className="aspect-video w-full bg-black flex items-center justify-center">
            {isLoading ? (
                <div className="flex flex-col items-center gap-3 text-white/70">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p>Connecting to Truck Camera...</p>
                </div>
            ) : videoUrl ? (
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={videoUrl} 
                    title="Live Stream" 
                    allow="autoplay; encrypted-media; picture-in-picture" 
                    allowFullScreen 
                    className="w-full h-full"
                ></iframe>
            ) : (
                <div className="text-white/50 flex flex-col items-center">
                    <p>Signal Lost or No URL provided.</p>
                </div>
            )}
        </div>

        <div className="p-4 md:p-6 bg-background border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
                <h3 className="font-bold text-lg md:text-xl">Live Feed: Dock 02</h3>
                <p className="text-sm text-muted-foreground">Camera ID: CAM-04-NORTH</p>
            </div>
            <div className="flex items-center gap-2 text-red-500 animate-pulse bg-red-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs font-bold uppercase tracking-wider">Live Signal</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export const SuccessAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-bounce-in"><div className="w-20 h-20 md:w-24 md:h-24 bg-success rounded-full flex items-center justify-center shadow-lg"><CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-success-foreground" /></div></div>
      <p className="text-xl md:text-2xl font-semibold text-foreground mt-6 animate-fade-in">Entry Recorded!</p>
      <p className="text-muted-foreground mt-2 animate-fade-in">Syncing with Server...</p>
    </div>
  );
};

export const StatCard = ({ icon: Icon, label, value, subtext, highlight }) => (
  <div className={cn("bg-card rounded-2xl p-5 md:p-6 shadow-card transition-all duration-300 border border-border/50", highlight ? "ring-2 ring-primary/20 bg-primary/5" : "hover:shadow-card-hover")}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        <p className={cn("text-2xl md:text-3xl font-bold mt-2 font-mono", highlight ? "text-primary" : "text-foreground")}>{value || "--"}</p>
        {subtext && (<p className="text-xs text-success mt-2 flex items-center gap-1"><ArrowRight className="w-3 h-3 rotate-[-45deg]" />{subtext}</p>)}
      </div>
      <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center", highlight ? "bg-primary text-white" : "bg-primary/10 text-primary")}><Icon className="w-5 h-5 md:w-6 md:h-6" /></div>
    </div>
  </div>
);

export const StatusBadge = ({ status }) => {
  const styles = { done: "bg-success/10 text-success border-success/20", unloading: "bg-warning/10 text-warning border-warning/20", pending: "bg-muted text-muted-foreground border-border" };
  const labels = { done: "Done", unloading: "Unloading", pending: "Pending" };
  return (<span className={cn("px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap", styles[status])}>{labels[status]}</span>);
};