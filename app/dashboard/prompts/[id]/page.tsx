"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft,
  Calendar,
  TrendingUp,
  Eye,
  Hash,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import Image from "next/image";

// AI Provider logos (currently only Gemini is supported)
const providerLogos = {
  "Gemini": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
  // Other providers will be added when implemented:
  // "ChatGPT": "...",
  // "Claude": "...",
  // "Perplexity": "..."
};

interface PromptRun {
  id: string;
  date: string;
  time: string;
  provider: string;
  mentioned: boolean;
  position: number | null;
  response: string;
  brandName: string;
}

export default function PromptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [filterProvider, setFilterProvider] = useState<string | null>(null);
  const [promptData, setPromptData] = useState<any>(null);
  const [runs, setRuns] = useState<PromptRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [expandedRuns, setExpandedRuns] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPromptData();
    
    // Check if we just ran this prompt
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('justRan') === 'true') {
      setShowSuccessMessage(true);
      // Remove the query param
      window.history.replaceState({}, '', window.location.pathname);
      // Hide message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id]);

  const fetchPromptData = async () => {
    try {
      const response = await fetch(`/api/prompts/${resolvedParams.id}`);
      const data = await response.json();
      
      setPromptData({
        id: data.id,
        text: data.text,
        category: data.category,
        subscribed: data.isSubscribed,
        totalRuns: data.totalRuns,
        avgPosition: data.avgPosition,
        detectionRate: data.detectionRate,
        totalMentions: data.totalMentions
      });

      // Transform runs data
      const transformedRuns = data.runs.flatMap((run: any) => 
        run.details.map((detail: any, index: number) => ({
          id: `${run.id}-${index}`,
          date: run.date,
          time: run.time,
          provider: run.provider,
          mentioned: detail.mentioned,
          position: detail.position,
          brandName: detail.brandName,
          response: detail.response
        }))
      );

      setRuns(transformedRuns);
    } catch (error) {
      console.error('Error fetching prompt data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRuns = filterProvider 
    ? runs.filter(run => run.provider === filterProvider)
    : runs;

  const toggleRunExpansion = (runId: string) => {
    setExpandedRuns(prev => {
      const next = new Set(prev);
      if (next.has(runId)) {
        next.delete(runId);
      } else {
        next.add(runId);
      }
      return next;
    });
  };

  const getResponseExcerpt = (text: string, maxLength: number = 300) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const highlightBrandName = (text: string, brandName: string) => {
    if (!text) return text;
    const parts = text.split(new RegExp(`(\\*\\*${brandName}\\*\\*|${brandName})`, 'gi'));
    return parts.map((part, index) => {
      if (part.toLowerCase() === brandName.toLowerCase() || part === `**${brandName}**`) {
        return (
          <span key={index} className="bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-300 font-semibold px-1 rounded">
            {brandName}
          </span>
        );
      }
      return part;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading prompt details...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-600 rounded-lg p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-100">
                ✅ Prompt Executed Successfully!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Results are shown below. The AI ran this prompt across multiple providers.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Back Button */}
      <Link href="/dashboard/prompts" className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Prompts</span>
      </Link>

      {/* Prompt Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {promptData?.text}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                {promptData?.category}
              </span>
              {promptData?.subscribed && (
                <span className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Subscribed</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Runs</p>
              </div>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{promptData?.totalRuns}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-2">
                <Hash className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Avg Position</p>
              </div>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">#{promptData?.avgPosition}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">Detection Rate</p>
              </div>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{promptData?.detectionRate}%</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Total Mentions</p>
              </div>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{promptData?.totalMentions}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Provider Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Provider:</span>
            <button
              onClick={() => setFilterProvider(null)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filterProvider === null
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            {Object.keys(providerLogos).map((provider) => (
              <button
                key={provider}
                onClick={() => setFilterProvider(provider)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  filterProvider === provider
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <span>{provider}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prompt Runs Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Prompt Runs Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRuns.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Runs Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This prompt hasn&apos;t been executed yet. 
                {promptData?.subscribed ? (
                  <span> It will run automatically daily, or you can run it manually from the Prompts page.</span>
                ) : (
                  <span> Subscribe to this prompt and run it manually to see results.</span>
                )}
              </p>
              <Link 
                href="/dashboard/prompts"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Prompts</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRuns.map((run) => (
              <div
                key={run.id}
                className={`p-5 rounded-lg border ${
                  run.mentioned
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
                    : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                }`}
              >
                {/* Run Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 relative">
                      <Image
                        src={providerLogos[run.provider as keyof typeof providerLogos]}
                        alt={run.provider}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{run.provider}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{run.date} at {run.time}</p>
                    </div>
                  </div>
                  <div>
                    {run.mentioned ? (
                      <div className="flex items-center space-x-3">
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium flex items-center space-x-1">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Position #{run.position}</span>
                        </span>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm font-medium">
                        Not Mentioned
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Response Section - Google AI Overview Style */}
                <div className="bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  {/* Response Preview */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">AI Response</h4>
                      </div>
                      <button
                        onClick={() => toggleRunExpansion(run.id)}
                        className="flex items-center space-x-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <span>{expandedRuns.has(run.id) ? 'Show Less' : 'Show Full Response'}</span>
                        {expandedRuns.has(run.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    {/* Response Content - Google AI Style */}
                    <div className={`${expandedRuns.has(run.id) ? '' : 'max-h-40 overflow-hidden relative'}`}>
                      <div 
                        className="prose prose-sm dark:prose-invert max-w-none
                          prose-headings:font-semibold prose-headings:text-gray-900 dark:prose-headings:text-white
                          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-3
                          prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                          prose-ul:my-2 prose-ul:text-gray-700 dark:prose-ul:text-gray-300
                          prose-li:my-1 prose-li:text-gray-700 dark:prose-li:text-gray-300
                          prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-900/20 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                        "
                        style={{
                          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          fontSize: '0.938rem',
                          lineHeight: '1.6',
                          color: 'rgb(60, 64, 67)'
                        }}
                      >
                        <p className="whitespace-pre-wrap">
                          {expandedRuns.has(run.id) 
                            ? highlightBrandName(run.response, run.brandName)
                            : highlightBrandName(getResponseExcerpt(run.response, 400), run.brandName)
                          }
                        </p>
                      </div>
                      {!expandedRuns.has(run.id) && run.response.length > 400 && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-50/90 via-blue-50/60 dark:from-blue-950/90 dark:via-blue-950/60 to-transparent pointer-events-none" />
                      )}
                    </div>

                    {/* Response Stats - Subtle */}
                    <div className="mt-4 pt-3 border-t border-blue-100 dark:border-blue-900/30 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <span>📊</span>
                        <span>{Math.ceil(run.response.length / 5)} words</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>✨</span>
                        <span>AI-Generated</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

