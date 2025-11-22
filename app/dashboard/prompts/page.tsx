"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles,
  Plus,
  Search,
  TrendingUp,
  Check,
  X,
  ArrowRight,
  Play,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Prompt {
  id: number;
  text: string;
  category: string;
  impressions: number;
  isSubscribed: boolean;
  providers: string[];
  lastRun?: string;
  mentions?: number;
  position?: number;
}

export default function PromptsPage() {
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningPrompts, setRunningPrompts] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      
      // Check if data is an array
      if (Array.isArray(data)) {
        setPrompts(data);
      } else {
        console.error('API returned non-array data:', data);
        setPrompts([]);
      }
    } catch (error) {
      console.error('Error fetching prompts:', error);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRunNow = async (promptId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setRunningPrompts(prev => new Set(prev).add(promptId));
    
    try {
      const response = await fetch(`/api/prompts/${promptId}/run-manual`, {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchPrompts();
        alert('✅ Prompt executed successfully!');
      } else {
        const error = await response.json();
        alert(`❌ Failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error running prompt:', error);
      alert('❌ Failed to run prompt');
    } finally {
      setRunningPrompts(prev => {
        const next = new Set(prev);
        next.delete(promptId);
        return next;
      });
    }
  };

  const subscribedPrompts = prompts.filter(p => p.isSubscribed);
  const suggestedPrompts = prompts.filter(p => !p.isSubscribed).slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading prompts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prompt Explorer</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover and subscribe to relevant prompts for your brand
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/prompts/explore"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center space-x-2"
          >
            <Sparkles className="h-5 w-5" />
            <span>Explore AI Prompts</span>
          </Link>
          <button
            onClick={() => setShowCustomPrompt(true)}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Custom Prompt</span>
          </button>
        </div>
      </div>

      {/* AI Suggested Prompts */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-2 border-purple-200 dark:border-purple-900">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>AI-Generated Suggestions</span>
          </CardTitle>
          <CardDescription>
            Based on your brand information and industry
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestedPrompts.length > 0 ? suggestedPrompts.map((prompt) => (
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
                {prompt.isSubscribed ? (
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
            )) : (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                No suggested prompts available. Visit Explore Prompts to find more!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Your Subscribed Prompts */}
      <Card>
        <CardHeader>
          <CardTitle>Your Subscribed Prompts</CardTitle>
          <CardDescription>
            Executed daily across multiple AI providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscribedPrompts.length > 0 ? subscribedPrompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/dashboard/prompts/${prompt.id}`}
                className="block p-5 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all bg-white dark:bg-gray-900 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                      <span>{prompt.text}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
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
                  <button
                    onClick={(e) => handleRunNow(prompt.id, e)}
                    disabled={runningPrompts.has(prompt.id)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {runningPrompts.has(prompt.id) ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Run Now</span>
                      </>
                    )}
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
              </Link>
            )) : (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                <p className="mb-4">You haven&apos;t subscribed to any prompts yet.</p>
                <Link href="/dashboard/prompts/explore" className="text-purple-600 dark:text-purple-400 hover:underline">
                  Explore available prompts →
                </Link>
              </div>
            )}
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
                Create your own custom prompt to monitor
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
                  {["ChatGPT", "Gemini", "Perplexity"].map((provider) => (
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

