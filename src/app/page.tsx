"use client";

import { Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Header from "@/components/Header";
import Description from "@/components/Description";
import TooltipLinks from "@/components/TooltipLinks";
import { storeFilesInIndexedDB } from "@/lib/dbutils";
import { useRouter } from "next/navigation";

export default function Home() {

    const router = useRouter();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
      await storeFilesInIndexedDB(acceptedFiles);
      router.push("/viewdata");
    }, [router]);

    const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: {
        "application/zip": [".zip"],
        "application/json": [".json"],
        },
    });


  return (
    <div className="max-w-4xl flex flex-col text-center m-auto">
      <Header />
      <main className="space-y-8">
        <section className="space-y-4 flex flex-col items-center">
          <h2 className="text-2xl font-semibold">
            Re-discover your music preferences
          </h2>
          <Description />
          <section className="flex flex-row space-x-8">
           <TooltipLinks />
          </section>
        </section>
        <section className="space-y-8 flex flex-col items-center">
          <h3 className="text-3xl font-medium">Upload Your Spotify Data</h3>
          <div
            id="FileDropper"
            className="max-w-3xl p-16 flex flex-col items-center rounded-lg border-2 border-dashed border-gray-200 space-y-4 hover:border-spotify-green"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <p className="antialiased">
              To get started, simply download your Spotify data and upload it
              here. Your data will be processed securely and never shared with
              anyone.
            </p>
            <Upload size={48} />
          </div>
        </section>
      </main>
    </div>
  );
}
