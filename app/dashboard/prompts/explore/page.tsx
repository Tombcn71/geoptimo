"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles,
  TrendingUp,
  Check,
  Plus,
  ArrowLeft,
  Filter,
  RefreshCw,
  Trash2,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPromptText, setNewPromptText] = useState("");
  const [newPromptCategory, setNewPromptCategory] = useState("Product Discovery");
  const [creating, setCreating] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/prompts/explore");
    }
  }, [status, router]);

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

  const handleCreatePrompt = async () => {
    if (!newPromptText.trim()) {
      alert('❌ Please enter a prompt text');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newPromptText,
          category: newPromptCategory,
          providers: ['ChatGPT', 'Gemini', 'Claude', 'Perplexity'],
          isCustom: true
        })
      });

      if (response.ok) {
        await fetchPrompts();
        setShowCreateModal(false);
        setNewPromptText("");
        setNewPromptCategory("Product Discovery");
        alert('✅ Custom prompt created successfully!');
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || 'Failed to create prompt'}`);
      }
    } catch (error) {
      console.error('Error creating prompt:', error);
      alert('❌ Failed to create prompt');
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePrompt = async (id: number, text: string) => {
    if (!confirm(`Are you sure you want to delete this prompt?\n\n"${text}"`)) {
      return;
    }

    try {
      const response = await fetch(`/api/prompts/${id}/delete`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchPrompts();
        alert('✅ Prompt deleted successfully!');
      } else {
        const error = await response.json();
        alert(`❌ ${error.error || 'Failed to delete prompt'}`);
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
      alert('❌ Failed to delete prompt');
    }
  };

  const handleGenerateAIPrompts = async () => {
    setGenerating(true);
    try {
      // First, get the user's brand info
      const brandResponse = await fetch('/api/brands/info');
      const brandData = await brandResponse.json();
      
      if (!brandResponse.ok) {
        alert('❌ Could not fetch brand information');
        return;
      }

      // Generate AI prompts based on brand
      const generateResponse = await fetch('/api/prompts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: brandData.industry || 'SaaS',
          description: brandData.description || `${brandData.companyName} - ${brandData.industry}`
        })
      });

      if (!generateResponse.ok) {
        alert('❌ Failed to generate AI prompts');
        return;
      }

      const generatedPrompts = await generateResponse.json();

      // Create each generated prompt
      let successCount = 0;
      for (const prompt of generatedPrompts) {
        try {
          const createResponse = await fetch('/api/prompts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: prompt.text,
              category: prompt.category,
              providers: ['ChatGPT', 'Gemini', 'Claude', 'Perplexity'],
              isCustom: false
            })
          });

          if (createResponse.ok) {
            successCount++;
          }
        } catch (error) {
          console.error('Error creating prompt:', error);
        }
      }

      await fetchPrompts();
      alert(`✅ Generated ${successCount} AI-powered prompts!`);
    } catch (error) {
      console.error('Error generating prompts:', error);
      alert('❌ Failed to generate AI prompts');
    } finally {
      setGenerating(false);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

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
        <div className="flex gap-2">
          <button
            onClick={handleGenerateAIPrompts}
            disabled={generating}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50 shadow-lg"
          >
            <Sparkles className={`h-5 w-5 ${generating ? 'animate-pulse' : ''}`} />
            <span>{generating ? 'Generating...' : 'Generate AI Prompts'}</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            <Plus className="h-5 w-5" />
            <span>Create Custom</span>
          </button>
          {prompts.length === 0 && (
            <button
              onClick={handleSeedPrompts}
              disabled={seeding}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Seeding...' : 'Seed Demo Data'}</span>
            </button>
          )}
        </div>
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
                  <div className="flex gap-2">
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
                    <button
                      onClick={() => handleDeletePrompt(prompt.id, prompt.text)}
                      className="flex-shrink-0 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                      title="Delete prompt"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
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

      {/* Create Custom Prompt Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white dark:bg-gray-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Create Custom Prompt</CardTitle>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <CardDescription>
                Add a custom prompt to track for your brand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prompt Text
                </label>
                <textarea
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  placeholder="e.g., What are the best AI tools for marketing?"
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={newPromptCategory}
                  onChange={(e) => setNewPromptCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {categories.filter(c => c !== "All").map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleCreatePrompt}
                  disabled={creating || !newPromptText.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Create Prompt'}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}

