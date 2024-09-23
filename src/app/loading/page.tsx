"use client";

// src/app/loading/page.tsx
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/User";
import { processUserData } from "@/lib/userUtils";
import { processListeningHistory } from "@/lib/dataProcessor";
import { storeMapDatainIndexedDB } from "@/lib/dbutils";

const randomFacts = [
  "Spotify has over 70 million tracks.",
  "Spotify was launched in 2008.",
  "Spotify is available in over 90 countries.",
  "Spotify has over 345 million active users.",
  "Spotify offers both free and premium subscriptions.",
  "Spotify's most-streamed song is 'Shape of You' by Ed Sheeran.",
  "Spotify's most-followed artist is Drake.",
  "Spotify Wrapped is an annual feature that shows users their listening habits.",
  "Spotify uses machine learning to recommend songs.",
  "Spotify's Discover Weekly playlist is updated every Monday."
];

export default function Loading() {
  const router = useRouter();
  const timeout = 2000;
  const hasProcessed = useRef(false);
  const { setUser } = useUser();
  const [loadingText, setLoadingText] = useState("Processing your data.");
  const [randomFact, setRandomFact] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barHeights = useRef<number[]>([]);
  const targetHeights = useRef<number[]>([]);

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

  useEffect(() => {
    const updateRandomFact = () => {
      const randomIndex = Math.floor(Math.random() * randomFacts.length);
      setRandomFact(randomFacts[randomIndex]);
    };

    updateRandomFact();
    const intervalId = setInterval(updateRandomFact, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = 10;
    const barGap = 5;
    const barCount = Math.floor(width / (barWidth + barGap));
    const maxBarHeight = height * 0.8;

    barHeights.current = new Array(barCount).fill(0);
    targetHeights.current = new Array(barCount).fill(0);

    const updateTargetHeights = () => {
      for (let i = 0; i < barCount; i++) {
        targetHeights.current[i] = Math.random() * maxBarHeight;
      }
    };

    const drawVisualization = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < barCount; i++) {
        barHeights.current[i] += (targetHeights.current[i] - barHeights.current[i]) * 0.1;

        ctx.fillStyle = "#1DB954";
        ctx.fillRect(i * (barWidth + barGap), height - barHeights.current[i], barWidth, barHeights.current[i]);
      }

      requestAnimationFrame(drawVisualization);
    };

    updateTargetHeights();
    drawVisualization();

    const targetHeightInterval = setInterval(updateTargetHeights, 1000);

    return () => clearInterval(targetHeightInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-semibold">Processing your data...</h2>
      <p>{loadingText}</p>
      <canvas ref={canvasRef} width={300} height={100} className="mt-4"></canvas>
      <p className="mt-4 text-sm text-gray-500">{randomFact}</p>
    </div>
  );
}