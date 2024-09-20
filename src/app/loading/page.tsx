"use client";

// src/app/loading/page.tsx
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/User";
import { processUserData } from "@/lib/userUtils";
import { processListeningHistory } from "@/lib/dataProcessor";
import { storeMapDatainIndexedDB } from "@/lib/dbutils";

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
        setLoadingText("Processing your listening history...");
        const songsProcessed = await processListeningHistory();

        if (songsProcessed.length === 0) {
          setLoadingText("No songs found in your data.");
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push("/");
        } else {
          await storeMapDatainIndexedDB(new Map([["songs", songsProcessed]]));
          router.push("/viewdata");
        }
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