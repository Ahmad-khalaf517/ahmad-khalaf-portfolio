// hooks/useAppVersion.ts
import { useEffect, useRef, useState } from "react";

const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID;

export function useAppVersion() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkVersion = async () => {
    try {
      const res = await fetch("/api/version", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.version && data.version !== BUILD_ID) {
        setHasUpdate(true);
      }
    } catch (err) {
      // ignore silently
    }
  };

  // check on app load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkVersion();

    // optional light polling (safe: 5–10 min)
    intervalRef.current = setInterval(checkVersion, 5 * 60 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    hasUpdate,
    refresh: () => window.location.reload(),
    checkVersion,
  };
}