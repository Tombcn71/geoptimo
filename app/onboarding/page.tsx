"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Sparkles, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Step components
import StepWelcome from "@/components/onboarding/StepWelcome";
import StepHowItWorks from "@/components/onboarding/StepHowItWorks";
import StepDomain from "@/components/onboarding/StepDomain";
import StepBrandDetails from "@/components/onboarding/StepBrandDetails";
import StepAliases from "@/components/onboarding/StepAliases";
import StepSetup from "@/components/onboarding/StepSetup";
import StepPrompts from "@/components/onboarding/StepPrompts";
import StepPricing from "@/components/onboarding/StepPricing";

interface BrandData {
  domain: string;
  favicon?: string;
  name: string;
  category: string;
  description: string;
  aliases: string[];
  selectedPrompts: string[];
  plan?: string;
}

const STEPS = [
  { id: 1, title: "Welcome", component: StepWelcome, hideProgress: true },
  { id: 2, title: "How It Works", component: StepHowItWorks, hideProgress: true },
  { id: 3, title: "Domain", component: StepDomain },
  { id: 4, title: "Details", component: StepBrandDetails },
  { id: 5, title: "Aliases", component: StepAliases },
  { id: 6, title: "Setup", component: StepSetup },
  { id: 7, title: "Prompts", component: StepPrompts },
  { id: 8, title: "Pricing", component: StepPricing },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [brandData, setBrandData] = useState<BrandData>({
    domain: "",
    name: "",
    category: "",
    description: "",
    aliases: [],
    selectedPrompts: [],
  });

  const handleNext = (data?: Partial<BrandData>) => {
    if (data) {
      setBrandData({ ...brandData, ...data });
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async (plan?: string) => {
    try {
      // Save brand data to database
      const response = await fetch('/api/brands/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...brandData, plan }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Failed to create brand');
      }
    } catch (error) {
      console.error('Error creating brand:', error);
    }
  };


  const currentStepData = STEPS[currentStep - 1];
  const CurrentStepComponent = currentStepData.component;
  const showProgress = !currentStepData.hideProgress;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.filter(s => !s.hideProgress).map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep > step.id
                      ? "bg-purple-600 border-purple-600 text-white"
                      : currentStep === step.id
                      ? "bg-white dark:bg-gray-800 border-purple-600 text-purple-600"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < STEPS.filter(s => !s.hideProgress).length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-all ${
                      currentStep > step.id
                        ? "bg-purple-600"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between px-2">
            {STEPS.filter(s => !s.hideProgress).map((step) => (
              <div
                key={step.id}
                className={`text-xs font-medium transition-all ${
                  currentStep >= step.id
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Step Content */}
        <CurrentStepComponent
          data={brandData}
          onNext={handleNext}
          onBack={handleBack}
          {...(currentStep === 8 ? { onComplete: handleComplete } : {})}
        />
      </div>
    </div>
  );
}

