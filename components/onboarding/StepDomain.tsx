"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Loader2 } from "lucide-react";
import Image from "next/image";

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function StepDomain({ data, onNext }: Props) {
  const [domain, setDomain] = useState(data.domain || "");
  const [favicon, setFavicon] = useState(data.favicon || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFavicon = async (url: string) => {
    try {
      setLoading(true);
      setError("");
      
      // Try multiple favicon sources
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}&sz=128`;
      setFavicon(faviconUrl);
      
      setLoading(false);
    } catch (err) {
      setError("Could not fetch favicon");
      setLoading(false);
    }
  };

  const handleDomainChange = (value: string) => {
    setDomain(value);
    
    // Auto-fetch favicon when domain looks valid
    if (value.includes('.') && value.length > 4) {
      const cleanDomain = value.replace(/^https?:\/\//, '').replace(/\/$/, '');
      fetchFavicon(cleanDomain);
    }
  };

  const handleContinue = () => {
    if (!domain) {
      setError("Please enter your domain");
      return;
    }
    
    onNext({ domain, favicon });
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          {favicon ? (
            <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 flex items-center justify-center overflow-hidden">
              <Image 
                src={favicon} 
                alt="Brand favicon" 
                width={48} 
                height={48}
                className="w-12 h-12"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900 border-2 border-purple-200 dark:border-purple-800 flex items-center justify-center">
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl">What's your brand's domain?</CardTitle>
        <CardDescription className="text-base">
          We'll use this to fetch your brand logo and analyze your web presence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="example.com"
            value={domain}
            onChange={(e) => handleDomainChange(e.target.value)}
            className="w-full px-4 py-3 text-center text-lg border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          {loading && (
            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Fetching favicon...
            </div>
          )}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={!domain}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-500">
          Don't worry, you can change this later in settings
        </p>
      </CardContent>
    </Card>
  );
}

