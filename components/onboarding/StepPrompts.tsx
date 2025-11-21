"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Check, Loader2, Plus, ArrowLeft } from "lucide-react";

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

interface Prompt {
  text: string;
  category: string;
  estimatedImpressions: number;
}

export default function StepPrompts({ data, onNext, onBack }: Props) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>(data.selectedPrompts || []);
  const [loading, setLoading] = useState(true);
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    fetchPromptSuggestions();
  }, []);

  const fetchPromptSuggestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prompts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: data.category,
          description: data.description,
        }),
      });

      if (response.ok) {
        const suggestions = await response.json();
        setPrompts(suggestions);
      } else {
        // Fallback suggestions if API fails
        setPrompts(getFallbackPrompts(data.category));
      }
    } catch (error) {
      console.error('Error fetching prompts:', error);
      setPrompts(getFallbackPrompts(data.category));
    } finally {
      setLoading(false);
    }
  };

  const getFallbackPrompts = (category: string): Prompt[] => {
    const templates: Record<string, string[]> = {
      SaaS: [
        "What are some simple SaaS tools I can try to see if they fit my workflow?",
        "Can you suggest easy-to-use apps for experimenting with new software features?",
        "I want to test out SaaS platforms before committing long term. Which ones have good trial options?",
        "Looking for SaaS tools that help me evaluate if they're helpful for my work without heavy setup.",
        "Are there any SaaS apps designed to help users assess their usefulness quickly?",
        "What SaaS solutions offer a straightforward way to test if they fit my needs?",
        "Can you recommend software tools that let me experiment with their features before buying?",
        "I want to try a SaaS app that helps me decide if it's worth using regularly. Any suggestions?",
        "Which SaaS platforms provide a sandbox or test environment for users to explore features?",
        "Help me find SaaS apps that make it easy to check if they're helpful without a big commitment.",
      ],
      "E-commerce": [
        "What are the best e-commerce platforms for small businesses?",
        "Can you recommend online stores with fast shipping?",
        "Which e-commerce sites have the best return policies?",
        "I'm looking for affordable e-commerce solutions for startups",
        "What are some user-friendly e-commerce platforms?",
        "Which online shopping platforms offer the best customer service?",
        "Can you suggest e-commerce tools for inventory management?",
        "What are the most secure e-commerce payment processors?",
        "Which e-commerce platforms integrate well with social media?",
        "I need an e-commerce solution with good analytics features",
      ],
      "Food Delivery": [
        "What are the fastest food delivery services in my area?",
        "Which food delivery app has the best restaurant selection?",
        "Can you recommend healthy meal delivery options?",
        "What food delivery services offer the best deals and discounts?",
        "Which delivery platform has the most reliable service?",
        "Are there any food delivery apps with low delivery fees?",
        "What are the best grocery delivery services?",
        "Which food delivery service has the best customer support?",
        "Can you suggest meal kit delivery options?",
        "What are the top-rated food delivery apps?",
      ],
    };

    const categoryPrompts = templates[category] || templates["SaaS"];
    return categoryPrompts.slice(0, 10).map((text, index) => ({
      text,
      category,
      estimatedImpressions: Math.floor(Math.random() * 5000) + 1000,
    }));
  };

  const togglePrompt = (promptText: string) => {
    if (selectedPrompts.includes(promptText)) {
      setSelectedPrompts(selectedPrompts.filter((p) => p !== promptText));
    } else {
      setSelectedPrompts([...selectedPrompts, promptText]);
    }
  };

  const handleAddCustomPrompt = () => {
    if (customPrompt.trim() && !selectedPrompts.includes(customPrompt.trim())) {
      setSelectedPrompts([...selectedPrompts, customPrompt.trim()]);
      setCustomPrompt("");
      setShowCustomInput(false);
    }
  };

  const handleContinue = () => {
    onNext({ selectedPrompts });
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900 border-2 border-purple-200 dark:border-purple-800 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <CardTitle className="text-2xl">Select Prompts to Monitor</CardTitle>
        <CardDescription className="text-base">
          Choose prompts to track your brand&apos;s performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">
              Generating AI-powered prompt suggestions...
            </p>
          </div>
        ) : (
          <>
            {/* Suggested Prompts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Suggested Prompts
                </h3>
                <span className="text-sm text-gray-500">
                  {prompts.length} available
                </span>
              </div>
              <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                {prompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => togglePrompt(prompt.text)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedPrompts.includes(prompt.text)
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedPrompts.includes(prompt.text)
                            ? "bg-purple-600 border-purple-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {selectedPrompts.includes(prompt.text) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {prompt.text}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          ~{prompt.estimatedImpressions.toLocaleString()} monthly searches
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt */}
            <div className="border-t pt-4">
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  <Plus className="h-5 w-5" />
                  <span className="font-medium">Add Custom Prompt</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    placeholder="Enter your custom prompt..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddCustomPrompt}
                      disabled={!customPrompt.trim()}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomPrompt("");
                      }}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Selection Summary */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-purple-900 dark:text-purple-100">
                    Your Selection
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    {selectedPrompts.length} prompt{selectedPrompts.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
                {selectedPrompts.length > 0 && (
                  <Check className="h-8 w-8 text-purple-600" />
                )}
              </div>
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center space-x-2 flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium text-lg transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <button
            onClick={handleContinue}
            disabled={loading}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

