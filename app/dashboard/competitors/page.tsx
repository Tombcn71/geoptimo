"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp,
  TrendingDown,
  Award,
  Eye,
  MessageSquare,
  ArrowUpDown
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

type SortField = "visibility" | "sentiment" | "mentions" | "position" | "detection" | "citations";

interface Competitor {
  name: string;
  domain: string;
  visibilityScore: number;
  sentiment: number;
  topThreeVis: number;
  mentions: number;
  avgPosition: number;
  detectionRate: number;
  domainCitations: number;
  trend: string;
  isYou?: boolean;
}

export default function CompetitorsPage() {
  const [sortBy, setSortBy] = useState<SortField>("visibility");
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    try {
      const response = await fetch('/api/competitors');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCompetitors(data);
      } else {
        console.error('API returned non-array data:', data);
        setCompetitors([]);
      }
    } catch (error) {
      console.error('Error fetching competitors:', error);
      setCompetitors([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Cargando competidores...</div>
      </div>
    );
  }

  const yourBrand = competitors.find(c => c.isYou);
  const yourRanking = yourBrand ? competitors.findIndex(c => c.isYou) + 1 : 0;
  const gapToLeader = yourBrand && competitors.length > 0 && competitors[0] ? competitors[0].visibilityScore - yourBrand.visibilityScore : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Análisis de Competidores</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Compara tu rendimiento con competidores en resultados de IA
        </p>
      </div>

      {/* Empty State - No Competitors Yet */}
      {competitors.length === 0 ? (
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6 pb-6">
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Aún No Se Han Detectado Competidores
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Los competidores aparecerán aquí automáticamente cuando ejecutes prompts. 
                La IA detecta qué otras marcas se mencionan junto a la tuya y rastrea su rendimiento.
              </p>
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">1</span>
                  <span>Ve a <strong>Explorador de Prompts</strong></span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</span>
                  <span>Haz clic en <strong>&quot;Ejecutar Ahora&quot;</strong> en un prompt</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">3</span>
                  <span>Los competidores se detectan <strong>automáticamente</strong>!</span>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  href="/dashboard/prompts/explore"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Ir al Explorador de Prompts</span>
                  <ArrowUpDown className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
      {/* Overview Cards */}
      {competitors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tu Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">#{yourRanking || '-'}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                De {competitors.length} competidores
              </p>
            </CardContent>
          </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Brecha con el Líder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600">{gapToLeader > 0 ? `-${Math.round(gapToLeader)}` : '0'}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Puntos de puntuación de visibilidad
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tu Fortaleza
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{yourBrand?.sentiment || 0}%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {yourBrand && yourBrand.sentiment === Math.max(...competitors.map(c => c.sentiment)) ? 'Mejor' : 'Tu'} puntuación de sentimiento
            </p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Why This Matters */}
      {competitors.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg">
                  !
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                  POR QUÉ ESTO ES IMPORTANTE
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  No puedes mejorar lo que no mides. Ve exactamente dónde los competidores te superan y cierra esas brechas.
                </p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Ejemplo: Si el Competidor X está en #1-3 en el 80% de los prompts mientras tú estás en el 30%, sabes que necesitas optimizar!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitors Table */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Ranking Detallado</CardTitle>
          <CardDescription>
            Todas las métricas para cada competidor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Marca
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center justify-center space-x-1">
                      <span>Visibilidad</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Sentimiento
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Top 3 %
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Menciones
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Pos Prom
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Detección
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Citaciones
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Tendencia
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((comp, index) => (
                  <tr
                    key={comp.domain}
                    className={`border-b border-gray-100 dark:border-gray-800 ${
                      comp.isYou ? "bg-purple-50 dark:bg-purple-950/20" : ""
                    } hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {comp.name}
                          </span>
                          {comp.isYou && (
                            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                              Tú
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {comp.domain}
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {comp.visibilityScore}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-green-600">{comp.sentiment}%</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{comp.topThreeVis}%</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {comp.mentions.toLocaleString()}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        #{comp.avgPosition}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-gray-900 dark:text-white">{comp.detectionRate}%</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {comp.domainCitations}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      {comp.trend === "up" ? (
                        <TrendingUp className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span>Insights Competitivos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                💡 Oportunidad: Mejorar Tasa de Detección
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                El Competidor A tiene un 17% mejor tasa de detección. Considera suscribirte a más prompts relevantes.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                🎯 Fortaleza: Excelente Sentimiento de Marca
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tu puntuación de sentimiento (92%) es la más alta. Continúa con tu estrategia de contenido actual.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                📈 Acción Recomendada: Aumentar Citaciones de Dominio
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Brecha de 133 citaciones vs líder. Enfócate en crear contenido de alta calidad citable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
  );
}

