import React from 'react';
import Script from 'next/script';
import Image from 'next/image';
import Link from 'next/link';
import { Rocket, ArrowLeft, Calendar } from 'lucide-react';

export default function GeoBlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "¿Qué es la Generative Engine Optimization? Tu Guía Completa de GEO",
    "description": "Descubre la guía definitiva sobre GEO: cómo optimizar tu presencia digital para motores de búsqueda generativos y modelos de IA.",
    "image": "/images/geo-illustration.jpg",
    "author": { "@type": "Organization", "name": "Geoptimo" },
    "datePublished": "2025-09-29",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué es la Generative Engine Optimization?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La GEO es el proceso de optimizar contenido para que sea seleccionado, sintetizado y citado por modelos de lenguaje de IA como ChatGPT y Perplexity."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <Script id="geo-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
              href="/blog"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al blog</span>
            </Link>
          </div>
        </div>
      </header>

      <article className="max-w-5xl mx-auto px-6 py-16 font-sans text-gray-800 dark:text-gray-200 leading-relaxed bg-white dark:bg-black">
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex justify-between items-center mb-8 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Publicado el 29 de septiembre de 2025 por <strong>omer</strong></span>
            </span>
            <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full uppercase text-[10px] font-bold tracking-widest">GEO</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight text-gray-900 dark:text-white">
            ¿Qué es la <span className="text-blue-600 dark:text-blue-400">Generative Engine Optimization</span>? Tu Guía Completa de GEO
          </h1>
        </header>

        {/* Hero Illustration */}
        <div className="relative w-full aspect-video mb-16 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Generative Engine Optimization
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Conectando contenido con ChatGPT, Claude y Perplexity
              </p>
            </div>
          </div>
        </div>

        <section className="prose prose-xl max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-blue dark:prose-invert">
          <p className="lead text-2xl text-gray-600 dark:text-gray-400 mb-10">
            La forma en que las personas buscan información en línea está experimentando un cambio sísmico. Mientras que los motores tradicionales como Google todavía dominan, las herramientas de búsqueda conversacional impulsadas por IA están ganando terreno rápidamente. Entra la <strong>Generative Engine Optimization (GEO)</strong>: la evolución del SEO para la era de la IA.
          </p>

          <p>
            Si eres creador de contenido, mercadólogo o dueño de un negocio, entender la optimización para motores generativos no es solo útil; se está volviendo esencial para mantener tu presencia digital. Esta guía completa te llevará a través de todo lo que necesitas saber sobre la GEO y cómo implementarla de manera efectiva.
          </p>

          <h2 className="text-3xl font-bold mt-16 mb-6">Comprensión de la Generative Engine Optimization: Lo Básico</h2>
          <p>
            La GEO representa un cambio fundamental en la forma en que pensamos sobre el descubrimiento de contenido. A diferencia del SEO tradicional, que se enfoca en el ranking en las páginas de resultados (SERPs), la GEO busca asegurar que tu contenido sea <strong>referenciado y citado por modelos de lenguaje de IA</strong> cuando generan respuestas a las consultas de los usuarios.
          </p>
          <p>
            Piénsalo de esta manera: cuando alguien le pregunta a ChatGPT, Claude o Perplexity algo relacionado con tu industria, ¿influye tu contenido en la respuesta? Eso es lo que aborda la GEO.
          </p>

          <h2 className="text-3xl font-bold mt-16 mb-6">Cómo la GEO difiere del SEO tradicional</h2>
          <p>
            Aunque el SEO y la GEO comparten terreno común, las diferencias son significativas:
          </p>
          <ul>
            <li><strong>Formato de respuesta y UX:</strong> El SEO optimiza para una lista de enlaces. La GEO optimiza para formar parte de una respuesta sintetizada y conversacional.</li>
            <li><strong>Profundidad y autoridad:</strong> La IA prioriza el contenido completo y autoritario que aborda los temas a fondo, más allá de los patrones de palabras clave.</li>
            <li><strong>Dinámica de atribución:</strong> El éxito en GEO puede significar ser citado como fuente dentro de la respuesta, incluso si el usuario no visita tu sitio directamente.</li>
          </ul>

          <div className="my-16 p-10 bg-blue-600 dark:bg-blue-800 rounded-3xl text-white shadow-xl">
            <h3 className="text-white text-3xl font-bold mb-4">¿Por qué la GEO importa AHORA?</h3>
            <p className="text-blue-100 text-lg">
              Las herramientas de IA están creciendo explosivamente. ChatGPT alcanzó los 100 millones de usuarios más rápido que cualquier aplicación en la historia. Si tu marca no está en el "grafo de conocimiento" de estas IAs, te volverás invisible.
            </p>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6">Principios Core de una GEO Efectiva</h2>
          <h3 className="text-2xl font-bold mt-8">Cobertura Tópica Integral</h3>
          <p>
            Los modelos de IA favorecen el contenido que explora temas desde múltiples ángulos. En lugar de enfocarte en una sola palabra clave, la GEO requiere crear recursos definitivos que respondan no solo a la pregunta principal, sino a las consultas relacionadas que los usuarios puedan tener.
          </p>

          <h3 className="text-2xl font-bold mt-8">Estructura Clara y Relaciones Semánticas</h3>
          <p>
            Las IAs son excelentes para entender las relaciones entre conceptos. El uso de encabezados claros, un flujo lógico y conexiones explícitas entre ideas ayuda a estos modelos a analizar y utilizar tu contenido de manera efectiva.
          </p>

          <h2 className="text-3xl font-bold mt-16 mb-6">Estrategias Prácticas de Implementación</h2>
          <p>
            Moviéndonos de la teoría a la práctica, aquí tienes cómo implementar la GEO de manera efectiva:
          </p>
          <ol>
            <li><strong>Arquitectura de contenido para la comprensión de la IA:</strong> Implementa Schema Markup y crea "clústeres de contenido".</li>
            <li><strong>Optimización del Lenguaje Natural:</strong> Escribe como si estuvieras explicando conceptos a un colega inteligente, usando un tono conversacional y natural.</li>
            <li><strong>Construcción de Autoridad Tópica:</strong> Crea contenido interconectado que demuestre una profunda experiencia en áreas relacionadas.</li>
          </ol>

          <h2 className="text-3xl font-bold mt-16 mb-6">Medición del éxito y el futuro</h2>
          <p>
            Mide la <strong>frecuencia de citación</strong> y la tasa de inclusión en respuestas. El futuro de la GEO será multimodal, integrando texto, imágenes y video en respuestas cohesivas.
          </p>
        </section>

        {/* Footer CTA */}
        <footer className="mt-24 border-t border-gray-200 dark:border-gray-800 pt-16 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">¿Listo para la Revolución GEO?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Las organizaciones que actúen ahora, invirtiendo en estrategias de GEO, serán las que den forma a las conversaciones en sus industrias mañana.
          </p>
          <Link
            href="/onboarding"
            className="inline-block bg-black dark:bg-white text-white dark:text-black px-12 py-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all transform hover:scale-105"
          >
            Empieza con Geoptimo hoy
          </Link>
        </footer>
      </article>
    </div>
  );
}

