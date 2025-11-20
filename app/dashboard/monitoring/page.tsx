"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Play, 
  Pause, 
  Plus,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

const aiPlatforms = [
  { id: 1, name: "ChatGPT", status: "activo", color: "bg-green-500" },
  { id: 2, name: "Claude", status: "activo", color: "bg-purple-500" },
  { id: 3, name: "Perplexity", status: "activo", color: "bg-blue-500" },
  { id: 4, name: "Google AI", status: "pausado", color: "bg-gray-400" },
];

const monitoringData = [
  {
    id: 1,
    prompt: "¿Cuáles son las mejores herramientas de optimización para motores de IA?",
    platform: "ChatGPT",
    lastRun: "Hace 5 min",
    status: "mencionado",
    position: 2,
    sentiment: "positivo"
  },
  {
    id: 2,
    prompt: "Herramientas de marketing digital con IA",
    platform: "Claude",
    lastRun: "Hace 12 min",
    status: "mencionado",
    position: 1,
    sentiment: "positivo"
  },
  {
    id: 3,
    prompt: "Mejores plataformas de análisis de contenido",
    platform: "Perplexity",
    lastRun: "Hace 18 min",
    status: "no mencionado",
    position: null,
    sentiment: null
  },
  {
    id: 4,
    prompt: "Software de monitoreo de marca en IA",
    platform: "ChatGPT",
    lastRun: "Hace 25 min",
    status: "mencionado",
    position: 3,
    sentiment: "neutral"
  },
];

export default function MonitoringPage() {
  const [showNewPrompt, setShowNewPrompt] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitoreo de IA</h1>
          <p className="text-gray-600 mt-2">
            Rastrea menciones de tu marca en tiempo real
          </p>
        </div>
        <button
          onClick={() => setShowNewPrompt(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Prompt</span>
        </button>
      </div>

      {/* Platform Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {aiPlatforms.map((platform) => (
          <Card key={platform.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${platform.color}`} />
                  <div>
                    <p className="font-semibold text-gray-900">{platform.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{platform.status}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  {platform.status === "activo" ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monitoring Results */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados de Monitoreo</CardTitle>
          <CardDescription>
            Prompts activos y sus resultados más recientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monitoringData.map((item) => (
              <div
                key={item.id}
                className="p-5 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{item.prompt}</h3>
                      {item.status === "mencionado" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Mencionado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          No mencionado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Plataforma:</span>
                        <span>{item.platform}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{item.lastRun}</span>
                      </div>
                      {item.position && (
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">Posición:</span>
                          <span className="text-purple-600 font-semibold">#{item.position}</span>
                        </div>
                      )}
                      {item.sentiment && (
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">Sentimiento:</span>
                          <span className={`capitalize ${
                            item.sentiment === "positivo" ? "text-green-600" :
                            item.sentiment === "negativo" ? "text-red-600" :
                            "text-yellow-600"
                          }`}>
                            {item.sentiment}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Prompt Modal */}
      {showNewPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Crear Nuevo Prompt de Monitoreo</CardTitle>
              <CardDescription>
                Agrega un nuevo prompt para monitorear en motores de IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt / Consulta
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  placeholder="Ej: ¿Cuáles son las mejores herramientas de SEO para IA?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plataformas
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {aiPlatforms.map((platform) => (
                    <label key={platform.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="rounded text-purple-600" defaultChecked />
                      <span>{platform.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frecuencia de Monitoreo
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Cada hora</option>
                  <option>Cada 6 horas</option>
                  <option>Diariamente</option>
                  <option>Semanalmente</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowNewPrompt(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowNewPrompt(false)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Crear Prompt
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


