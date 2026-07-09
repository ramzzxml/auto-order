"use client";

import { useEffect, useState } from "react";

export function CountdownTimer({
  expiredAt,
  onExpire
}: {
  expiredAt: string;
  onExpire?: () => void;
}) {
  const [remaining, setRemaining] = useState<number>(() =>
    Math.max(0, new Date(expiredAt).getTime() - Date.now())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, new Date(expiredAt).getTime() - Date.now());
      setRemaining(diff);
      if (diff <= 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiredAt, onExpire]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <div className="text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">Expires in</p>
      <p
        className={`text-2xl font-bold tabular-nums ${
          remaining <= 60000 ? "text-red-600" : "text-brand-600 dark:text-brand-400"
        }`}
      >
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </p>
    </div>
  );
}
