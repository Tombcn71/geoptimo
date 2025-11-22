"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, Zap, BarChart3, Target } from "lucide-react";

interface Props {
  onNext: () => void;
  onSkip?: () => void;
}

export default function StepWelcome({ onNext, onSkip }: Props) {
  return (
    <Card className="border-none shadow-2xl bg-white dark:bg-gray-900">
      <CardContent className="pt-12 pb-12 px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mb-6 animate-pulse">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Geoptimo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The first platform to track and optimize your brand&apos;s visibility in AI search results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-2 border-purple-200 dark:border-purple-800">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Track AI Mentions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              See when ChatGPT, Gemini, Claude and Perplexity mention your brand
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-2 border-blue-200 dark:border-blue-800">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Monitor Rankings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your position in AI responses vs competitors
            </p>
          </div>

          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-2 border-green-200 dark:border-green-800">
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Optimize Content
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get AI-powered suggestions to improve your visibility
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                💡
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What is GEO (Generative Engine Optimization)?
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Just like SEO helps you rank on Google, <strong>GEO helps you rank in AI chatbots</strong> like ChatGPT, Claude, and Gemini. 
                When people ask AI questions about your industry, you want your brand to be mentioned and recommended.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-3">
          <button
            onClick={onNext}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>Let&apos;s Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          {onSkip && (
            <button
              onClick={onSkip}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
            >
              Skip introduction, go straight to setup →
            </button>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Takes 2 minutes • No credit card required
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

