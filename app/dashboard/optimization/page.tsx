"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Target
} from "lucide-react";
import { useState } from "react";

const contentAnalysis = {
  score: 6.5,
  readability: 75,
  structure: 82,
  entityCoverage: 68,
  aiCitability: 71
};

const suggestions = [
  {
    priority: "alta",
    category: "Estructura",
    title: "Agregar más subtítulos descriptivos",
    description: "Los motores de IA prefieren contenido bien estructurado con subtítulos claros que describan cada sección.",
    impact: "+1.2 puntos de citabilidad",
    implementation: "Divide secciones largas en subsecciones con encabezados H3 descriptivos"
  },
  {
    priority: "alta",
    category: "Entidades",
    title: "Incluir definiciones de términos clave",
    description: "Agregar definiciones explícitas ayuda a los modelos de IA a entender y citar tu contenido correctamente.",
    impact: "+0.9 puntos de citabilidad",
    implementation: "Agrega un glosario o define términos técnicos en su primera mención"
  },
  {
    priority: "media",
    category: "Datos",
    title: "Agregar más estadísticas y datos concretos",
    description: "Los motores de IA valoran contenido con datos verificables y estadísticas actuales.",
    impact: "+0.7 puntos de citabilidad",
    implementation: "Incluye estadísticas recientes con fuentes citadas"
  },
  {
    priority: "media",
    category: "Formato",
    title: "Usar listas y tablas para datos comparativos",
    description: "El contenido estructurado en listas y tablas es más fácil de extraer para IA.",
    impact: "+0.6 puntos de citabilidad",
    implementation: "Convierte párrafos descriptivos en listas ordenadas o tablas"
  },
  {
    priority: "baja",
    category: "Enlaces",
    title: "Agregar enlaces a fuentes autoritarias",
    description: "Enlaces a fuentes confiables mejoran la credibilidad de tu contenido.",
    impact: "+0.4 puntos de citabilidad",
    implementation: "Vincula a estudios, investigaciones y sitios de autoridad relevantes"
  }
];

const competitorComparison = [
  { metric: "Longitud de contenido", tuSitio: 1200, competidor: 1800, status: "mejorar" },
  { metric: "Densidad de palabras clave", tuSitio: 2.3, competidor: 1.8, status: "bueno" },
  { metric: "Uso de multimedia", tuSitio: 3, competidor: 7, status: "mejorar" },
  { metric: "Enlaces internos", tuSitio: 8, competidor: 5, status: "bueno" },
];

export default function OptimizationPage() {
  const [contentUrl, setContentUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Optimización de Contenido</h1>
        <p className="text-gray-600 mt-2">
          Mejora tu contenido para mayor citabilidad en motores de IA
        </p>
      </div>

      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle>Analizar Contenido</CardTitle>
          <CardDescription>
            Ingresa la URL del contenido que deseas optimizar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="https://tuempresa.com/articulo"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setAnalyzing(true)}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>Analizar</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {contentAnalysis.score}
            </div>
            <div className="text-sm text-gray-600">Puntuación Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {contentAnalysis.readability}%
            </div>
            <div className="text-sm text-gray-600">Legibilidad</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {contentAnalysis.structure}%
            </div>
            <div className="text-sm text-gray-600">Estructura</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {contentAnalysis.entityCoverage}%
            </div>
            <div className="text-sm text-gray-600">Cobertura</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-cyan-600 mb-2">
              {contentAnalysis.aiCitability}%
            </div>
            <div className="text-sm text-gray-600">Citabilidad IA</div>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            <span>Sugerencias de Optimización</span>
          </CardTitle>
          <CardDescription>
            Recomendaciones priorizadas para mejorar tu contenido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-5 border-l-4 rounded-lg ${
                  suggestion.priority === "alta" ? "border-red-500 bg-red-50" :
                  suggestion.priority === "media" ? "border-yellow-500 bg-yellow-50" :
                  "border-blue-500 bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        suggestion.priority === "alta" ? "bg-red-200 text-red-800" :
                        suggestion.priority === "media" ? "bg-yellow-200 text-yellow-800" :
                        "bg-blue-200 text-blue-800"
                      }`}>
                        Prioridad {suggestion.priority}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                        {suggestion.category}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{suggestion.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          {suggestion.impact}
                        </span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Target className="h-4 w-4 text-purple-600 mt-0.5" />
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Implementación: </span>
                          {suggestion.implementation}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Aplicar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación con Competidores</CardTitle>
          <CardDescription>
            Cómo se compara tu contenido con los líderes de la industria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitorComparison.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">{item.metric}</span>
                  {item.status === "bueno" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Bien posicionado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Puede mejorar
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Tu sitio</span>
                      <span className="font-semibold text-purple-600">{item.tuSitio}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600"
                        style={{ width: `${(item.tuSitio / Math.max(item.tuSitio, item.competidor)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Promedio competidores</span>
                      <span className="font-semibold text-gray-900">{item.competidor}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900"
                        style={{ width: `${(item.competidor / Math.max(item.tuSitio, item.competidor)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


