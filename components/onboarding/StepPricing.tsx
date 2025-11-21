"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Crown, Rocket, Building, ArrowLeft } from "lucide-react";

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  onComplete: (plan: string) => void;
}

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    icon: Rocket,
    description: "For individuals and startups exploring AI visibility.",
    priceMonthly: 40,
    priceYearly: 490,
    originalYearly: 588,
    features: [
      "15 monitoring prompts",
      "2 brands",
      "Unlimited audit reports/month",
      "Unlimited content analyses",
      "Add 2 more users at $20/mo each",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    icon: Crown,
    badge: "Most Popular",
    description: "Ideal for Agencies and SMEs needing advanced insights.",
    priceMonthly: 82,
    priceYearly: 990,
    originalYearly: 1188,
    features: [
      "100 monitoring prompts",
      "10 brands",
      "Unlimited audit reports/month",
      "Unlimited content analyses",
      "Add 5 more users at $30/mo each",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building,
    description: "For enterprises requiring extensive capabilities.",
    priceMonthly: 165,
    priceYearly: 1990,
    originalYearly: 2388,
    features: [
      "400 monitoring prompts",
      "50 brands",
      "Unlimited audit reports/month",
      "Unlimited content analyses",
      "Add 10 more users at $40/mo each",
    ],
  },
];

export default function StepPricing({ data, onBack, onComplete }: Props) {
  const [isYearly, setIsYearly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("professional");

  const handleStartTrial = () => {
    onComplete(selectedPlan);
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">Choose Your Plan</CardTitle>
          <CardDescription className="text-base">
            Start with a 14-day trial. No credit card required.
          </CardDescription>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-3 pt-4">
            <span className={`text-sm ${!isYearly ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isYearly ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isYearly ? 'transform translate-x-7' : ''
                }`}
              />
            </button>
            <span className={`text-sm ${isYearly ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                Save 2 months free
              </span>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          const isProfessional = plan.id === "professional";

          return (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all ${
                isSelected
                  ? 'border-4 border-purple-500 shadow-2xl'
                  : 'border-2 hover:border-purple-300 dark:hover:border-purple-700'
              } ${
                isProfessional ? 'md:-mt-4 md:mb-4 scale-105' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {plan.badge}
                </div>
              )}
              
              <CardHeader className="text-center space-y-3 pb-4">
                <div className="flex justify-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isProfessional
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                      : 'bg-purple-100 dark:bg-purple-900'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      isProfessional ? 'text-white' : 'text-purple-600'
                    }`} />
                  </div>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm min-h-[40px]">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pricing */}
                <div className="text-center space-y-2">
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${isYearly ? plan.priceYearly : plan.priceMonthly}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      /{isYearly ? 'yr' : 'mo'}
                    </span>
                  </div>
                  {!isYearly && (
                    <p className="text-sm text-gray-500">
                      ${plan.priceMonthly}/mo
                    </p>
                  )}
                  {isYearly && (
                    <p className="text-sm text-gray-500">
                      <span className="line-through">${plan.originalYearly}</span>{' '}
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        ${plan.priceYearly} /yr
                      </span>
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Select Button */}
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trial Info */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="py-4">
          <p className="text-sm text-center text-blue-700 dark:text-blue-300">
            All plans include a <strong>14-day free trial</strong>. Cancel anytime during the trial period with no charges.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex items-center justify-center space-x-2 flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-medium text-lg transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <button
          onClick={handleStartTrial}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl"
        >
          Start 14-Day Trial
        </button>
      </div>
    </div>
  );
}

