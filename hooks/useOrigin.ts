import { useState, useEffect } from "react";
export default function useOrigin() {
  const [isMounted, setIsMounted] = useState(false);
  const origin =
    typeof window !== "undefined" && window.location
      ? window.location.origin
      : "";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return origin;
}
