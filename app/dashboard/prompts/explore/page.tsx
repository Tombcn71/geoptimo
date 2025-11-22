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
import { useState, useEffect } from "react";
import Link from "next/link";

const categories = ["All", "Product Discovery", "How-To", "Comparison", "Technical", "Industry News"];

interface Prompt {
  id: number;
  text: string;
  category: string;
  impressions: number;
  isSubscribed: boolean;
  providers: string[];
}

export default function ExplorePromptsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      
      if (response.status === 404 && data.needsOnboarding) {
        // No brand found - redirect to onboarding
        window.location.href = '/onboarding';
        return;
      }
      
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

  const filteredPrompts = prompts.filter(prompt => {
    const categoryMatch = selectedCategory === "All" || prompt.category === selectedCategory;
    return categoryMatch;
  });

  const handleSubscribe = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/prompts/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptId: id,
          isSubscribed: !currentStatus
        })
      });
      
      if (response.ok) {
        await fetchPrompts(); // Refresh the list
      } else {
        alert('❌ Failed to update subscription');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('❌ Failed to update subscription');
    }
  };

  const handleSeedPrompts = async () => {
    setSeeding(true);
    try {
      const response = await fetch('/api/prompts/seed', {
        method: 'POST'
      });
      
      const result = await response.json();
      
      if (response.status === 404 && result.needsOnboarding) {
        alert('❌ Please complete onboarding first to create your brand');
        window.location.href = '/onboarding';
        return;
      }
      
      if (response.ok) {
        await fetchPrompts();
        alert('✅ Prompts seeded successfully!');
      } else {
        alert(`❌ ${result.error || 'Failed to seed prompts'}`);
      }
    } catch (error) {
      console.error('Error seeding prompts:', error);
      alert('❌ Failed to seed prompts');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading prompts...</div>
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
        {prompts.length === 0 && (
          <button
            onClick={handleSeedPrompts}
            disabled={seeding}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Plus className={`h-5 w-5 ${seeding ? 'animate-spin' : ''}`} />
            <span>{seeding ? 'Seeding...' : 'Seed Prompts'}</span>
          </button>
        )}
      </div>

      {/* Stats */}
      {prompts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-1">Total Prompts</p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{prompts.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">Subscribed</p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                {prompts.filter(p => p.isSubscribed).length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">Avg Impressions</p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {prompts.length > 0 ? Math.round(prompts.reduce((sum, p) => sum + p.impressions, 0) / prompts.length).toLocaleString() : '0'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {prompts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
      )}

      {/* Prompts List */}
      <div className="space-y-4">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all ${
                prompt.isSubscribed ? "ring-2 ring-green-500 dark:ring-green-600" : ""
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {prompt.text}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                        {prompt.category}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                        {prompt.impressions.toLocaleString()} impressions
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {prompt.providers.map((provider) => (
                        <span
                          key={provider}
                          className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                        >
                          {provider}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSubscribe(prompt.id, prompt.isSubscribed)}
                    className={`flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      prompt.isSubscribed
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                    }`}
                  >
                    {prompt.isSubscribed ? (
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
          ))
        ) : (
          <Card className="bg-gray-50 dark:bg-gray-900">
            <CardContent className="pt-12 pb-12 text-center">
              <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Prompts Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Click &quot;Seed Prompts&quot; above to get started with AI-generated prompts for your brand.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}

