"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Globe,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useState } from "react";

const auditResults = {
  score: 7.8,
  url: "https://tuempresa.com",
  issues: [
    { 
      severity: "alta",
      category: "Datos Estructurados",
      issue: "Falta schema markup para artículos",
      impact: "Los motores de IA no pueden extraer información estructurada",
      fix: "Agregar JSON-LD con schema.org Article"
    },
    {
      severity: "media",
      category: "Metadatos",
      issue: "Descripciones meta inconsistentes",
      impact: "Contexto limitado para comprensión de IA",
      fix: "Estandarizar formato de meta descripciones"
    },
    {
      severity: "baja",
      category: "Contenido",
      issue: "Falta de datos de autor en algunos artículos",
      impact: "Menor credibilidad en citaciones de IA",
      fix: "Agregar información de autoría completa"
    },
  ],
  strengths: [
    "Excelente uso de encabezados jerárquicos",
    "Contenido bien estructurado y legible",
    "Enlaces internos relevantes",
    "Velocidad de carga optimizada"
  ]
};

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Auditoría de Sitio Web</h1>
        <p className="text-gray-600 mt-2">
          Analiza tu sitio para optimización de motores de IA
        </p>
      </div>

      {/* Audit Input */}
      <Card>
        <CardHeader>
          <CardTitle>Iniciar Nueva Auditoría</CardTitle>
          <CardDescription>
            Ingresa la URL de tu sitio web para análisis completo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://tuempresa.com"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={handleAudit}
              disabled={isAuditing || !url}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex items-center space-x-2"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analizando...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Auditar Sitio</span>
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {showResults && (
        <>
          {/* Score Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Puntuación de Optimización GEO
                  </h3>
                  <p className="text-gray-600">{auditResults.url}</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {auditResults.score}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">de 10</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues */}
          <Card>
            <CardHeader>
              <CardTitle>Problemas Detectados</CardTitle>
              <CardDescription>
                Aspectos que necesitan mejora para mejor rendimiento en IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditResults.issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`p-5 border-l-4 rounded-lg ${
                      issue.severity === "alta" ? "border-red-500 bg-red-50" :
                      issue.severity === "media" ? "border-yellow-500 bg-yellow-50" :
                      "border-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {issue.severity === "alta" ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : issue.severity === "media" ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-blue-600" />
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">{issue.issue}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            issue.severity === "alta" ? "bg-red-200 text-red-800" :
                            issue.severity === "media" ? "bg-yellow-200 text-yellow-800" :
                            "bg-blue-200 text-blue-800"
                          }`}>
                            Severidad {issue.severity}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-8 space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Categoría: </span>
                        <span className="text-sm text-gray-600">{issue.category}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Impacto: </span>
                        <span className="text-sm text-gray-600">{issue.impact}</span>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <ArrowRight className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">{issue.fix}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle>Fortalezas Detectadas</CardTitle>
              <CardDescription>
                Aspectos que están bien optimizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auditResults.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="flex justify-center">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Descargar Informe Completo (PDF)
            </button>
          </div>
        </>
      )}
    </div>
  );
}


