"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Save
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-2">
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-purple-600" />
            <CardTitle>Información del Perfil</CardTitle>
          </div>
          <CardDescription>
            Actualiza tu información personal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                defaultValue="Tom"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <input
                type="text"
                defaultValue="Usuario"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              defaultValue="tom@ejemplo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Empresa
            </label>
            <input
              type="text"
              defaultValue="Mi Empresa"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sitio Web
            </label>
            <input
              type="url"
              defaultValue="https://miempresa.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Guardar Cambios</span>
          </button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-purple-600" />
            <CardTitle>Notificaciones</CardTitle>
          </div>
          <CardDescription>
            Configura cómo quieres recibir notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Nuevas menciones</p>
              <p className="text-sm text-gray-600">Recibe alertas cuando tu marca sea mencionada</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 text-purple-600 rounded" />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Reportes semanales</p>
              <p className="text-sm text-gray-600">Resumen semanal de tu rendimiento</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 text-purple-600 rounded" />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Cambios de posición</p>
              <p className="text-sm text-gray-600">Notificaciones de cambios significativos en rankings</p>
            </div>
            <input type="checkbox" className="h-5 w-5 text-purple-600 rounded" />
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Sugerencias de optimización</p>
              <p className="text-sm text-gray-600">Recomendaciones para mejorar tu contenido</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5 text-purple-600 rounded" />
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <CardTitle>Suscripción y Facturación</CardTitle>
          </div>
          <CardDescription>
            Gestiona tu plan y métodos de pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Plan Gratuito</h3>
                <p className="text-gray-600">500 búsquedas / mes</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">$0</div>
                <div className="text-sm text-gray-600">por mes</div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-700">
                <span className="mr-2">✓</span>
                <span>500 búsquedas mensuales</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <span className="mr-2">✓</span>
                <span>4 plataformas de IA</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <span className="mr-2">✓</span>
                <span>Análisis básico</span>
              </div>
            </div>
            <button className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
              Actualizar a Premium
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <CardTitle>Seguridad</CardTitle>
          </div>
          <CardDescription>
            Configura opciones de seguridad de tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cambiar contraseña
            </label>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Actualizar Contraseña
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Autenticación de dos factores</p>
              <p className="text-sm text-gray-600">Agrega una capa extra de seguridad</p>
            </div>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
              Activar
            </button>
          </div>
        </CardContent>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-purple-600" />
            <CardTitle>Configuración de API</CardTitle>
          </div>
          <CardDescription>
            Gestiona tus claves de API y integraciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="sk_live_••••••••••••••••••••"
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Copiar
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Regenerar
                </button>
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Nota:</strong> Mantén tu API key segura. No la compartas públicamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


