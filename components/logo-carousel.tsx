"use client";

import { useEffect, useState } from "react";

const companies = [
  { name: "OpenAI", logo: "ChatGPT" },
  { name: "Anthropic", logo: "Claude" },
  { name: "Perplexity", logo: "Perplexity" },
  { name: "Google", logo: "Gemini" },
  { name: "Meta", logo: "Llama" },
  { name: "Microsoft", logo: "Copilot" },
  { name: "Mistral", logo: "Mistral AI" },
  { name: "Cohere", logo: "Cohere" },
];

// Duplicate for seamless loop
const allCompanies = [...companies, ...companies];

export function LogoCarousel() {
  return (
    <div className="w-full py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10" />
          
          {/* Scrolling content */}
          <div className="flex animate-scroll">
            {allCompanies.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex-shrink-0 mx-8 flex items-center justify-center"
              >
                <div className="px-8 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                    {company.logo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

