
import { useState, useEffect } from "react";

/**
 * Hook personnalisé pour suivre l'état d'une media query CSS.
 * @param query - La chaîne de la media query (ex: '(max-width: 768px)').
 * @returns boolean - `true` si la query correspond, sinon `false`.
 */
function useMediaQuery(query: string): boolean {
  // S'assure que `window` est défini (évite les erreurs côté serveur)
  const isWindowClient = typeof window === "object";

  const [matches, setMatches] = useState<boolean>(
    isWindowClient ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (!isWindowClient) {
      return;
    }

    const mediaQueryList = window.matchMedia(query);
    
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // La méthode recommandée est `addEventListener`
    mediaQueryList.addEventListener("change", listener);

    // Nettoyage de l'écouteur au démontage du composant
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query, isWindowClient]);

  return matches;
}

export default useMediaQuery;