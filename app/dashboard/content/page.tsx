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

const defaultScores = {
  geoScore: 0,
  citationLikelihood: 0,
  readability: 0,
  structure: 0,
  entityCoverage: 0,
  factualDensity: 0,
  sourceQuality: 0,
  suggestions: []
};

// No default suggestions - only show real AI suggestions

export default function ContentStudioPage() {
  const [content, setContent] = useState(`Waarom AI Optimalisatie Belangrijk Is

AI zoekmachines zoals ChatGPT en Gemini worden steeds populairder. Mensen stellen vragen aan deze AI systemen in plaats van Google. Als jouw bedrijf niet in deze AI antwoorden voorkomt, mis je veel potentiële klanten.

Hoe AI Jouw Content Vindt

AI systemen lezen miljoenen websites en onthouden welke content het beste is. Ze kijken naar:

- Duidelijke structuur met kopjes
- Concrete feiten en voorbeelden  
- Betrouwbare bronnen
- Goede leesbaarheid

Tips voor Betere Resultaten

1. Gebruik korte zinnen die makkelijk te begrijpen zijn
2. Geef concrete voorbeelden en cijfers
3. Leg vaktermen uit alsof je het aan een kind vertelt
4. Verdeel je tekst in korte paragrafen met tussenkopjes

Begin Vandaag

Check jouw huidige website teksten met deze tool. Je ziet direct wat goed is en wat beter kan. Verbeter stap voor stap en zie hoe jouw AI score stijgt!`);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(defaultScores);

  const handleAnalyze = async () => {
    console.log('Starting analysis...', { contentLength: content.length });
    setAnalyzing(true);
    
    try {
      const response = await fetch('/api/content/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Analysis successful:', data);
        setAnalysis(data);
      } else {
        const errorData = await response.json();
        console.error('❌ API error:', response.status, errorData);
        
        let errorMessage = errorData.error || 'Er ging iets mis';
        if (errorData.message) {
          errorMessage += '\n\n' + errorData.message;
        }
        
        alert('⚠️ Analyse mislukt\n\n' + errorMessage);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      alert('⚠️ Netwerkfout\n\nKon geen verbinding maken met de server. Check je internetverbinding.');
    } finally {
      console.log('Analysis complete');
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">✨ Content Checker</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Test hoe goed jouw content scoort bij AI zoekmachines zoals ChatGPT en Gemini
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap"
        >
          <Sparkles className={`h-6 w-6 ${analyzing ? 'animate-pulse' : ''}`} />
          <span>{analyzing ? 'Bezig met analyseren...' : 'Check Mijn Score'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Edit className="h-6 w-6 text-purple-600" />
                <span>Jouw Content</span>
              </CardTitle>
              <CardDescription className="text-base">
                Plak hier de tekst die je wilt laten checken - bijvoorbeeld een blog artikel, product beschrijving, of website tekst
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[600px] px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base leading-relaxed resize-none"
                placeholder="Plak hier jouw tekst... 

Bijvoorbeeld:
- Een blog artikel
- Product beschrijving  
- Website tekst
- Social media post

Wij checken dan hoe goed AI zoekmachines zoals ChatGPT jouw content kunnen vinden en begrijpen."
              />
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <span className="font-medium">📊 {content.length.toLocaleString()} tekens • {content.split(' ').filter(w => w.length > 0).length} woorden</span>
                <span className="text-xs">💡 Tip: Langere content (500+ woorden) geeft betere resultaten</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-6">
          {/* AI Score */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-2 border-purple-200 dark:border-purple-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-xl">🎯 Jouw AI Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-7xl font-black text-purple-600 dark:text-purple-400 mb-3">
                  {analysis.geoScore}
                </div>
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  van de 100 punten
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${analysis.geoScore}%` }}
                  />
                </div>
                <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {analyzing ? '⏳ Bezig met analyseren...' : 
                     analysis.geoScore === 0 ? '👆 Klik op "Check Mijn Score" om te beginnen' :
                     analysis.geoScore >= 80 ? '🎉 Uitstekend! AI vindt jouw content makkelijk' :
                     analysis.geoScore >= 60 ? '👍 Goed! Nog ruimte voor verbetering' :
                     '💡 Check de tips hieronder voor betere resultaten'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dimension Scores */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-base">📊 Gedetailleerde Scores</CardTitle>
              <CardDescription>Hoe goed scoort jouw content op verschillende punten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🔗 Vindbaarheid</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analysis.citationLikelihood}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.citationLikelihood}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hoe makkelijk AI jouw content kan vinden</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📋 Structuur</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analysis.structure}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.structure}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hoe overzichtelijk jouw content is</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📊 Feiten & Data</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analysis.factualDensity}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.factualDensity}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hoeveel concrete feiten je gebruikt</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📖 Leesbaarheid</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analysis.readability}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-yellow-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.readability}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hoe makkelijk te begrijpen je tekst is</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🏷️ Duidelijkheid</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analysis.entityCoverage}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-orange-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.entityCoverage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hoe duidelijk je belangrijke termen uitlegt</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">⭐ Betrouwbaarheid</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analysis.sourceQuality}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-cyan-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.sourceQuality}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Kwaliteit van bronnen die je gebruikt</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                <span>💡 Tips om te Verbeteren</span>
              </CardTitle>
              <CardDescription>Direct toepasbare verbeterpunten</CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.suggestions && analysis.suggestions.length > 0 ? (
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 ${
                      suggestion.type === 'high' ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30' :
                      suggestion.type === 'medium' ? 'border-yellow-300 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30' :
                      'border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        suggestion.type === 'high' ? 'bg-red-100 dark:bg-red-900/50' :
                        suggestion.type === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/50' :
                        'bg-blue-100 dark:bg-blue-900/50'
                      }`}>
                        {suggestion.type === 'high' ? (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        ) : suggestion.type === 'medium' ? (
                          <Info className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            suggestion.type === 'high' ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200' :
                            suggestion.type === 'medium' ? 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                            'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          }`}>
                            {suggestion.type === 'high' ? 'BELANGRIJK' : suggestion.type === 'medium' ? 'TIP' : 'GOED BEZIG'}
                          </span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            {suggestion.impact}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                          {suggestion.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    ⬆️ Klik op "Check Mijn Score" om AI suggesties te krijgen
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

