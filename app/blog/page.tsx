"use client";

import Link from "next/link";
import { Rocket, Calendar, ArrowRight } from "lucide-react";

export default function BlogPage() {
  // Obtener fecha de hoy
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  const blogPosts = [
    {
      slug: "que-es-generative-engine-optimization",
      title: "¿Qué es la Generative Engine Optimization? Tu Guía Completa de GEO",
      excerpt: "Descubre la guía definitiva sobre GEO: cómo optimizar tu presencia digital para motores de búsqueda generativos y modelos de IA.",
      date: todayFormatted,
      author: "Tom",
      category: "GEO",
      readTime: "8 min lectura"
    }
  ];
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-black dark:text-white" />
              <span className="text-2xl font-bold text-black dark:text-white">
                Geoptimo
              </span>
            </Link>
            <Link 
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Blog Content */}
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white">
            Blog de GEO
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Aprende sobre Generative Engine Optimization y optimiza tu presencia en motores de búsqueda IA
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.date}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Por {post.author} • {post.readTime}
                  </span>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State for Future Posts */}
        {blogPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Próximamente: más artículos sobre GEO
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

