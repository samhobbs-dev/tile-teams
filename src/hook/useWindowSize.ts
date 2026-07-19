"use client";
import { useState, useEffect } from "react";

interface SizeType {
  height: number;
  width: number;
}

export default function useWindowSize() {
  const [size, setSize] = useState<SizeType>({ height: 0, width: 0 });

  useEffect(() => {
    function updateSize() {
      setSize({ height: window.innerHeight, width: window.innerWidth });
    }
    // Initialize to avoid being 0
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
}
