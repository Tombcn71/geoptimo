"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp,
  TrendingDown,
  Award,
  Eye,
  MessageSquare,
  ArrowUpDown
} from "lucide-react";
import { useState, useEffect } from "react";

type SortField = "visibility" | "sentiment" | "mentions" | "position" | "detection" | "citations";

interface Competitor {
  name: string;
  domain: string;
  visibilityScore: number;
  sentiment: number;
  topThreeVis: number;
  mentions: number;
  avgPosition: number;
  detectionRate: number;
  domainCitations: number;
  trend: string;
  isYou?: boolean;
}

export default function CompetitorsPage() {
  const [sortBy, setSortBy] = useState<SortField>("visibility");
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    try {
      const response = await fetch('/api/competitors');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCompetitors(data);
      } else {
        console.error('API returned non-array data:', data);
        setCompetitors([]);
      }
    } catch (error) {
      console.error('Error fetching competitors:', error);
      setCompetitors([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading competitors...</div>
      </div>
    );
  }

  const yourBrand = competitors.find(c => c.isYou);
  const yourRanking = yourBrand ? competitors.findIndex(c => c.isYou) + 1 : 0;
  const gapToLeader = yourBrand && competitors.length > 0 && competitors[0] ? competitors[0].visibilityScore - yourBrand.visibilityScore : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Competitor Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Compare your performance with competitors in AI results
        </p>
      </div>

      {/* Know Your Competition */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span>Know Your Competition</span>
          </CardTitle>
          <CardDescription>
            Who else is being mentioned in AI responses for YOUR prompts? Are they ranking higher than you?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                  V
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Visibility Score</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Compare how often you vs competitors get mentioned
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                → If competitor ranks higher → analyze their content strategy
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  P
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Average Position</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                See who ranks #1, #2, #3 in AI responses
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                → If you&apos;re #5 → optimize content to reach top 3
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                  D
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Detection Rate</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Who appears most frequently in relevant queries
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                → If competitor has 90% vs your 40% → you&apos;re missing opportunities
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold">
                  S
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Sentiment</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                How positively AI talks about each brand
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                → Negative sentiment → improve reviews, content quality
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State - No Competitors Yet */}
      {competitors.length === 0 ? (
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6 pb-6">
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No Competitors Detected Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Competitors will automatically appear here when you run prompts. 
                AI will detect which other brands are mentioned alongside yours and track their performance.
              </p>
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">1</span>
                  <span>Go to <strong>Prompt Explorer</strong></span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</span>
                  <span>Click <strong>&quot;Run Now&quot;</strong> on any prompt</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">3</span>
                  <span>Competitors will <strong>automatically</strong> be detected!</span>
                </div>
              </div>
              <div className="mt-8">
                <a 
                  href="/dashboard/prompts/explore"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Go to Prompt Explorer</span>
                  <ArrowUpDown className="ml-2 h-5 w-5" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
      {/* Overview Cards */}
      {competitors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Your Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900 dark:text-white">#{yourRanking || '-'}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Out of {competitors.length} competitors
              </p>
            </CardContent>
          </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Gap to Leader
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600">{gapToLeader > 0 ? `-${Math.round(gapToLeader)}` : '0'}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Visibility score points
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Your Strength
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{yourBrand?.sentiment || 0}%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {yourBrand && yourBrand.sentiment === Math.max(...competitors.map(c => c.sentiment)) ? 'Best' : 'Your'} sentiment score
            </p>
          </CardContent>
        </Card>
      </div>
      ) : null}

      {/* Why This Matters */}
      {competitors.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-lg">
                  !
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                  WHY THIS MATTERS
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  You can&apos;t improve what you don&apos;t measure. See exactly where competitors beat you and close those gaps.
                </p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  Example: If Competitor X ranks #1-3 in 80% of prompts while you&apos;re at 30%, you know you need to optimize!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitors Table */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Detailed Ranking</CardTitle>
          <CardDescription>
            All metrics for each competitor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Brand
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="flex items-center justify-center space-x-1">
                      <span>Visibility</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Sentiment
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Top 3 %
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Mentions
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Avg Pos
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Detection
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Citations
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((comp, index) => (
                  <tr
                    key={comp.domain}
                    className={`border-b border-gray-100 dark:border-gray-800 ${
                      comp.isYou ? "bg-purple-50 dark:bg-purple-950/20" : ""
                    } hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {comp.name}
                          </span>
                          {comp.isYou && (
                            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {comp.domain}
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {comp.visibilityScore}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-green-600">{comp.sentiment}%</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{comp.topThreeVis}%</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {comp.mentions.toLocaleString()}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        #{comp.avgPosition}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-gray-900 dark:text-white">{comp.detectionRate}%</span>
                    </td>
                    <td className="text-center py-4 px-4">
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {comp.domainCitations}
                      </span>
                    </td>
                    <td className="text-center py-4 px-4">
                      {comp.trend === "up" ? (
                        <TrendingUp className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span>Competitive Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                💡 Opportunity: Improve Detection Rate
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Competitor A has 17% better detection rate. Consider subscribing to more relevant prompts.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                🎯 Strength: Excellent Brand Sentiment
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your sentiment score (92%) is the highest. Continue with your current content strategy.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white mb-1">
                📈 Recommended Action: Increase Domain Citations
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gap of 133 citations vs leader. Focus on creating high-quality citable content.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </>
      )}
    </div>
  );
}

