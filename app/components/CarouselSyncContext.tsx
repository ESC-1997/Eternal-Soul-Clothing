"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface CarouselSyncContextType {
  currentIndex: number;
  pause: () => void;
  resume: () => void;
}

const CarouselSyncContext = createContext<CarouselSyncContextType | undefined>(undefined);

export const useCarouselSync = () => {
  const ctx = useContext(CarouselSyncContext);
  if (!ctx) throw new Error("useCarouselSync must be used within a CarouselSyncProvider");
  return ctx;
};

export const CarouselSyncProvider = ({ children, imageCount = 15 }: { children: React.ReactNode; imageCount?: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % imageCount);
      }, 6000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, imageCount]);

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  return (
    <CarouselSyncContext.Provider value={{ currentIndex, pause, resume }}>
      {children}
    </CarouselSyncContext.Provider>
  );
}; 
