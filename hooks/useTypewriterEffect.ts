"use client";

import { useState, useEffect } from "react";

interface UseTypewriterEffectOptions {
  text: string;
  speed?: number;
  delay?: number;
}

export function useTypewriterEffect({ 
  text, 
  speed = 50, 
  delay = 0 
}: UseTypewriterEffectOptions) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayText("");
      setIsComplete(false);
      return;
    }

    setDisplayText("");
    setIsComplete(false);

    let startTimeout: NodeJS.Timeout;
    let typeTimer: NodeJS.Timeout;

    startTimeout = setTimeout(() => {
      let index = 0;
      
      typeTimer = setInterval(() => {
        setDisplayText(text.slice(0, index + 1));
        index++;
        
        if (index >= text.length) {
          clearInterval(typeTimer);
          setIsComplete(true);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (typeTimer) {
        clearInterval(typeTimer);
      }
    };
  }, [text, speed, delay]);

  return { displayText, isComplete };
}