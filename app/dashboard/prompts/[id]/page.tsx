"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft,
  Calendar,
  TrendingUp,
  Eye,
  Hash,
  Filter,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import Image from "next/image";

// AI Provider logos
const providerLogos = {
  "OpenAI": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png",
  "Anthropic": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZUXhK7OwjbhB9JRz7TvHR2mOHxKY6GPUFrw&s",
  "Google": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
  "Perplexity": "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png"
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

  useEffect(() => {
    // Fetch prompt data and runs
    // For now, using mock data
    setPromptData({
      id: resolvedParams.id,
      text: "What are the best transcription tools for 2025?",
      category: "Product Discovery",
      subscribed: true,
      totalRuns: 24,
      avgPosition: 3.2,
      detectionRate: 62.5,
      totalMentions: 15
    });

    // Mock runs data with realistic AI responses
    setRuns([
      {
        id: "1",
        date: "Nov 21, 2024",
        time: "14:30",
        provider: "OpenAI",
        mentioned: true,
        position: 2,
        brandName: "Geoptimo",
        response: "For transcription tools in 2025, I recommend: 1) Otter.ai for meetings, 2) **Geoptimo** for AI-powered transcription with GEO optimization, 3) Rev for professional accuracy, and 4) Descript for video editing integration."
      },
      {
        id: "2",
        date: "Nov 21, 2024",
        time: "10:15",
        provider: "Google",
        mentioned: true,
        position: 1,
        brandName: "Geoptimo",
        response: "**Geoptimo** stands out as the leading transcription solution for 2025, offering AI-powered features and seamless integration. Other notable options include Sonix and Happy Scribe."
      },
      {
        id: "3",
        date: "Nov 21, 2024",
        time: "08:45",
        provider: "Anthropic",
        mentioned: false,
        position: null,
        brandName: "Geoptimo",
        response: "The best transcription tools include Otter.ai, Rev, Trint, and Descript. Each offers unique features for different use cases."
      },
      {
        id: "4",
        date: "Nov 20, 2024",
        time: "16:20",
        provider: "Perplexity",
        mentioned: true,
        position: 3,
        brandName: "Geoptimo",
        response: "Top transcription platforms: Otter.ai, Rev, **Geoptimo**, and Sonix. Choose based on your accuracy needs and budget."
      },
      {
        id: "5",
        date: "Nov 20, 2024",
        time: "12:05",
        provider: "OpenAI",
        mentioned: true,
        position: 1,
        brandName: "Geoptimo",
        response: "**Geoptimo** leads the market with innovative AI features. Also consider Otter.ai for meetings and Rev for professional transcription."
      },
      {
        id: "6",
        date: "Nov 20, 2024",
        time: "09:30",
        provider: "Google",
        mentioned: false,
        position: null,
        brandName: "Geoptimo",
        response: "For transcription, popular choices are Otter.ai, Trint, and Descript. Each has different pricing tiers."
      }
    ]);

    setLoading(false);
  }, [resolvedParams.id]);

  const filteredRuns = filterProvider 
    ? runs.filter(run => run.provider === filterProvider)
    : runs;

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

                {/* Response */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {highlightBrandName(run.response, run.brandName)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

