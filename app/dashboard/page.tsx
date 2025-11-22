"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MessageSquare, 
  Award,
  ArrowUpRight,
  Target,
  Users,
  Search,
  Loader2,
  Activity,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import Link from "next/link";

interface MentionData {
  date: string;
  mentions: number;
}

interface TopQuery {
  query: string;
  mentions: number;
  trend: string;
}

interface Metrics {
  visibilityScore: number;
  sentiment: number;
  topThreeVis: number;
  mentions: number;
  avgPosition: number;
  detectionRate: number;
  domainCitations: number;
  mentionsData?: MentionData[];
  topQueries?: TopQuery[];
}

interface RecentActivity {
  id: number;
  runAt: string;
  provider: string;
  mentioned: boolean;
  position: number | null;
  sentiment: string;
  promptId: number;
  promptText: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      // Fetch metrics
      fetch('/api/dashboard/metrics')
        .then(res => res.json())
        .then(data => {
          setMetrics(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching metrics:', error);
          setLoading(false);
        });
      
      // Fetch recent activity
      fetch('/api/dashboard/activity')
        .then(res => res.json())
        .then(data => {
          if (data.activities) {
            setRecentActivity(data.activities);
          }
        })
        .catch(error => {
          console.error('Error fetching activity:', error);
        });
    }
  }, [status]);

  // Show loading while checking authentication
  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading metrics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your AI search visibility performance at a glance
        </p>
      </div>

      {/* Key Metrics - Top 4 from Demo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Visibility Score */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Visibility Score</span>
              </div>
              <Tooltip content="How often your brand appears in AI responses" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {metrics?.visibilityScore || 0}%
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last week
            </p>
            <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-2">
              💡 Shows if your GEO efforts are working
            </p>
          </CardContent>
        </Card>

        {/* 2. Brand Sentiment */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Brand Sentiment</span>
              </div>
              <Tooltip content="How positively AI talks about your brand" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              {metrics?.sentiment || 0}%
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Positive trend
            </p>
            <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-2">
              💡 Positive mentions = more trust = more customers
            </p>
          </CardContent>
        </Card>

        {/* 3. Average Position */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Average Position</span>
              </div>
              <Tooltip content="Where you rank in AI responses (1-10)" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              #{metrics?.avgPosition || 0}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Improved by 2 spots
            </p>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-2">
              💡 Position 1-3 gets 80% of attention
            </p>
          </CardContent>
        </Card>

        {/* 4. Detection Rate */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Detection Rate</span>
              </div>
              <Tooltip content="% of relevant queries where you're mentioned" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {metrics?.detectionRate || 0}%
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% from last week
            </p>
            <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-2">
              💡 Higher rate = more opportunities captured
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Mentions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>Total Mentions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics?.mentions || 0}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              AI responses featuring your brand
            </p>
          </CardContent>
        </Card>

        {/* Top 3 Visibility */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Award className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>Top 3 Appearances</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics?.topThreeVis || 0}%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Times you ranked in top 3 positions
            </p>
          </CardContent>
        </Card>

        {/* Domain Citations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span>Domain Citations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics?.domainCitations || 0}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Times AI cited your website as source
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentions Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Mention Trends (Last 7 Days)</CardTitle>
            <CardDescription>
              Track how often your brand is mentioned by AI engines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metrics?.mentionsData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mentions" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Queries Mentioning You</CardTitle>
            <CardDescription>
              Most common searches where your brand appears
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(metrics?.topQueries && metrics.topQueries.length > 0) ? metrics.topQueries.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.query}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.mentions} mentions
                    </p>
                  </div>
                  {item.trend === 'up' ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No query data available yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest prompt runs and brand mentions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(metrics?.topQueries && metrics.topQueries.length > 0) ? (
            <div className="space-y-3">
              {metrics.topQueries.slice(0, 5).map((query, index) => (
                <Link
                  key={index}
                  href="/dashboard/prompts"
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {query.query}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {query.mentions} {query.mentions === 1 ? 'mention' : 'mentions'}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Activity Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Subscribe to prompts and run them to start tracking your AI visibility
              </p>
              <Link
                href="/dashboard/prompts/explore"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Search className="h-5 w-5" />
                <span>Explore Prompts</span>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/content">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Search className="h-5 w-5 text-purple-600" />
                <span>Optimize Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Check your content&apos;s AI visibility score and get improvement suggestions
              </p>
              <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
                Open Content Checker
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/prompts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Monitor Prompts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track how your brand appears across different AI queries
              </p>
              <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                View Prompt Results
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/competitors">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Users className="h-5 w-5 text-green-600" />
                <span>Competitor Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                See how you stack up against competitors in AI search
              </p>
              <div className="mt-4 flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                Compare Performance
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-600" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>
            Latest prompt runs and brand mentions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/dashboard/prompts/${activity.promptId}`}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all hover:border-purple-500"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {activity.promptText}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                          {activity.provider}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(activity.runAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {activity.mentioned ? (
                        <>
                          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Mentioned</span>
                          </div>
                          {activity.position && (
                            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                              Position #{activity.position}
                            </span>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                          <XCircle className="h-4 w-4" />
                          <span className="text-xs">Not mentioned</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No activity yet. Run some prompts to see results here.
              </p>
              <Link
                href="/dashboard/prompts/explore"
                className="inline-flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:underline"
              >
                <span>Explore Prompts</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
