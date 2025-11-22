"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search, Bell, TrendingUp, FileText, ArrowLeft } from "lucide-react";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function StepHowItWorks({ onNext, onBack }: Props) {
  return (
    <Card className="border-none shadow-2xl bg-white dark:bg-gray-900">
      <CardContent className="pt-12 pb-12 px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How Geoptimo Works
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A simple 4-step process to dominate AI search results
          </p>
        </div>

        <div className="space-y-8 mb-12">
          {/* Step 1 */}
          <div className="flex items-start space-x-6 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-2 border-purple-200 dark:border-purple-800">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                1
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <Search className="h-6 w-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Subscribe to Prompts
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Choose from AI-generated prompts based on your industry. These are the questions your potential customers ask AI chatbots.
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  Example: &quot;What are the best GEO tools for 2025?&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-6 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                2
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <Bell className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Daily Monitoring
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                We automatically run your prompts on ChatGPT, Claude, Gemini, and Perplexity every day. No manual work needed!
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-700">
                  🤖
                </div>
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-700">
                  💬
                </div>
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-700">
                  ✨
                </div>
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-700">
                  🔍
                </div>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium ml-2">
                  Tested across all major AI platforms
                </span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-6 p-6 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-2 border-green-200 dark:border-green-800">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                3
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Track Your Rankings
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                See if your brand was mentioned, your position in the response, sentiment analysis, and how you compare to competitors.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700 text-center">
                  <div className="text-2xl font-bold text-green-600">#2</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Position</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700 text-center">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Detection</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700 text-center">
                  <div className="text-2xl font-bold text-green-600">😊</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Positive</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start space-x-6 p-6 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-2 border-orange-200 dark:border-orange-800">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                4
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="h-6 w-6 text-orange-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Optimize Your Content
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Use our Content Studio and Audit tools to improve your website content for better AI visibility. Get real-time GEO scores and actionable suggestions.
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                  ✅ Increase citations • ✅ Improve rankings • ✅ Beat competitors
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <button
            onClick={onNext}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>I Understand, Let&apos;s Setup</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

