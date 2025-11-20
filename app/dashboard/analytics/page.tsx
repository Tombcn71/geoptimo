"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar,
  Download,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const mentionsTrend = [
  { fecha: "1 Ene", chatgpt: 120, claude: 80, perplexity: 45, google: 30 },
  { fecha: "8 Ene", chatgpt: 145, claude: 95, perplexity: 52, google: 35 },
  { fecha: "15 Ene", chatgpt: 132, claude: 88, perplexity: 48, google: 38 },
  { fecha: "22 Ene", chatgpt: 168, claude: 110, perplexity: 65, google: 42 },
  { fecha: "29 Ene", chatgpt: 195, claude: 125, perplexity: 78, google: 48 },
  { fecha: "5 Feb", chatgpt: 210, claude: 140, perplexity: 85, google: 55 },
  { fecha: "12 Feb", chatgpt: 228, claude: 152, perplexity: 92, google: 62 },
];

const sentimentData = [
  { mes: "Sep", positivo: 85, neutral: 12, negativo: 3 },
  { mes: "Oct", positivo: 88, neutral: 10, negativo: 2 },
  { mes: "Nov", positivo: 90, neutral: 8, negativo: 2 },
  { mes: "Dic", positivo: 87, neutral: 11, negativo: 2 },
  { mes: "Ene", positivo: 92, neutral: 7, negativo: 1 },
  { mes: "Feb", positivo: 94, neutral: 5, negativo: 1 },
];

const positionData = [
  { categoria: "Herramientas Marketing", posicion: 2.1, cambio: -0.4 },
  { categoria: "Software SEO", posicion: 3.5, cambio: -0.8 },
  { categoria: "Análisis de Contenido", posicion: 1.8, cambio: -0.2 },
  { categoria: "Optimización IA", posicion: 1.2, cambio: -0.5 },
  { categoria: "Monitoreo de Marca", posicion: 4.2, cambio: +0.3 },
];

const topCitations = [
  { source: "ChatGPT", context: "mejor herramienta de optimización GEO", count: 156 },
  { source: "Claude", context: "plataforma líder en análisis de IA", count: 142 },
  { source: "Perplexity", context: "solución innovadora para marketing", count: 98 },
  { source: "ChatGPT", context: "monitoreo efectivo de motores de IA", count: 87 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Análisis</h1>
          <p className="text-gray-600 mt-2">
            Visualiza tu rendimiento en motores de IA
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Calendar className="h-4 w-4" />
            <span>Últimos 30 días</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Mentions Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Menciones por Plataforma</CardTitle>
          <CardDescription>
            Evolución de menciones en diferentes motores de IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={mentionsTrend}>
              <defs>
                <linearGradient id="colorChatGPT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClaude" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPerplexity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="chatgpt" stroke="#10b981" fillOpacity={1} fill="url(#colorChatGPT)" name="ChatGPT" />
              <Area type="monotone" dataKey="claude" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorClaude)" name="Claude" />
              <Area type="monotone" dataKey="perplexity" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPerplexity)" name="Perplexity" />
              <Area type="monotone" dataKey="google" stroke="#f59e0b" fillOpacity={1} fill="url(#colorGoogle)" name="Google AI" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sentiment and Position */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Sentimiento</CardTitle>
            <CardDescription>
              Distribución del sentimiento en menciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="positivo" fill="#10b981" name="Positivo" />
                <Bar dataKey="neutral" fill="#f59e0b" name="Neutral" />
                <Bar dataKey="negativo" fill="#ef4444" name="Negativo" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Position Rankings */}
        <Card>
          <CardHeader>
            <CardTitle>Rankings por Categoría</CardTitle>
            <CardDescription>
              Posición promedio en diferentes categorías
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {positionData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {item.categoria}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-purple-600">
                        #{item.posicion}
                      </span>
                      {item.cambio < 0 ? (
                        <span className="flex items-center text-green-600 text-sm">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {Math.abs(item.cambio)}
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 text-sm">
                          <TrendingDown className="h-4 w-4 mr-1" />
                          {item.cambio}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                      style={{ width: `${100 - (item.posicion * 10)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Citations */}
      <Card>
        <CardHeader>
          <CardTitle>Citaciones Principales</CardTitle>
          <CardDescription>
            Contextos más frecuentes en los que se menciona tu marca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCitations.map((citation, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      citation.source === "ChatGPT" ? "bg-green-100 text-green-800" :
                      citation.source === "Claude" ? "bg-purple-100 text-purple-800" :
                      citation.source === "Perplexity" ? "bg-blue-100 text-blue-800" :
                      "bg-orange-100 text-orange-800"
                    }`}>
                      {citation.source}
                    </span>
                    <span className="text-gray-900 font-medium">
                      "{citation.context}"
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {citation.count}
                  </div>
                  <div className="text-xs text-gray-600">menciones</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


