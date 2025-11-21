"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles,
  Plus,
  Search,
  TrendingUp,
  Check,
  X
} from "lucide-react";
import { useState } from "react";

const aiSuggestedPrompts = [
  { 
    id: 1, 
    text: "What are the best GEO optimization tools?", 
    category: "Product Discovery",
    impressions: 2340,
    subscribed: false
  },
  { 
    id: 2, 
    text: "How to optimize content for AI search engines?", 
    category: "How-To",
    impressions: 1890,
    subscribed: true
  },
  { 
    id: 3, 
    text: "Top platforms for monitoring AI citations", 
    category: "Comparison",
    impressions: 1560,
    subscribed: false
  },
  { 
    id: 4, 
    text: "GEO tools for enterprise brands", 
    category: "Enterprise",
    impressions: 1200,
    subscribed: false
  },
  { 
    id: 5, 
    text: "AI search optimization vs traditional SEO", 
    category: "Comparison",
    impressions: 980,
    subscribed: true
  },
];

const subscribedPrompts = [
  {
    id: 101,
    text: "Best AI marketing tools for 2025",
    lastRun: "2 hours ago",
    mentions: 12,
    position: 2,
    providers: ["ChatGPT", "Claude", "Perplexity", "Gemini"]
  },
  {
    id: 102,
    text: "How to track brand performance in AI search?",
    lastRun: "5 hours ago",
    mentions: 8,
    position: 1,
    providers: ["ChatGPT", "Claude"]
  },
];

export default function PromptsPage() {
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prompt Explorer</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Descubre y suscríbete a prompts relevantes para tu marca
          </p>
        </div>
        <button
          onClick={() => setShowCustomPrompt(true)}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Custom Prompt</span>
        </button>
      </div>

      {/* AI Suggested Prompts */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-2 border-purple-200 dark:border-purple-900">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>AI-Generated Suggestions</span>
          </CardTitle>
          <CardDescription>
            Basado en tu información de marca y industria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiSuggestedPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="font-medium text-gray-900 dark:text-white">{prompt.text}</p>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full text-gray-700 dark:text-gray-300">
                      {prompt.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {prompt.impressions.toLocaleString()} community impressions
                  </p>
                </div>
                {prompt.subscribed ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span className="text-sm font-medium">Subscribed</span>
                  </div>
                ) : (
                  <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                    Subscribe
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Subscribed Prompts */}
      <Card>
        <CardHeader>
          <CardTitle>Tus Prompts Suscritos</CardTitle>
          <CardDescription>
            Ejecutados diariamente across múltiples proveedores de IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscribedPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="p-5 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-900"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {prompt.text}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Last run: {prompt.lastRun}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>{prompt.mentions} mentions</span>
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        Avg Position: #{prompt.position}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Providers:</span>
                  {prompt.providers.map((provider) => (
                    <span
                      key={provider}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded text-gray-700 dark:text-gray-300"
                    >
                      {provider}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Prompt Modal */}
      {showCustomPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Create Custom Prompt</CardTitle>
              <CardDescription>
                Crea tu propio prompt para monitorear
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prompt Text
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  rows={4}
                  placeholder="What are the best tools for..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AI Providers
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["ChatGPT", "Claude", "Perplexity", "Gemini"].map((provider) => (
                    <label key={provider} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>{provider}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCustomPrompt(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCustomPrompt(false)}
                  className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Subscribe & Run
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

