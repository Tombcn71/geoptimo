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
      setCompetitors(data);
    } catch (error) {
      console.error('Error fetching competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading competitors...</div>
      </div>
    );
  }

  const yourBrand = competitors.find(c => c.isYou);
  const yourRanking = competitors.findIndex(c => c.isYou) + 1;
  const gapToLeader = yourBrand && competitors[0] ? competitors[0].visibilityScore - yourBrand.visibilityScore : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Competitor Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Compara tu rendimiento con competidores en resultados de IA
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tu Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">#{yourRanking}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              De {competitors.length} competidores
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Gap al Líder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600">{gapToLeader > 0 ? `-${Math.round(gapToLeader)}` : '0'}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Puntos de visibility score
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
              {yourBrand && yourBrand.sentiment === Math.max(...competitors.map(c => c.sentiment)) ? 'Mejor' : 'Tu'} sentiment score
            </p>
          </CardContent>
        </Card>
      </div>

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
                    Brand
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center justify-center space-x-1">
                      <span>Visibility</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Sentiment
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Top 3 %
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Mentions
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Avg Pos
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Detection
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Citations
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Trend
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
                              You
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
            <span>Competitive Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                💡 Oportunidad: Mejorar Detection Rate
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Competitor A tiene 17% mejor detection rate. Considera suscribirte a más prompts relevantes.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                🎯 Fortaleza: Excellent Brand Sentiment
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tu sentiment score (92%) es el más alto. Continúa con tu estrategia de contenido actual.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                📈 Acción Recomendada: Aumentar Domain Citations
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gap de 133 citations vs líder. Focus en crear contenido citable de alta calidad.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

