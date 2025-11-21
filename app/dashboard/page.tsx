"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MessageSquare, 
  Award,
  ArrowUpRight
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const mentionsData = [
  { date: "Lun", menciones: 45 },
  { date: "Mar", menciones: 52 },
  { date: "Mié", menciones: 48 },
  { date: "Jue", menciones: 61 },
  { date: "Vie", menciones: 55 },
  { date: "Sáb", menciones: 67 },
  { date: "Dom", menciones: 58 },
];

const platformData = [
  { name: "ChatGPT", value: 45, color: "#000000" },
  { name: "Claude", value: 30, color: "#404040" },
  { name: "Perplexity", value: 15, color: "#808080" },
  { name: "Google AI", value: 10, color: "#C0C0C0" },
];

const topQueries = [
  { query: "mejores herramientas de marketing IA", mentions: 23, trend: "up" },
  { query: "plataformas de optimización SEO", mentions: 18, trend: "up" },
  { query: "software de análisis de contenido", mentions: 15, trend: "down" },
  { query: "herramientas de monitoreo de marca", mentions: 12, trend: "up" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel Principal</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Vista general de tu rendimiento en motores de IA
        </p>
      </div>

      {/* Getting Started Checklist */}
      <Card className="border-2 border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🚀 Comienza con Geoptimo</span>
          </CardTitle>
          <CardDescription>
            Completa estos pasos para optimizar tu presencia en motores de IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors group">
              <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Configura tu perfil de marca y rastrea visibilidad en IA
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Define tu marca, productos y palabras clave objetivo</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors group">
              <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Suscríbete a prompts relevantes que tus clientes preguntan
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitorea consultas clave en ChatGPT, Claude y más</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors group">
              <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Monitorea el rendimiento de tu marca en múltiples proveedores de IA
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rastrea menciones en todos los motores de búsqueda de IA</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors group">
              <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Analiza rankings de competidores en resultados de búsqueda de IA
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Compara tu rendimiento con líderes de la industria</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors group">
              <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Descubre fuentes de citación de alta autoridad
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Identifica sitios que los modelos de IA citan frecuentemente</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors group">
              <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Audita tus páginas web para optimización GEO
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Escanea tu sitio y recibe recomendaciones accionables</p>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors group">
              <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  Crea contenido optimizado para IA con feedback en tiempo real
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Usa nuestro editor para crear contenido que los modelos de IA aman</p>
              </div>
            </label>
          </div>

          <div className="mt-6 flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Progreso de Configuración</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">0 de 7 completados</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">0%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
              Total de Menciones
            </CardTitle>
            <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">1,284</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">+12.5%</span>
              <span className="ml-1">desde el mes pasado</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
              Sentimiento Positivo
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">87%</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">+3.2%</span>
              <span className="ml-1">desde el mes pasado</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
              Posición Promedio
            </CardTitle>
            <Award className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">#2.4</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">Mejoró 0.8</span>
              <span className="ml-1">posiciones</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
              Puntuación GEO
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">8.6/10</div>
            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">+0.4</span>
              <span className="ml-1">este mes</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentions Chart */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Menciones en los Últimos 7 Días</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Tendencia de menciones de tu marca
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mentionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="menciones" 
                  stroke="#000000" 
                  strokeWidth={2}
                  dot={{ fill: "#000000" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Distribución por Plataforma</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Menciones por motor de IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Queries */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Consultas Principales</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Búsquedas que más mencionan tu marca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topQueries.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{item.query}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {item.mentions} menciones esta semana
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {item.trend === "up" ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <ArrowUpRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

