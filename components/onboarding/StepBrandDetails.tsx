"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const CATEGORIES = [
  "SaaS",
  "E-commerce",
  "Food Delivery",
  "Fintech",
  "Healthcare",
  "Education",
  "Real Estate",
  "Travel",
  "Marketing",
  "Consulting",
  "Other"
];

export default function StepBrandDetails({ data, onNext, onBack }: Props) {
  const [name, setName] = useState(data.name || "");
  const [category, setCategory] = useState(data.category || "");
  const [description, setDescription] = useState(data.description || "");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!name || !category || !description) {
      setError("Please fill in all fields");
      return;
    }
    
    if (description.length < 20) {
      setError("Please provide a more detailed description (at least 20 characters)");
      return;
    }
    
    onNext({ name, category, description });
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          {data.favicon ? (
            <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800 flex items-center justify-center overflow-hidden">
              <Image 
                src={data.favicon} 
                alt="Brand favicon" 
                width={48} 
                height={48}
                className="w-12 h-12"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900 border-2 border-purple-200 dark:border-purple-800 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl">Brand Details</CardTitle>
        <CardDescription className="text-base">
          Tell us about your brand so we can provide better insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Brand Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Brand Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Acme Inc."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">
            e.g., Food Delivery, E-commerce, SaaS
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Brief description of your brand..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
          />
          <p className="text-xs text-gray-500">
            {description.length} / 500 characters
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </p>
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
            disabled={!name || !category || !description}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

