"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Edit,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw
} from "lucide-react";
import { useState } from "react";

const geoScore = {
  overall: 78,
  citationLikelihood: 82,
  readability: 75,
  structure: 88,
  entityCoverage: 71,
  factualDensity: 79,
  sourceQuality: 80
};

const suggestions = [
  {
    type: "high",
    category: "Structure",
    message: "Add more descriptive subheadings for better AI parsing",
    impact: "+8 points"
  },
  {
    type: "medium",
    category: "Entities",
    message: "Include definitions for key technical terms",
    impact: "+5 points"
  },
  {
    type: "low",
    category: "Citations",
    message: "Add 2-3 authoritative source links",
    impact: "+3 points"
  }
];

export default function ContentStudioPage() {
  const [content, setContent] = useState(`# The Ultimate Guide to GEO Optimization

Generative Engine Optimization (GEO) is revolutionizing how brands appear in AI-powered search results.

## What is GEO?

GEO focuses on optimizing your content to be discovered, cited, and recommended by AI models like ChatGPT, Claude, and Perplexity.

## Key Strategies

1. **Structured Data**: Use schema markup
2. **Clear Headings**: Help AI understand content hierarchy
3. **Authoritative Sources**: Link to trusted domains
4. **Factual Density**: Include specific data and statistics

## Implementation

To implement GEO effectively...`);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(geoScore);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/content/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Studio</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Escribe y optimiza contenido con análisis GEO en tiempo real
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${analyzing ? 'animate-spin' : ''}`} />
          <span>{analyzing ? 'Analizando...' : 'Analizar'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>Editor</span>
              </CardTitle>
              <CardDescription>
                Escribe tu contenido en formato Markdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[600px] px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono text-sm"
                placeholder="Start writing your GEO-optimized content..."
              />
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{content.length} characters • {content.split(' ').length} words</span>
                <span>Última análisis: hace 2 min</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-6">
          {/* GEO Score */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-2 border-purple-200 dark:border-purple-900">
            <CardHeader>
              <CardTitle className="text-center">GEO Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {analysis.geoScore || geoScore.overall}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  out of 100
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${analysis.geoScore || geoScore.overall}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {analyzing ? 'Analyzing...' : 'Good! Tu contenido está bien optimizado'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dimension Scores */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-sm">Score por Dimensión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Citation Likelihood</span>
                    <span className="font-bold text-gray-900 dark:text-white">{analysis.citationLikelihood || geoScore.citationLikelihood}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.citationLikelihood || geoScore.citationLikelihood}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Structure</span>
                    <span className="font-bold text-gray-900 dark:text-white">{analysis.structure || geoScore.structure}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.structure || geoScore.structure}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Factual Density</span>
                    <span className="font-bold text-gray-900 dark:text-white">{analysis.factualDensity || geoScore.factualDensity}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.factualDensity || geoScore.factualDensity}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Readability</span>
                    <span className="font-bold text-gray-900 dark:text-white">{analysis.readability || geoScore.readability}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.readability || geoScore.readability}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Entity Coverage</span>
                    <span className="font-bold text-gray-900 dark:text-white">{analysis.entityCoverage || geoScore.entityCoverage}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.entityCoverage || geoScore.entityCoverage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Source Quality</span>
                    <span className="font-bold text-gray-900 dark:text-white">{analysis.sourceQuality || geoScore.sourceQuality}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-cyan-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.sourceQuality || geoScore.sourceQuality}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-yellow-600" />
                <span>Sugerencias de Mejora</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(analysis.suggestions || suggestions).map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      suggestion.type === 'high' ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30' :
                      suggestion.type === 'medium' ? 'border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/30' :
                      'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30'
                    }`}
                  >
                    <div className="flex items-start space-x-2 mb-2">
                      {suggestion.type === 'high' ? (
                        <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      ) : suggestion.type === 'medium' ? (
                        <Info className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {suggestion.category}
                          </span>
                          <span className="text-xs font-bold text-green-600">
                            {suggestion.impact}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {suggestion.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

