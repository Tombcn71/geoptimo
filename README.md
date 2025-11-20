# Geoptimo - Plataforma de Optimización para Motores Generativos

Una plataforma SaaS completa para optimizar tu contenido y monitorear tu presencia en motores de búsqueda de IA como ChatGPT, Claude, Perplexity y Google AI.

## 🚀 Características

### ✨ Funcionalidades Principales

- **🔍 Monitoreo de IA en Tiempo Real**: Rastrea menciones de tu marca en múltiples plataformas de IA
- **📊 Panel de Análisis Avanzado**: Visualiza tendencias, sentimientos y posiciones con gráficos interactivos
- **🔎 Auditoría de Sitio Web**: Analiza tu sitio para optimización de motores de IA
- **💡 Optimización de Contenido**: Recibe sugerencias específicas para mejorar la citabilidad
- **📈 Análisis de Competidores**: Compara tu rendimiento con líderes de la industria
- **⚙️ Configuración Completa**: Gestiona notificaciones, suscripción y API

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Arquitectura**: App Router de Next.js

## 📦 Instalación

```bash
# Clonar el repositorio
cd "Geo app"

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🏗️ Estructura del Proyecto

```
/Users/tom/Geo app/
├── app/
│   ├── page.tsx                    # Página de inicio (landing)
│   ├── layout.tsx                  # Layout principal
│   ├── globals.css                 # Estilos globales
│   └── dashboard/
│       ├── layout.tsx              # Layout del dashboard
│       ├── page.tsx                # Panel principal
│       ├── monitoring/page.tsx     # Monitoreo de IA
│       ├── audit/page.tsx          # Auditoría de sitios
│       ├── optimization/page.tsx   # Optimización de contenido
│       ├── analytics/page.tsx      # Panel de análisis
│       └── settings/page.tsx       # Configuración
├── components/
│   └── ui/
│       └── card.tsx                # Componente Card reutilizable
├── lib/
│   └── utils.ts                    # Utilidades (cn helper)
└── public/                         # Archivos estáticos
```

## 🎯 Páginas y Rutas

### Página Principal (`/`)
- Hero section con llamado a la acción
- Sección de características
- Estadísticas y testimonios
- Footer completo

### Dashboard (`/dashboard`)
- **Panel Principal**: Vista general con métricas clave y gráficos
- **Monitoreo**: Gestión de prompts y resultados de búsqueda en IA
- **Auditoría**: Análisis completo de sitios web
- **Optimización**: Sugerencias para mejorar contenido
- **Análisis**: Gráficos avanzados de tendencias y rendimiento
- **Configuración**: Gestión de cuenta, notificaciones y API

## 🎨 Características de Diseño

- **Diseño Responsivo**: Funciona perfectamente en móvil, tablet y desktop
- **UI Moderna**: Interfaz limpia con gradientes y efectos visuales
- **Navegación Intuitiva**: Sidebar colapsable con navegación clara
- **Gráficos Interactivos**: Visualizaciones dinámicas con Recharts
- **Tema Consistente**: Paleta de colores purple/blue cohesiva

## 📊 Componentes de Visualización

- **LineChart**: Tendencias de menciones
- **AreaChart**: Distribución por plataforma
- **BarChart**: Análisis de sentimiento
- **PieChart**: Distribución porcentual
- **Barras de Progreso**: Rankings y comparaciones

## 🔐 Funcionalidades de Seguridad

- Autenticación de dos factores (UI preparada)
- Gestión de API keys
- Configuración de privacidad

## 🚧 Próximos Pasos para Producción

1. **Backend**: Implementar API con Node.js/Python
2. **Base de Datos**: PostgreSQL para datos relacionales
3. **Autenticación**: NextAuth.js o similar
4. **APIs de IA**: Integrar con OpenAI, Anthropic, Perplexity
5. **Scraping**: Implementar web scraping para auditorías
6. **Pagos**: Stripe para suscripciones
7. **Analytics**: Google Analytics o Plausible
8. **Deployment**: Vercel o Railway

## 🎓 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint
```

## 📝 Notas

Esta es una versión MVP/demo con datos simulados. Para producción, necesitarás:

- Implementar backend real con APIs
- Conectar a bases de datos
- Integrar con servicios de IA reales
- Añadir autenticación y autorización
- Implementar procesamiento de pagos
- Configurar monitoreo y logging

## 🤝 Contribuciones

Este es un proyecto demo. Para implementación en producción, contacta al equipo de desarrollo.

## 📄 Licencia

Proyecto demo para propósitos educativos.

---

Construido con ❤️ usando Next.js y Tailwind CSS

