"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  ArrowLeft,
  Search,
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Eye,
  Award,
  Zap
} from "lucide-react";
import Link from "next/link";

const DEMO_STEPS = [
  {
    id: 1,
    title: "¿Por Qué GEO?",
    icon: Lightbulb,
    bgColor: "from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    content: {
      problem: "El Problema",
      problemText: "Millones de personas ahora preguntan a chatbots IA (ChatGPT, Claude, Gemini) en lugar de Google. Si tu marca no se menciona en las respuestas IA, eres invisible para estos clientes potenciales.",
      solution: "La Solución: GEO (Optimización de Motores Generativos)",
      solutionText: "Así como SEO te ayuda a posicionarte en Google, GEO te ayuda a ser mencionado y recomendado por chatbots IA. Cuando alguien pregunta '¿Cuáles son los mejores [tu categoría de producto]?', quieres que TU marca esté en esa respuesta IA.",
      example: "Ejemplo: Alguien pregunta a ChatGPT '¿Cuáles son las mejores herramientas de gestión de proyectos?' - ¡Quieres que TU herramienta sea mencionada en las posiciones 1-3!",
      stats: [
        { label: "Búsquedas IA Diarias", value: "1B+" },
        { label: "Tasa de Crecimiento", value: "350%" },
        { label: "Tasa de Conversión", value: "2.5x mayor" }
      ]
    }
  },
  {
    id: 2,
    title: "Resumen del Panel",
    icon: BarChart3,
    bgColor: "from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    content: {
      problem: "Lo Que Ves",
      problemText: "Tu Panel muestra tu rendimiento general de visibilidad IA de un vistazo.",
      solution: "Métricas Clave Explicadas",
      metrics: [
        {
          name: "Puntuación de Visibilidad",
          icon: Eye,
          description: "Con qué frecuencia aparece tu marca en respuestas IA",
          why: "Muestra si tus esfuerzos GEO están funcionando",
          calculation: "Tasa de detección × Posición promedio × Prominencia Top-3"
        },
        {
          name: "Sentimiento de Marca",
          icon: Award,
          description: "Qué tan positivo habla la IA sobre tu marca",
          why: "Menciones positivas = más confianza = más clientes",
          calculation: "Análisis de sentimiento de todas las menciones de marca"
        },
        {
          name: "Posición Promedio",
          icon: TrendingUp,
          description: "Dónde clasificas en respuestas IA (1-10)",
          why: "La posición 1-3 obtiene el 80% de la atención",
          calculation: "Clasificación promedio cuando se menciona"
        },
        {
          name: "Tasa de Detección",
          icon: Target,
          description: "% de consultas relevantes donde eres mencionado",
          why: "Mayor tasa = más oportunidades capturadas",
          calculation: "Menciones ÷ Total de consultas relevantes"
        }
      ],
      example: "Objetivo: Ser mencionado en 80%+ de consultas relevantes, clasificado en las 3 primeras posiciones, con sentimiento positivo."
    }
  },
  {
    id: 3,
    title: "Explorador de Prompts",
    icon: Search,
    bgColor: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    content: {
      problem: "El Núcleo: ¿Qué Son los Prompts?",
      problemText: "Los prompts son las PREGUNTAS que tus clientes potenciales hacen a los chatbots IA. Por ejemplo: '¿Cuáles son las mejores herramientas GEO para 2025?'",
      solution: "Cómo Funciona el Seguimiento de Prompts",
      steps: [
        {
          step: "1. La IA Sugiere Prompts",
          description: "Analizamos tu industria y generamos prompts relevantes que tus clientes podrían preguntar",
          icon: Sparkles
        },
        {
          step: "2. Te Suscribes",
          description: "Elige qué prompts rastrear (preguntas relevantes para tu negocio)",
          icon: CheckCircle2
        },
        {
          step: "3. Monitoreo Diario",
          description: "Ejecutamos automáticamente estos prompts en ChatGPT, Claude, Gemini, Perplexity todos los días",
          icon: Zap
        },
        {
          step: "4. Rastrea Resultados",
          description: "Ve si eres mencionado, tu posición, sentimiento y respuesta completa de la IA",
          icon: BarChart3
        }
      ],
      why: "POR QUÉ ESTO IMPORTA: Si no eres mencionado cuando las personas hacen estas preguntas, estás perdiendo clientes frente a competidores que SÍ son mencionados.",
      example: "Ejemplo de Prompt: '¿Cuáles son las mejores herramientas de optimización IA?' → ¡Quieres tu marca en la respuesta de la IA!"
    }
  },
  {
    id: 4,
    title: "Análisis de Competidores",
    icon: Users,
    bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    content: {
      problem: "Conoce Tu Competencia",
      problemText: "¿Quién más está siendo mencionado en respuestas IA para TUS prompts? ¿Están clasificando más alto que tú?",
      solution: "Qué Muestra el Análisis de Competidores",
      metrics: [
        {
          name: "Puntuación de Visibilidad",
          description: "Compara con qué frecuencia tú vs competidores son mencionados",
          action: "Si el competidor clasifica más alto → analiza su estrategia de contenido"
        },
        {
          name: "Posición Promedio",
          description: "Ve quién clasifica #1, #2, #3 en respuestas IA",
          action: "Si estás #5 → optimiza contenido para alcanzar el top 3"
        },
        {
          name: "Tasa de Detección",
          description: "Quién aparece con más frecuencia en consultas relevantes",
          action: "Si el competidor tiene 90% vs tu 40% → estás perdiendo oportunidades"
        },
        {
          name: "Sentimiento",
          description: "Qué tan positivo habla la IA sobre cada marca",
          action: "Sentimiento negativo → mejora reseñas, calidad de contenido"
        }
      ],
      why: "POR QUÉ ESTO IMPORTA: No puedes mejorar lo que no mides. Ve exactamente dónde los competidores te superan y cierra esas brechas.",
      example: "Si el Competidor X clasifica #1-3 en 80% de prompts mientras tú estás en 30%, sabes que necesitas optimizar!"
    }
  },
  {
    id: 5,
    title: "Citas y Fuentes",
    icon: FileText,
    bgColor: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    content: {
      problem: "¿De Dónde Obtienen Información los Modelos IA?",
      problemText: "Los modelos IA citan sitios web específicos como fuentes. Si TU sitio web es citado, ¡eres mencionado!",
      solution: "El Seguimiento de Citas Te Muestra",
      insights: [
        {
          name: "Autoridad de Dominio",
          description: "Qué sitios web la IA confía más como fuentes",
          action: "Consigue ser destacado/mencionado en estos sitios de alta autoridad",
          icon: Award
        },
        {
          name: "URLs Principales",
          description: "Páginas específicas que la IA cita con más frecuencia",
          action: "Crea contenido similar de alta calidad en tu sitio",
          icon: FileText
        },
        {
          name: "Tus Citas",
          description: "Cuando la IA cita directamente TU sitio web",
          action: "Estas páginas lo están haciendo bien - replica su estructura",
          icon: Target
        },
        {
          name: "Menciones de Marca",
          description: "Otros sitios que mencionan tu marca + son citados",
          action: "Construye relaciones con estos sitios para más menciones",
          icon: MessageSquare
        }
      ],
      why: "POR QUÉ ESTO IMPORTA: Ser citado = ser mencionado. Si la IA cita Forbes y Forbes te menciona, eres recomendado. ¡Construye citas estratégicamente!",
      example: "Si TechCrunch es citado 500 veces y mencionan tu herramienta, la IA te recomendará basándose en esa autoridad."
    }
  },
  {
    id: 6,
    title: "Herramienta de Auditoría",
    icon: Search,
    bgColor: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    content: {
      problem: "¿Es Tu Sitio Web Amigable con IA?",
      problemText: "No todo el contenido se crea igual. Los modelos IA prefieren contenido que sea claro, estructurado, factual y citable.",
      solution: "Qué Verifica la Auditoría",
      dimensions: [
        {
          name: "Probabilidad de Citación",
          description: "Qué tan probable es que la IA cite esta página como fuente",
          improve: "Agrega hechos claros, datos, citas de expertos, estructura adecuada"
        },
        {
          name: "Legibilidad",
          description: "Qué tan fácil es para la IA entender tu contenido",
          improve: "Usa lenguaje claro, párrafos cortos, viñetas"
        },
        {
          name: "Estructura",
          description: "Encabezados adecuados, secciones, flujo lógico",
          improve: "Agrega etiquetas H1/H2/H3, organiza el contenido lógicamente"
        },
        {
          name: "Cobertura de Entidades",
          description: "Menciones de términos clave, marcas, conceptos",
          improve: "Incluye términos de la industria, conceptos relacionados, contexto"
        },
        {
          name: "Densidad Factual",
          description: "Hechos, estadísticas, información concreta",
          improve: "Agrega números, fechas, detalles específicos, investigación"
        },
        {
          name: "Calidad de Fuentes",
          description: "Enlaces a fuentes autorizadas",
          improve: "Cita fuentes reputables, agrega enlaces externos"
        }
      ],
      why: "POR QUÉ ESTO IMPORTA: Dos sitios web pueden decir lo mismo, pero la IA citará el que esté mejor estructurado, sea más factual y más fácil de entender.",
      example: "Página A: '¡Somos geniales!' → Puntuación GEO: 45/100\nPágina B: 'Aumentamos el ROI del cliente en 85% (estudio de Harvard, 2024)' → Puntuación GEO: 92/100"
    }
  },
  {
    id: 7,
    title: "Estudio de Contenido",
    icon: FileText,
    bgColor: "from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    content: {
      problem: "Escribe Contenido Optimizado para IA",
      problemText: "Antes de publicar, verifica si tu contenido funcionará bien en resultados de búsqueda IA.",
      solution: "Puntuación GEO en Tiempo Real",
      features: [
        {
          name: "Puntuación GEO en Vivo",
          description: "Ve tu puntuación actualizarse mientras escribes (0-100)",
          icon: BarChart3
        },
        {
          name: "Desglose por Dimensiones",
          description: "Qué áreas son fuertes/débiles (las mismas 6 que la Auditoría)",
          icon: TrendingUp
        },
        {
          name: "Sugerencias Accionables",
          description: "Mejoras específicas: 'Agrega más hechos', 'Mejora la estructura'",
          icon: Lightbulb
        },
        {
          name: "Comparación Antes/Después",
          description: "Ve cómo las ediciones mejoran tu puntuación",
          icon: CheckCircle2
        }
      ],
      workflow: [
        "1. Escribe tu contenido en el editor",
        "2. Haz clic en 'Analizar' para obtener la puntuación GEO",
        "3. Revisa las sugerencias",
        "4. Realiza mejoras",
        "5. Re-analiza hasta que la puntuación sea 85+",
        "6. Publica contenido optimizado"
      ],
      why: "POR QUÉ ESTO IMPORTA: Optimiza ANTES de publicar. No pierdas tiempo publicando contenido que la IA no citará. ¡Hazlo bien desde la primera vez!",
      example: "Borrador del artículo puntuación GEO: 62/100 → Sigue sugerencias → Puntuación final: 91/100 → ¡3x más probable de ser citado por la IA!"
    }
  },
  {
    id: 8,
    title: "Cómo Todo Se Conecta",
    icon: Zap,
    bgColor: "from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    content: {
      problem: "La Estrategia GEO Completa",
      problemText: "Todas las funciones trabajan juntas para maximizar tu visibilidad IA:",
      solution: "El Flujo de Trabajo GEO",
      workflow: [
        {
          step: "1. DESCUBRIR",
          tools: "Explorador de Prompts",
          action: "Encuentra preguntas que tus clientes hacen a la IA",
          result: "Saber qué prompts optimizar"
        },
        {
          step: "2. COMPARAR",
          tools: "Panel + Competidores",
          action: "Ve dónde te encuentras vs competencia",
          result: "Identifica brechas y oportunidades"
        },
        {
          step: "3. INVESTIGAR",
          tools: "Citas",
          action: "Encuentra qué fuentes confía la IA",
          result: "Saber qué contenido crear y dónde ser mencionado"
        },
        {
          step: "4. OPTIMIZAR",
          tools: "Auditoría + Estudio de Contenido",
          action: "Crea contenido amigable con IA",
          result: "Páginas con alta puntuación GEO que son citadas"
        },
        {
          step: "5. MONITOREAR",
          tools: "Seguimiento de Prompts",
          action: "Verificaciones diarias si eres mencionado",
          result: "Rastrea mejoras, detecta problemas temprano"
        },
        {
          step: "6. MEJORAR",
          tools: "Todas las Herramientas",
          action: "Usa datos para refinar estrategia",
          result: "Ciclo de mejora continua"
        }
      ],
      why: "POR QUÉ ESTO IMPORTA: GEO no es algo de una sola vez. Es un proceso continuo de monitoreo, optimización y mejora.",
      finalMessage: "Objetivo: Cuando alguien pregunta a la IA algo en tu dominio, TU marca es mencionada, clasificada en el top 3, con sentimiento positivo, dirigiendo tráfico calificado a tu sitio."
    }
  }
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const step = DEMO_STEPS[currentStep];
  const Icon = step.icon;
  
  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al Inicio</span>
            </Link>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Paso {currentStep + 1} de {DEMO_STEPS.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / DEMO_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className={`bg-gradient-to-br ${step.bgColor} border-2 ${step.borderColor} shadow-2xl`}>
          <CardContent className="pt-12 pb-12 px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-gray-900 shadow-lg mb-6">
                <Icon className="h-10 w-10 text-gray-900 dark:text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {step.title}
              </h1>
            </div>

            {/* Step-specific content */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center space-x-2">
                    <span>🚨</span>
                    <span>{step.content.problem}</span>
                  </h3>
                  <p className="text-red-800 dark:text-red-200 text-lg leading-relaxed">
                    {step.content.problemText}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center space-x-2">
                    <span>✅</span>
                    <span>{step.content.solution}</span>
                  </h3>
                  <p className="text-green-800 dark:text-green-200 text-lg leading-relaxed mb-4">
                    {step.content.solutionText}
                  </p>
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      {step.content.example}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {step.content.stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center border-2 border-gray-200 dark:border-gray-800">
                      <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.content.solution}
                  </h3>
                  <div className="space-y-4">
                    {step.content.metrics.map((metric, idx) => {
                      const MetricIcon = metric.icon;
                      return (
                        <div key={idx} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <MetricIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {metric.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {metric.description}
                            </p>
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                              💡 {metric.why}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
                  <p className="text-blue-900 dark:text-blue-100 text-lg font-medium">
                    {step.content.example}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.content.problem}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {step.content.problemText}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.content.solution}
                  </h3>
                  <div className="space-y-3">
                    {step.content.steps.map((s, idx) => {
                      const StepIcon = s.icon;
                      return (
                        <div key={idx} className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                            <StepIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {s.step}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {s.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    {step.content.why}
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                    {step.content.example}
                  </p>
                </div>
              </div>
            )}

            {(currentStep === 3 || currentStep === 4) && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.content.problem}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {step.content.problemText}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.content.solution}
                  </h3>
                  <div className="space-y-3">
                    {(step.content.metrics || step.content.insights)?.map((item, idx) => {
                      const ItemIcon = item.icon || Target;
                      return (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start space-x-3 mb-2">
                            <ItemIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {item.description}
                              </p>
                              <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded inline-block">
                                → {item.action}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    {step.content.why}
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200">
                    {step.content.example}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.content.problem}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {step.content.problemText}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.content.solution}
                  </h3>
                  <div className="space-y-3">
                    {step.content.dimensions?.map((item, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {item.description}
                          </p>
                          <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded inline-block">
                            ✅ Cómo mejorar: {item.improve}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    {step.content.why}
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 whitespace-pre-line">
                    {step.content.example}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.content.problem}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {step.content.problemText}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.content.solution}
                  </h3>
                  <div className="space-y-3">
                    {step.content.features?.map((item, idx) => {
                      const ItemIcon = item.icon || CheckCircle2;
                      return (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start space-x-3">
                            <ItemIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {step.content.workflow && (
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Flujo de Trabajo:</h4>
                      <div className="space-y-2">
                        {step.content.workflow.map((w, idx) => (
                          <div key={idx} className="text-sm text-blue-800 dark:text-blue-200">
                            {w}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    {step.content.why}
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 whitespace-pre-line">
                    {step.content.example}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.content.problem}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {step.content.problemText}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.content.solution}
                  </h3>
                  <div className="space-y-4">
                    {step.content.workflow?.map((w, idx) => (
                      <div key={idx} className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-indigo-900 dark:text-indigo-100 text-lg mb-2">
                              {w.step}
                            </h4>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              <div className="flex items-start space-x-2">
                                <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[80px]">Herramientas:</span>
                                <span className="text-gray-900 dark:text-white font-semibold">{w.tools}</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[80px]">Acción:</span>
                                <span className="text-gray-700 dark:text-gray-300">{w.action}</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-green-600 dark:text-green-400 font-medium min-w-[80px]">Resultado:</span>
                                <span className="text-green-700 dark:text-green-300 font-medium">{w.result}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    {step.content.why}
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 text-lg font-medium">
                    {step.content.finalMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Atrás</span>
              </button>

              {currentStep < DEMO_STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <Link
                  href="/onboarding"
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg transition-all flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Iniciar Prueba Gratuita</span>
                  <Sparkles className="h-5 w-5" />
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

