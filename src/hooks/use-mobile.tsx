
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Update the state initially
    setMatches(media.matches);
    
    // Define a callback function to handle changes
    const listener = () => setMatches(media.matches);
    
    // Add the callback as a listener
    media.addEventListener("change", listener);
    
    // Remove the listener when the component unmounts
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

// Add useIsMobile hook that leverages useMediaQuery for mobile detection
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}
