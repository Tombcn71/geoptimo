"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, X, ArrowLeft, Plus } from "lucide-react";

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function StepAliases({ data, onNext, onBack }: Props) {
  const [aliases, setAliases] = useState<string[]>(data.aliases || []);
  const [newAlias, setNewAlias] = useState("");

  const handleAddAlias = () => {
    if (newAlias.trim() && !aliases.includes(newAlias.trim())) {
      setAliases([...aliases, newAlias.trim()]);
      setNewAlias("");
    }
  };

  const handleRemoveAlias = (index: number) => {
    setAliases(aliases.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    onNext({ aliases });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAlias();
    }
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900 border-2 border-purple-200 dark:border-purple-800 flex items-center justify-center">
            <Tag className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <CardTitle className="text-2xl">Brand Aliases</CardTitle>
        <CardDescription className="text-base">
          Add alternative names or variations of your brand
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add an alias (e.g., door dash, dd)"
              value={newAlias}
              onChange={(e) => setNewAlias(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleAddAlias}
              disabled={!newAlias.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add</span>
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Press Enter or click Add to include the alias
          </p>
        </div>

        {/* Alias List */}
        <div className="min-h-[200px] p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          {aliases.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Tag className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
                No aliases added yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Add common misspellings, abbreviations, or alternative names
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {aliases.map((alias, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-800"
                >
                  <span className="font-medium">{alias}</span>
                  <button
                    onClick={() => handleRemoveAlias(index)}
                    className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 <strong>Tip:</strong> Include common misspellings, abbreviations, or how customers refer to your brand. 
            For example, &quot;DoorDash&quot; might also be &quot;door dash&quot;, &quot;DD&quot;, or &quot;Doordash&quot;.
          </p>
        </div>

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
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition-all"
          >
            Continue
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

