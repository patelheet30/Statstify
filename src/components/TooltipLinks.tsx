// src/components/TooltipLinks.tsx
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, FolderCode } from "lucide-react";

const TooltipLinks = () => (
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
            <a href="https://github.com/patelheet30/Statstify" target="_blank" rel="noopener">
              <FolderCode size={32} className="hover:text-spotify-green" />
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>Source Code</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </section>
);

export default TooltipLinks;