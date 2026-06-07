"use client";

import { useEffect, useState } from "react";

export function CoconutGuard({ children }: { children: React.ReactNode }) {
  const [intact, setIntact] = useState<boolean | null>(null);

  useEffect(() => {
    void fetch("/coconut.png", { method: "HEAD" })
      .then((response) => {
        if (!response.ok) {
          setIntact(false);
          return;
        }
        setIntact(true);
      })
      .catch(() => setIntact(false));
  }, []);

  if (intact === false) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
            The coconut is missing.
          </h1>
          <p style={{ color: "#71767b", maxWidth: "28rem" }}>
            SyncX cannot function without it. Put it back. Fuck you.
          </p>
        </div>
      </div>
    );
  }

  if (intact === null) {
    return null;
  }

  return <>{children}</>;
}
