import { Upload, Info, FolderCode } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Home() {
  return (
    <div className="max-w-4xl flex flex-col text-center m-auto">
      <header className="mb-8 mt-12">
        <h1 className="text-6xl font-bold text-spotify-green">Statstify</h1>
      </header>
      <main className="space-y-8">
        <section className="space-y-4 flex flex-col items-center">
          <h2 className="text-2xl font-semibold">Re-discover your music preferences</h2>
          <p className="antialiased">
            Statstify is a powerful tool that analyses your Spotify listening
            history to provide in-depth insights about your music preferences.
            Discover your most-played artists, albums, and tracks, and dive deep
            into your listening habits for specific albums or artists.
          </p>
          <section className="flex flex-row space-x-8">
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="/info">
                      <Info size={32} className="hover:text-spotify-green" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How to get Data?</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://github.com/patelheet30" target="_blank" rel="noopener">
                      <FolderCode size={32} className="hover:text-spotify-green"/>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Source Code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </section>
        </section>
        <section className="space-y-8 flex flex-col items-center">
          <h3 className="text-3xl font-medium">Upload Your Spotify Data</h3>
          <div className="max-w-3xl p-16 flex flex-col items-center rounded-lg border-2 border-dashed border-gray-200 space-y-4 hover:border-spotify-green">
            <p className="antialiased">
              To get started, simply download your Spotify data and
              upload it here. Your data will be processed securely and never
              shared with anyone.
            </p>
            <Upload size={48} />
          </div>
        </section>
      </main>
    </div>
  );
}
