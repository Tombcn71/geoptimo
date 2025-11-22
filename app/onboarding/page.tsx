"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Sparkles, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Step components
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
  { id: 1, title: "Domain", component: StepDomain },
  { id: 2, title: "Details", component: StepBrandDetails },
  { id: 3, title: "Aliases", component: StepAliases },
  { id: 4, title: "Setup", component: StepSetup },
  { id: 5, title: "Prompts", component: StepPrompts },
  { id: 6, title: "Pricing", component: StepPricing },
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
      console.log('Creating brand with data:', { ...brandData, plan });
      
      // Save brand data to database
      const response = await fetch('/api/brands/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...brandData, plan }),
      });

      const result = await response.json();
      console.log('Brand creation result:', result);

      if (response.ok && result.success) {
        alert('✅ Brand created successfully! Welcome to Geoptimo!');
        router.push('/dashboard');
      } else {
        alert(`❌ Failed to create brand: ${result.error || 'Unknown error'}\n\nDetails: ${result.details || 'No details'}`);
        console.error('Failed to create brand:', result);
      }
    } catch (error) {
      console.error('Error creating brand:', error);
      alert(`❌ Error creating brand: ${(error as Error).message}`);
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
          {...(currentStep === 6 ? { onComplete: handleComplete } : {})}
        />
      </div>
    </div>
  );
}

