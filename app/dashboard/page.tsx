"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MessageSquare, 
  Award,
  ArrowUpRight,
  Target,
  Search,
  Loader2,
  Activity,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import Link from "next/link";

interface MentionData {
  date: string;
  mentions: number;
}

interface TopQuery {
  query: string;
  mentions: number;
  trend: string;
}

interface Metrics {
  visibilityScore: number;
  sentiment: number;
  topThreeVis: number;
  mentions: number;
  avgPosition: number;
  detectionRate: number;
  domainCitations: number;
  mentionsData?: MentionData[];
  topQueries?: TopQuery[];
}

interface RecentActivity {
  id: number;
  runAt: string;
  provider: string;
  mentioned: boolean;
  position: number | null;
  sentiment: string;
  promptId: number;
  promptText: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      // Fetch metrics
      fetch('/api/dashboard/metrics')
        .then(res => res.json())
        .then(data => {
          setMetrics(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching metrics:', error);
          setLoading(false);
        });
      
      // Fetch recent activity
      fetch('/api/dashboard/activity')
        .then(res => res.json())
        .then(data => {
          if (data.activities) {
            setRecentActivity(data.activities);
          }
        })
        .catch(error => {
          console.error('Error fetching activity:', error);
        });
    }
  }, [status]);

  // Show loading while checking authentication
  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Cargando estadísticas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tu visibilidad en motores de búsqueda IA de un vistazo
        </p>
      </div>

      {/* Key Metrics - Top 4 from Demo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Visibility Score */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Puntuación de Visibilidad</span>
              </div>
              <Tooltip content="Con qué frecuencia aparece tu marca en respuestas IA" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {metrics?.visibilityScore || 0}%
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% vs. semana anterior
            </p>
            <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-2">
              💡 Muestra si tus esfuerzos GEO están funcionando
            </p>
          </CardContent>
        </Card>

        {/* 2. Brand Sentiment */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Sentimiento de Marca</span>
              </div>
              <Tooltip content="Qué tan positivo habla la IA sobre tu marca" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              {metrics?.sentiment || 0}%
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Tendencia positiva
            </p>
            <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-2">
              💡 Menciones positivas = más confianza = más clientes
            </p>
          </CardContent>
        </Card>

        {/* 3. Average Position */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Posición Promedio</span>
              </div>
              <Tooltip content="Dónde clasificas en respuestas IA (1-10)" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              #{metrics?.avgPosition || 0}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Subido 2 posiciones
            </p>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-2">
              💡 La posición 1-3 obtiene el 80% de la atención
            </p>
          </CardContent>
        </Card>

        {/* 4. Detection Rate */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Tasa de Detección</span>
              </div>
              <Tooltip content="% de búsquedas relevantes donde eres mencionado" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {metrics?.detectionRate || 0}%
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% vs. semana anterior
            </p>
            <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-2">
              💡 Mayor porcentaje = más oportunidades aprovechadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Mentions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>Total de Menciones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics?.mentions || 0}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Respuestas IA que mencionan tu marca
            </p>
          </CardContent>
        </Card>

        {/* Top 3 Visibility */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Award className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>Apariciones Top 3</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics?.topThreeVis || 0}%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Número de veces en posiciones top 3
            </p>
          </CardContent>
        </Card>

        {/* Domain Citations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>Citas de Dominio</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics?.domainCitations || 0}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Veces que la IA citó tu sitio web como fuente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentions Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Menciones (Últimos 7 Días)</CardTitle>
            <CardDescription>
              Rastrea con qué frecuencia tu marca es mencionada por motores IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metrics?.mentionsData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mentions" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Búsquedas Que Te Mencionan</CardTitle>
            <CardDescription>
              Búsquedas más comunes donde aparece tu marca
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(metrics?.topQueries && metrics.topQueries.length > 0) ? metrics.topQueries.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.query}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.mentions} menciones
                    </p>
                  </div>
                  {item.trend === 'up' ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aún no hay datos de consultas disponibles
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimas ejecuciones de prompts y menciones de marca
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(recentActivity && recentActivity.length > 0) ? (
            <div className="space-y-3">
              {recentActivity.slice(0, 10).map((activity) => (
                <Link
                  key={activity.id}
                  href={`/dashboard/prompts/${activity.promptId}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.mentioned 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {activity.mentioned ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {activity.promptText.substring(0, 60)}...
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(activity.runAt).toLocaleDateString('nl-NL', { 
                            day: 'numeric', 
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {activity.mentioned && activity.position && (
                          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                            Posición #{activity.position}
                          </span>
                        )}
                        {activity.sentiment && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            activity.sentiment === 'positive' 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : activity.sentiment === 'negative'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}>
                            {activity.sentiment === 'positive' ? '😊 Positivo' : activity.sentiment === 'negative' ? '😟 Negativo' : '😐 Neutral'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Aún No Hay Actividad
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Elige prompts y ejecútalos para monitorear tu visibilidad IA
              </p>
              <Link
                href="/dashboard/prompts/explore"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Search className="h-5 w-5" />
                <span>Explorar Prompts</span>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
