"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2,
  Globe,
  Target,
  Users,
  Tag,
  FileText,
  CheckCircle2,
  Save,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [brandProfile, setBrandProfile] = useState({
    companyName: "",
    website: "",
    industry: "",
    description: "",
    targetAudience: "",
    keywords: "",
    uniqueValue: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/settings");
    }
  }, [status, router]);

  // Fetch brand data
  useEffect(() => {
    if (status === "authenticated") {
      fetchBrandData();
    }
  }, [status]);

  const fetchBrandData = async () => {
    try {
      const response = await fetch('/api/brands/info');
      if (response.ok) {
        const data = await response.json();
        setBrandProfile({
          companyName: data.companyName || '',
          website: data.website || '',
          industry: data.industry || '',
          description: data.description || '',
          targetAudience: data.targetAudience || '',
          keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : (data.keywords || ''),
          uniqueValue: data.uniqueValue || ''
        });
      }
    } catch (error) {
      console.error('Error fetching brand data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/brands/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...brandProfile,
          keywords: brandProfile.keywords.split(',').map(k => k.trim()).filter(k => k)
        })
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert('❌ Error al guardar los cambios');
      }
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('❌ Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || !session || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configuración de Perfil de Marca</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configura el perfil de tu marca para obtener mejores insights y sugerencias IA
        </p>
      </div>

      {/* Completion Status */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-900">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-16 w-16 rounded-full bg-green-600 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Perfil Completo
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tu perfil está configurado y optimizado
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completado</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Information */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            <span>Información Básica</span>
          </CardTitle>
          <CardDescription>
            Detalles fundamentales sobre tu marca
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de la Empresa
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={brandProfile.companyName}
                  onChange={(e) => setBrandProfile({...brandProfile, companyName: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={brandProfile.website}
                  onChange={(e) => setBrandProfile({...brandProfile, website: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Industria
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={brandProfile.industry}
                onChange={(e) => setBrandProfile({...brandProfile, industry: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción de la Marca
              </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                value={brandProfile.description}
                onChange={(e) => setBrandProfile({...brandProfile, description: e.target.value})}
                rows={3}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Describe qué hace tu empresa y qué la hace única
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Target Audience & Competition */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Audiencia y Competencia</span>
          </CardTitle>
          <CardDescription>
            Ayuda a la IA a entender tu mercado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Audiencia Objetivo
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={brandProfile.targetAudience}
                onChange={(e) => setBrandProfile({...brandProfile, targetAudience: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                placeholder="ej. Equipos de marketing, profesionales de SEO"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keywords & Positioning */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-orange-600" />
            <span>Palabras Clave y Posicionamiento</span>
          </CardTitle>
          <CardDescription>
            Define cómo quieres ser encontrado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Palabras Clave Objetivo
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={brandProfile.keywords}
                onChange={(e) => setBrandProfile({...brandProfile, keywords: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                placeholder="Separar con comas"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Palabras clave principales por las que quieres ser conocido
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Propuesta de Valor Única
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                value={brandProfile.uniqueValue}
                onChange={(e) => setBrandProfile({...brandProfile, uniqueValue: e.target.value})}
                rows={2}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                placeholder="¿Qué te diferencia de la competencia?"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : saved ? (
            <>
              <CheckCircle2 className="h-5 w-5" />
              <span>¡Guardado!</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </div>

      {/* AI-Generated Insights */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-2 border-purple-200 dark:border-purple-900">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-purple-600" />
            <span>Insights Generados por IA</span>
          </CardTitle>
          <CardDescription>
            Basado en tu perfil de marca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                🎯 Prompts Recomendados
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hemos generado 12 prompts relevantes para tu industria. Visita el Explorador de Prompts para suscribirte.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                💡 Oportunidades de Contenido
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hemos detectado 8 temas donde puedes mejorar tu visibilidad en IA. Revisa el Estudio de Contenido.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
