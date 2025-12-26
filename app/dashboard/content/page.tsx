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
  const [content, setContent] = useState(`Why AI Optimization Matters

AI search engines like ChatGPT and Gemini are becoming increasingly popular. People ask questions to these AI systems instead of Google. If your business doesn't appear in these AI answers, you're missing out on many potential customers.

How AI Finds Your Content

AI systems read millions of websites and remember which content is best. They look for:

- Clear structure with headings
- Concrete facts and examples  
- Reliable sources
- Good readability

Tips for Better Results

1. Use short sentences that are easy to understand
2. Provide concrete examples and numbers
3. Explain technical terms as if talking to a beginner
4. Divide your text into short paragraphs with subheadings

Start Today

Check your current website text with this tool. You'll immediately see what's good and what can be improved. Improve step by step and watch your AI score rise!`);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(defaultScores);
  const [error, setError] = useState<{ title: string; message: string; details?: string } | null>(null);

  const handleAnalyze = async () => {
    console.log('Starting analysis...', { contentLength: content.length });
    setAnalyzing(true);
    setError(null); // Clear previous errors
    
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
        setError(null);
      } else {
        const errorData = await response.json();
        console.error('❌ API error:', response.status, errorData);
        
        setError({
          title: errorData.error || 'Análisis fallido',
          message: errorData.message || 'Algo salió mal durante el análisis',
          details: errorData.details || errorData.stack
        });
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setError({
        title: 'Error de Red',
        message: 'No se pudo conectar al servidor. Verifica si el servidor de desarrollo está ejecutándose.',
        details: (error as Error).message
      });
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">✨ Verificador de Contenido</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Prueba qué tan bien puntúa tu contenido con motores de búsqueda IA como ChatGPT y Gemini
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap"
        >
          <Sparkles className={`h-6 w-6 ${analyzing ? 'animate-pulse' : ''}`} />
          <span>{analyzing ? 'Analizando...' : 'Verificar Mi Puntuación'}</span>
        </button>
      </div>

      {/* Error Display - Kopeerbaar! */}
      {error && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-6 w-6" />
              <span>{error.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-700 dark:text-red-300 text-lg font-medium">
              {error.message}
            </p>
            {error.details && (
              <div className="bg-red-100 dark:bg-red-950 p-4 rounded-lg border border-red-300 dark:border-red-700">
                <p className="text-sm text-red-800 dark:text-red-200 font-mono whitespace-pre-wrap">
                  {error.details}
                </p>
              </div>
            )}
            <div className="flex items-start space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-semibold mb-2">💡 Solución:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Create a file <code className="bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">.env.local</code> in your project root</li>
                  <li>Add: <code className="bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">GOOGLE_AI_API_KEY=your_key</code></li>
                  <li>Get your key from: <a href="https://aistudio.google.com/apikey" target="_blank" className="underline font-medium">aistudio.google.com/apikey</a></li>
                  <li>Restart the dev server (Ctrl+C then <code className="bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">npm run dev</code>)</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Edit className="h-6 w-6 text-purple-600" />
                <span>Tu Contenido</span>
              </CardTitle>
              <CardDescription className="text-base">
                Pega el texto que quieres verificar - por ejemplo, un artículo de blog, descripción de producto o texto del sitio web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[600px] px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base leading-relaxed resize-none"
                placeholder="Pega tu texto aquí... 

Por ejemplo:
- Un artículo de blog
- Descripción de producto  
- Texto del sitio web
- Publicación en redes sociales

Verificaremos qué tan bien los motores de búsqueda IA como ChatGPT pueden encontrar y entender tu contenido."
              />
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <span className="font-medium">📊 {content.length.toLocaleString()} characters • {content.split(' ').filter(w => w.length > 0).length} words</span>
                <span className="text-xs">💡 Consejo: Contenido más largo (500+ palabras) da mejores resultados</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-6">
          {/* AI Score */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-2 border-purple-200 dark:border-purple-900 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-xl">🎯 Tu Puntuación IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-7xl font-black text-purple-600 dark:text-purple-400 mb-3">
                  {analysis.geoScore}
                </div>
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  de 100 puntos
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 mb-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${analysis.geoScore}%` }}
                  />
                </div>
                <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {analyzing ? '⏳ Analizando...' : 
                     analysis.geoScore === 0 ? '👆 Haz clic en Verificar Mi Puntuación para comenzar' :
                     analysis.geoScore >= 80 ? '🎉 ¡Excelente! La IA encuentra tu contenido fácilmente' :
                     analysis.geoScore >= 60 ? '👍 ¡Bien! Hay margen de mejora' :
                     '💡 Revisa los consejos a continuación para mejores resultados'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dimension Scores */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-base">📊 Puntuaciones Detalladas</CardTitle>
              <CardDescription>Cómo puntúa tu contenido en diferentes aspectos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🔗 Discoverability</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analysis.citationLikelihood}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.citationLikelihood}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Qué tan fácilmente la IA puede encontrar tu contenido</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📋 Structure</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analysis.structure}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.structure}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Qué tan bien organizado está tu contenido</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📊 Facts & Data</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analysis.factualDensity}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.factualDensity}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cuántos hechos concretos usas</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📖 Readability</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analysis.readability}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-yellow-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.readability}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Qué tan fácil es entender tu texto</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🏷️ Clarity</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analysis.entityCoverage}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-orange-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.entityCoverage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Qué tan claramente explicas términos importantes</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">⭐ Reliability</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{analysis.sourceQuality}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-cyan-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.sourceQuality}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Calidad de las fuentes que usas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                <span>💡 Consejos para Mejorar</span>
              </CardTitle>
              <CardDescription>Puntos de mejora directamente aplicables</CardDescription>
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
                            {suggestion.type === 'high' ? 'IMPORTANT' : suggestion.type === 'medium' ? 'TIP' : 'GOOD JOB'}
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
                    ⬆️ Haz clic en &quot;Verificar Mi Puntuación&quot; para obtener sugerencias IA
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

