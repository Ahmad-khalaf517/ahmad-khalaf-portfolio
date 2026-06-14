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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // ignore silently
    }
  };

  // check on app load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkVersion();

    // optional light polling (safe: 1 min)
    intervalRef.current = setInterval(checkVersion, 1 * 60 * 1000);

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