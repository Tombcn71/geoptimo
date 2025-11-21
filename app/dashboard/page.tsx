"use client";

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
  Search
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import Link from "next/link";

const mentionsData = [
  { date: "Mon", mentions: 45 },
  { date: "Tue", mentions: 52 },
  { date: "Wed", mentions: 48 },
  { date: "Thu", mentions: 61 },
  { date: "Fri", mentions: 55 },
  { date: "Sat", mentions: 67 },
  { date: "Sun", mentions: 58 },
];

const topQueries = [
  { query: "best AI marketing tools", mentions: 23, trend: "up" },
  { query: "SEO optimization platforms", mentions: 18, trend: "up" },
  { query: "content analysis software", mentions: 15, trend: "down" },
  { query: "brand monitoring tools", mentions: 12, trend: "up" },
];

interface Metrics {
  visibilityScore: number;
  sentiment: number;
  topThreeVis: number;
  mentions: number;
  avgPosition: number;
  detectionRate: number;
  domainCitations: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Visibility Score */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>AI Visibility Score</span>
              </div>
              <Tooltip content="Combines detection rate, average position, and top-3 prominence into a single score. Higher is better (max 100)." />
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
              How often your brand appears in AI responses
            </p>
          </CardContent>
        </Card>

        {/* Mentions */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Total Mentions</span>
              </div>
              <Tooltip content="Total number of AI responses that mentioned your brand at least once." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {metrics?.mentions || 0}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last week
            </p>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-2">
              Times your brand was mentioned this week
            </p>
          </CardContent>
        </Card>

        {/* Average Position */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4" />
                <span>Avg Position</span>
              </div>
              <Tooltip content="Average ranking position when your brand appears. Lower is better - position 1 means you're mentioned first." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
              #{metrics?.avgPosition || 0}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Improved by 2 spots
            </p>
            <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-2">
              Your average ranking in AI results
            </p>
          </CardContent>
        </Card>

        {/* Top 3 Visibility */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Top 3 Appearances</span>
              </div>
              <Tooltip content="Percentage of times your brand appears in the top 3 positions when mentioned in AI responses." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
              {metrics?.topThreeVis || 0}%
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5% from last week
            </p>
            <p className="text-xs text-orange-600/70 dark:text-orange-400/70 mt-2">
              How often you rank in top 3 results
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
              <LineChart data={mentionsData}>
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
              {topQueries.map((item, index) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
}
