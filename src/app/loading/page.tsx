"use client";

// src/app/loading/page.tsx
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/User";
import { processUserData } from "@/lib/userUtils";

export default function Loading() {
  const router = useRouter();
  const timeout = 2000;
  const hasProcessed = useRef(false);
  const { setUser } = useUser();
  const [loadingText, setLoadingText] = useState("Processing your data.");

  useEffect(() => {
    async function processData() {
      if (hasProcessed.current) return;
      hasProcessed.current = true;
        
      setLoadingText("Gathering your data...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoadingText("Processing your User information...");

      const success = await processUserData(timeout, setUser);
      if (success) {
        router.push("/viewdata");
      }
    }

    processData();
  }, [router, setUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-semibold">Processing your data...</h2>
      <p>{loadingText}</p>
    </div>
  );
}