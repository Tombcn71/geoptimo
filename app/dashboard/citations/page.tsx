"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ExternalLink,
  TrendingUp
} from "lucide-react";
import { useState, useEffect } from "react";

interface Citation {
  id: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceDomain: string;
  domainAuthority: number;
  snippet: string | null;
  providers: string[];
  citationCount: number;
  firstSeen: Date;
  lastSeen: Date;
}

export default function CitationsPage() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCitations();
  }, []);

  const fetchCitations = async () => {
    try {
      const response = await fetch('/api/citations');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCitations(data);
      } else {
        console.error('API returned non-array data:', data);
        setCitations([]);
      }
    } catch (error) {
      console.error('Error fetching citations:', error);
      setCitations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading citations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Citations</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track where AI models cite your content
        </p>
      </div>

      {/* Your Brand Citations */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Your Brand Citations</span>
          </CardTitle>
          <CardDescription>
            When AI models cite your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {citations.length > 0 ? citations.map((citation) => (
              <div
                key={citation.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {citation.sourceTitle || citation.sourceDomain}
                    </h3>
                    <a 
                      href={citation.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center space-x-1"
                    >
                      <span>{citation.sourceUrl}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{citation.citationCount}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">citations</div>
                  </div>
                </div>
                {citation.snippet && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 italic">
                    &quot;{citation.snippet}&quot;
                  </p>
                )}
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Domain Authority: {citation.domainAuthority} • Last seen: {new Date(citation.lastSeen).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Providers:</span>
                    {citation.providers.map((provider: string) => (
                      <span
                        key={provider}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-700 dark:text-gray-300"
                      >
                        {provider}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  No citations found yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Citations will appear here when AI models reference your content
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
