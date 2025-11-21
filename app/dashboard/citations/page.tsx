"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LinkIcon,
  TrendingUp,
  ExternalLink,
  Award,
  Globe
} from "lucide-react";
import { useState, useEffect } from "react";

interface Citation {
  id: number;
  sourceUrl: string;
  sourceTitle: string;
  citationCount: number;
  lastCitedAt: Date;
  providers: string[];
}

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

const brandPerformance = [
  { brand: "Geoptimo", mentions: 234, avgPosition: 2.1, citationRate: 68, sentiment: "+82%" },
  { brand: "Sonix", mentions: 198, avgPosition: 2.4, citationRate: 61, sentiment: "+75%" },
  { brand: "Rev", mentions: 176, avgPosition: 2.8, citationRate: 58, sentiment: "+71%" },
  { brand: "Trint", mentions: 143, avgPosition: 3.2, citationRate: 52, sentiment: "+65%" },
  { brand: "Descript", mentions: 127, avgPosition: 3.5, citationRate: 49, sentiment: "+68%" },
];

export default function CitationsPage() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCitations();
  }, []);

  const fetchCitations = async () => {
    try {
      const response = await fetch('/api/citations');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCitations(data);
      } else {
        console.error('API returned non-array data:', data);
        setCitations([]);
      }
    } catch (error) {
      console.error('Error fetching citations:', error);
      setCitations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading citations...</div>
      </div>
    );
  }

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

      {/* Brand Performance */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Brand Performance in Citations</span>
          </CardTitle>
          <CardDescription>
            Top brands mentioned in cited sources across AI platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">#</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Brand</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Mentions</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Avg Position</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Citation Rate</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {brandPerformance.map((brand, index) => (
                  <tr
                    key={brand.brand}
                    className={`border-b border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      brand.brand === "Geoptimo" ? "bg-purple-50 dark:bg-purple-950/20" : ""
                    }`}
                  >
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold ${
                          brand.brand === "Geoptimo"
                            ? "text-purple-700 dark:text-purple-400"
                            : "text-gray-900 dark:text-white"
                        }`}>
                          {brand.brand}
                        </span>
                        {brand.brand === "Geoptimo" && (
                          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-white">
                      {brand.mentions}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-700 dark:text-gray-300">
                      #{brand.avgPosition}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600"
                            style={{ width: `${brand.citationRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {brand.citationRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {brand.sentiment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            {citations.length > 0 ? citations.map((citation) => (
              <div
                key={citation.id}
                className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {citation.sourceTitle}
                    </h3>
                    <a 
                      href={citation.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 dark:text-green-400 hover:underline flex items-center space-x-1"
                    >
                      <span>{citation.sourceUrl}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{citation.citationCount}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">citations</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Last cited: {new Date(citation.lastCitedAt).toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Providers:</span>
                    {citation.providers.map((provider) => (
                      <span
                        key={provider}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded text-gray-700 dark:text-gray-300"
                      >
                        {provider}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                No citations found yet. Start monitoring prompts to collect citation data.
              </div>
            )}
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

