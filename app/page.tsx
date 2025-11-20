"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Search, 
  BarChart3, 
  FileSearch, 
  Rocket, 
  TrendingUp, 
  Shield,
  Zap,
  Target,
  Menu,
  X
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoCarousel } from "@/components/logo-carousel";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-black dark:text-white" />
              <span className="text-2xl font-bold text-black dark:text-white">
                Geoptimo
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Características
              </Link>
              <Link href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Precios
              </Link>
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Dashboard
              </Link>
              <ThemeToggle />
              <Link 
                href="/dashboard" 
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
              >
                Comenzar Gratis
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="px-4 py-4 space-y-3">
              <Link 
                href="#features" 
                className="block px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Características
              </Link>
              <Link 
                href="#pricing" 
                className="block px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Precios
              </Link>
              <Link 
                href="/dashboard" 
                className="block px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard" 
                className="block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-center font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Comenzar Gratis
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-full mb-8 border border-gray-200 dark:border-gray-800">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Optimización para Motores Generativos de IA</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Sé Descubierto por
            <span className="block bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Motores de IA
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
            Optimiza tu contenido para ser citado y recomendado por ChatGPT, Claude, Perplexity, 
            Google AI y otros motores de búsqueda generativos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
            >
              Comenzar Gratis
            </Link>
            <Link
              href="#features"
              className="bg-white dark:bg-black text-gray-900 dark:text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-2 border-gray-200 dark:border-gray-800"
            >
              Ver Demo
            </Link>
          </div>

          {/* Logo Carousel */}
          <div className="mt-16">
            <LogoCarousel />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="text-4xl font-bold text-black dark:text-white mb-2">50M+</div>
              <div className="text-gray-600 dark:text-gray-400">Búsquedas de IA Monitoreadas</div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="text-4xl font-bold text-black dark:text-white mb-2">98%</div>
              <div className="text-gray-600 dark:text-gray-400">Tasa de Mejora</div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="text-4xl font-bold text-black dark:text-white mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400">Marcas Confiando</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Características Potentes de GEO
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Todo lo que necesitas para optimizar tu presencia en motores de búsqueda de IA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
              <div className="bg-black dark:bg-white w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Monitoreo de IA en Tiempo Real
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Rastrea menciones de tu marca en ChatGPT, Claude, Perplexity y más. 
                Recibe alertas instantáneas cuando tu marca es citada.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
              <div className="bg-black dark:bg-white w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileSearch className="h-6 w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Auditoría de Sitio Web
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Análisis profundo de tu sitio para optimización de IA. Identifica problemas 
                y obtén recomendaciones accionables.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
              <div className="bg-black dark:bg-white w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Optimización de Contenido
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Optimiza tu contenido para mejor comprensión y citación por IA. 
                Análisis NLP avanzado y sugerencias.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
              <div className="bg-black dark:bg-white w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Panel de Análisis
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Visualiza menciones, tendencias y rendimiento en todos los motores de IA. 
                Compara con competidores.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
              <div className="bg-black dark:bg-white w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Investigación de Palabras Clave
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Descubre qué consultas activan menciones de tu marca. Identifica brechas 
                de contenido y oportunidades.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
              <div className="bg-black dark:bg-white w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Análisis de Competidores
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Compara tu rendimiento con competidores. Ve qué funciona en tu industria 
                y mantente adelante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black transition-colors">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Shield className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">
            Listo para Optimizar tu Presencia en IA?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a cientos de marcas que ya están dominando la optimización de motores generativos
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Comenzar Prueba Gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-black text-gray-600 dark:text-gray-400 py-12 border-t border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Rocket className="h-6 w-6 text-black dark:text-white" />
                <span className="text-black dark:text-white text-xl font-bold">Geoptimo</span>
              </div>
              <p className="text-sm">
                Optimización para motores generativos de IA. Sé descubierto, citado y recomendado.
              </p>
            </div>
            <div>
              <h4 className="text-black dark:text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-black dark:hover:text-white transition-colors">Características</Link></li>
                <li><Link href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">Precios</Link></li>
                <li><Link href="/dashboard" className="hover:text-black dark:hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-black dark:text-white font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Documentación</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Guías</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-black dark:text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Sobre Nosotros</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Contacto</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacidad</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2025 Geoptimo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

