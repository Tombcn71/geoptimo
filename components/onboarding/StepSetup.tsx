"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function StepSetup({ data, onNext }: Props) {
  useEffect(() => {
    // Simulate setup process
    const timer = setTimeout(() => {
      onNext({});
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <Card className="border-2 shadow-xl">
      <CardContent className="py-16">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          {/* Animated Icon */}
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <div className="w-24 h-24 rounded-full bg-purple-400/30"></div>
            </div>
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-white animate-pulse" />
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Setting up your brand intelligence
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This will only take a moment...
            </p>
          </div>

          {/* Spinner */}
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />

          {/* Progress Steps */}
          <div className="w-full max-w-md space-y-3 text-left">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Processing brand information
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Loader2 className="w-2 h-2 text-purple-600 animate-spin" />
              <span className="text-gray-600 dark:text-gray-400">
                Analyzing your domain
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              <span className="text-gray-400 dark:text-gray-600">
                Generating prompt suggestions
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

