"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LinkIcon,
  TrendingUp,
  ExternalLink,
  Award,
  Globe
} from "lucide-react";

const domainAuthority = [
  { domain: "techcrunch.com", authority: 94, references: 342, avgPosition: 1.2 },
  { domain: "forbes.com", authority: 93, references: 289, avgPosition: 1.5 },
  { domain: "venturebeat.com", authority: 89, references: 234, avgPosition: 1.8 },
  { domain: "wired.com", authority: 88, references: 198, avgPosition: 2.1 },
  { domain: "mashable.com", authority: 86, references: 176, avgPosition: 2.3 },
];

const topURLs = [
  {
    url: "techcrunch.com/2024/best-geo-tools",
    title: "The Best GEO Tools for 2024",
    references: 89,
    providers: ["ChatGPT", "Gemini", "Perplexity"]
  },
  {
    url: "forbes.com/ai-search-optimization-guide",
    title: "Complete Guide to AI Search Optimization",
    references: 76,
    providers: ["ChatGPT", "Gemini"]
  },
  {
    url: "venturebeat.com/geo-marketing-strategies",
    title: "GEO Marketing Strategies That Work",
    references: 64,
    providers: ["Gemini", "Perplexity"]
  },
];

const sourcePreferences = [
  { type: "Tech News Sites", percentage: 34, count: 1240 },
  { type: "Industry Blogs", percentage: 28, count: 1020 },
  { type: "Company Websites", percentage: 18, count: 656 },
  { type: "Research Papers", percentage: 12, count: 437 },
  { type: "Social Media", percentage: 8, count: 291 },
];

const yourCitations = [
  {
    url: "geoptimo.com/blog/geo-best-practices",
    title: "GEO Best Practices for 2025",
    mentions: 23,
    prompts: ["How to optimize for AI search", "Best GEO strategies"],
    lastCited: "2 hours ago"
  },
  {
    url: "geoptimo.com/features",
    title: "Geoptimo Features Overview",
    mentions: 18,
    prompts: ["GEO monitoring tools", "AI citation tracking"],
    lastCited: "5 hours ago"
  },
];

const brandMentions = [
  {
    source: "techcrunch.com/article-123",
    title: "Top 10 GEO Platforms for Enterprises",
    mentions: "Geoptimo",
    snippet: "...Geoptimo offers comprehensive AI search monitoring...",
    citations: 34,
    providers: ["ChatGPT", "Gemini"]
  },
  {
    source: "forbes.com/geo-tools-comparison",
    title: "Comparing Leading GEO Solutions",
    mentions: "Geoptimo",
    snippet: "...Among the leaders, Geoptimo stands out for its analytics...",
    citations: 28,
    providers: ["Gemini", "Perplexity"]
  },
];

export default function CitationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Citations</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Descubre las fuentes más autoritativas que los modelos de IA confían
        </p>
      </div>

      {/* Domain Authority */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-orange-600" />
            <span>Domain Authority</span>
          </CardTitle>
          <CardDescription>
            Los dominios que los modelos de IA referencian más frecuentemente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {domainAuthority.map((domain, index) => (
              <div
                key={domain.domain}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-gray-400 dark:text-gray-600 w-8">
                    #{index + 1}
                  </div>
                  <Globe className="h-10 w-10 text-gray-400 dark:text-gray-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {domain.domain}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {domain.references} references • Avg Position #{domain.avgPosition}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {domain.authority}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Authority</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>💡 Pro Tip:</strong> Si consigues que tu marca sea mencionada en contenido en estos dominios, 
              aumentarás significativamente tus probabilidades de aparecer en respuestas de IA.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Top URLs */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LinkIcon className="h-5 w-5 text-purple-600" />
            <span>Top Referenced URLs</span>
          </CardTitle>
          <CardDescription>
            Las páginas específicas que los modelos de IA citan más a menudo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topURLs.map((item) => (
              <div
                key={item.url}
                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <a
                      href={`https://${item.url}`}
                      className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{item.url}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {item.references}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">refs</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Cited by:</span>
                  {item.providers.map((provider) => (
                    <span
                      key={provider}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded text-gray-700 dark:text-gray-300"
                    >
                      {provider}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Source Preferences */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Source Preferences</CardTitle>
          <CardDescription>
            Tipos de sitios web que los modelos de IA favorecen más
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sourcePreferences.map((pref) => (
              <div key={pref.type}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{pref.type}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {pref.count} references
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {pref.percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                    style={{ width: `${pref.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Brand Citations */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-900">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Your Brand Citations</span>
          </CardTitle>
          <CardDescription>
            Cuando los modelos de IA citan tu sitio web
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {yourCitations.map((citation) => (
              <div
                key={citation.url}
                className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {citation.title}
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400">{citation.url}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{citation.mentions}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">citations</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Last cited: {citation.lastCited}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Top prompts: {citation.prompts.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brand Mentions */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Brand Mentions in Citations</CardTitle>
          <CardDescription>
            Artículos que mencionan tu marca y son citados por IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {brandMentions.map((mention) => (
              <div
                key={mention.source}
                className="p-5 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {mention.title}
                    </h3>
                    <a
                      href={`https://${mention.source}`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{mention.source}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {mention.citations}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">AI citations</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
                  {mention.snippet}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Referenced by:</span>
                  {mention.providers.map((provider) => (
                    <span
                      key={provider}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded text-gray-700 dark:text-gray-300"
                    >
                      {provider}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

