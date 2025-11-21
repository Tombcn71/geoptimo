"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles,
  TrendingUp,
  Check,
  Plus,
  ArrowLeft,
  Filter,
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const categories = ["All", "Product Discovery", "How-To", "Comparison", "Technical", "Industry News"];
const priorities = ["All", "High", "Medium", "Low"];

interface Prompt {
  id: number;
  text: string;
  category: string;
  priority: "high" | "medium" | "low";
  impressions: number;
  tags: string[];
  subscribed: boolean;
  aiReasoning: string;
}

const aiGeneratedPrompts: Prompt[] = [
  { 
    id: 1, 
    text: "What are the best GEO optimization tools for 2025?", 
    category: "Product Discovery",
    priority: "high",
    impressions: 2340,
    tags: ["tools", "optimization", "2025"],
    subscribed: false,
    aiReasoning: "High search volume in your industry. Competitors ranking strongly here."
  },
  { 
    id: 2, 
    text: "How to optimize content for AI search engines?", 
    category: "How-To",
    priority: "high",
    impressions: 1890,
    tags: ["tutorial", "content", "seo"],
    subscribed: true,
    aiReasoning: "Directly relates to your core product offering. Strong conversion potential."
  },
  { 
    id: 3, 
    text: "GEO vs traditional SEO: What's the difference?", 
    category: "Comparison",
    priority: "medium",
    impressions: 1560,
    tags: ["comparison", "seo", "education"],
    subscribed: false,
    aiReasoning: "Educational query with high engagement. Good for thought leadership."
  },
  { 
    id: 4, 
    text: "Best AI citation tracking platforms", 
    category: "Product Discovery",
    priority: "high",
    impressions: 1420,
    tags: ["citations", "tracking", "platforms"],
    subscribed: false,
    aiReasoning: "Your product is a strong fit. Competitors mentioned frequently."
  },
  { 
    id: 5, 
    text: "How do AI models choose which sources to cite?", 
    category: "Technical",
    priority: "medium",
    impressions: 1200,
    tags: ["technical", "ai", "citations"],
    subscribed: false,
    aiReasoning: "Technical query showing expert positioning opportunity."
  },
  { 
    id: 6, 
    text: "GEO tools for enterprise marketing teams", 
    category: "Product Discovery",
    priority: "high",
    impressions: 980,
    tags: ["enterprise", "marketing", "tools"],
    subscribed: false,
    aiReasoning: "Targets your ideal customer segment with high buying intent."
  },
  { 
    id: 7, 
    text: "Latest trends in generative engine optimization", 
    category: "Industry News",
    priority: "low",
    impressions: 890,
    tags: ["trends", "industry", "news"],
    subscribed: false,
    aiReasoning: "Keep pulse on industry. Moderate competition, growing interest."
  },
  { 
    id: 8, 
    text: "How to track brand mentions in AI responses", 
    category: "How-To",
    priority: "high",
    impressions: 1650,
    tags: ["monitoring", "brands", "tracking"],
    subscribed: true,
    aiReasoning: "Core use case for your product. High relevance to customer pain points."
  },
  { 
    id: 9, 
    text: "Top GEO agencies and consultants", 
    category: "Product Discovery",
    priority: "medium",
    impressions: 780,
    tags: ["agencies", "services", "consultants"],
    subscribed: false,
    aiReasoning: "Partnership opportunity. Your brand could be mentioned alongside services."
  },
  { 
    id: 10, 
    text: "ChatGPT vs Gemini vs Perplexity: Which is best for research?", 
    category: "Comparison",
    priority: "low",
    impressions: 2100,
    tags: ["ai-models", "comparison", "research"],
    subscribed: false,
    aiReasoning: "High volume but indirect relevance. Consider for brand awareness."
  }
];

export default function ExplorePromptsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [prompts, setPrompts] = useState(aiGeneratedPrompts);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const filteredPrompts = prompts.filter(prompt => {
    const categoryMatch = selectedCategory === "All" || prompt.category === selectedCategory;
    const priorityMatch = selectedPriority === "All" || prompt.priority === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  const handleSubscribe = (id: number) => {
    setPrompts(prompts.map(p => 
      p.id === id ? { ...p, subscribed: !p.subscribed } : p
    ));
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "low":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/prompts" className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Prompts</span>
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <span>Explore AI-Generated Prompts</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover relevant prompts based on your brand, industry, and competitor analysis
          </p>
        </div>
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>Regenerate</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-1">AI Suggestions</p>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{prompts.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">Subscribed</p>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100">
              {prompts.filter(p => p.subscribed).length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6">
            <p className="text-sm text-orange-700 dark:text-orange-300 font-medium mb-1">High Priority</p>
            <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {prompts.filter(p => p.priority === "high").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">Avg Impressions</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {Math.round(prompts.reduce((sum, p) => sum + p.impressions, 0) / prompts.length).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {priorities.map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setSelectedPriority(priority)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPriority === priority
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prompts List */}
      <div className="space-y-4">
        {filteredPrompts.map((prompt) => (
          <Card
            key={prompt.id}
            className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all ${
              prompt.subscribed ? "ring-2 ring-green-500 dark:ring-green-600" : ""
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {prompt.text}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                          {prompt.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium uppercase ${getPriorityColor(prompt.priority)}`}>
                          {prompt.priority} Priority
                        </span>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                          {prompt.impressions.toLocaleString()} impressions
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {prompt.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                        <p className="text-sm text-blue-900 dark:text-blue-300">
                          <Sparkles className="inline h-4 w-4 mr-1" />
                          <strong>AI Reasoning:</strong> {prompt.aiReasoning}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleSubscribe(prompt.id)}
                  className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                    prompt.subscribed
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                  }`}
                >
                  {prompt.subscribed ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredPrompts.length === 0 && (
        <Card className="bg-gray-50 dark:bg-gray-900">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No prompts found with the selected filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedPriority("All");
              }}
              className="mt-4 text-purple-600 dark:text-purple-400 hover:underline"
            >
              Clear all filters
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

