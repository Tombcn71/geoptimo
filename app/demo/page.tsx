"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  ArrowLeft,
  Search,
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Eye,
  Award,
  Zap
} from "lucide-react";
import Link from "next/link";

const DEMO_STEPS = [
  {
    id: 1,
    title: "Why GEO?",
    icon: Lightbulb,
    bgColor: "from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    content: {
      problem: "The Problem",
      problemText: "Millions of people now ask AI chatbots (ChatGPT, Claude, Gemini) instead of Google. If your brand isn't mentioned in AI responses, you're invisible to these potential customers.",
      solution: "The Solution: GEO (Generative Engine Optimization)",
      solutionText: "Just like SEO helps you rank on Google, GEO helps you get mentioned and recommended by AI chatbots. When someone asks 'What are the best [your product category]?', you want YOUR brand in that AI response.",
      example: "Example: Someone asks ChatGPT 'What are the best project management tools?' - You want YOUR tool mentioned in positions 1-3!",
      stats: [
        { label: "AI Searches Daily", value: "1B+" },
        { label: "Growth Rate", value: "350%" },
        { label: "Conversion Rate", value: "2.5x higher" }
      ]
    }
  },
  {
    id: 2,
    title: "Dashboard Overview",
    icon: BarChart3,
    bgColor: "from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    content: {
      problem: "What You See",
      problemText: "Your Dashboard shows your overall AI visibility performance at a glance.",
      solution: "Key Metrics Explained",
      metrics: [
        {
          name: "Visibility Score",
          icon: Eye,
          description: "How often your brand appears in AI responses",
          why: "Shows if your GEO efforts are working",
          calculation: "Detection rate × Average position × Top-3 prominence"
        },
        {
          name: "Brand Sentiment",
          icon: Award,
          description: "How positively AI talks about your brand",
          why: "Positive mentions = more trust = more customers",
          calculation: "Sentiment analysis of all brand mentions"
        },
        {
          name: "Average Position",
          icon: TrendingUp,
          description: "Where you rank in AI responses (1-10)",
          why: "Position 1-3 gets 80% of attention",
          calculation: "Average ranking when mentioned"
        },
        {
          name: "Detection Rate",
          icon: Target,
          description: "% of relevant queries where you're mentioned",
          why: "Higher rate = more opportunities captured",
          calculation: "Mentions ÷ Total relevant queries"
        }
      ],
      example: "Goal: Get mentioned in 80%+ of relevant queries, ranked in top 3 positions, with positive sentiment."
    }
  },
  {
    id: 3,
    title: "Prompt Explorer",
    icon: Search,
    bgColor: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    content: {
      problem: "The Core: What Are Prompts?",
      problemText: "Prompts are the QUESTIONS your potential customers ask AI chatbots. For example: 'What are the best GEO tools for 2025?'",
      solution: "How Prompt Tracking Works",
      steps: [
        {
          step: "1. AI Suggests Prompts",
          description: "We analyze your industry and generate relevant prompts your customers might ask",
          icon: Sparkles
        },
        {
          step: "2. You Subscribe",
          description: "Choose which prompts to track (questions relevant to your business)",
          icon: CheckCircle2
        },
        {
          step: "3. Daily Monitoring",
          description: "We automatically run these prompts on ChatGPT, Claude, Gemini, Perplexity every day",
          icon: Zap
        },
        {
          step: "4. Track Results",
          description: "See if you're mentioned, your position, sentiment, and full AI response",
          icon: BarChart3
        }
      ],
      why: "WHY THIS MATTERS: If you're not mentioned when people ask these questions, you're losing customers to competitors who ARE mentioned.",
      example: "Example Prompt: 'What are the best AI optimization tools?' → You want your brand in the AI's answer!"
    }
  },
  {
    id: 4,
    title: "Competitors Analysis",
    icon: Users,
    bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    content: {
      problem: "Know Your Competition",
      problemText: "Who else is being mentioned in AI responses for YOUR prompts? Are they ranking higher than you?",
      solution: "What Competitor Analysis Shows",
      metrics: [
        {
          name: "Visibility Score",
          description: "Compare how often you vs competitors get mentioned",
          action: "If competitor ranks higher → analyze their content strategy"
        },
        {
          name: "Average Position",
          description: "See who ranks #1, #2, #3 in AI responses",
          action: "If you're #5 → optimize content to reach top 3"
        },
        {
          name: "Detection Rate",
          description: "Who appears most frequently in relevant queries",
          action: "If competitor has 90% vs your 40% → you're missing opportunities"
        },
        {
          name: "Sentiment",
          description: "How positively AI talks about each brand",
          action: "Negative sentiment → improve reviews, content quality"
        }
      ],
      why: "WHY THIS MATTERS: You can't improve what you don't measure. See exactly where competitors beat you and close those gaps.",
      example: "If Competitor X ranks #1-3 in 80% of prompts while you're at 30%, you know you need to optimize!"
    }
  },
  {
    id: 5,
    title: "Citations & Sources",
    icon: FileText,
    bgColor: "from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    content: {
      problem: "Where Do AI Models Get Their Info?",
      problemText: "AI models cite specific websites as sources. If YOUR website is cited, you get mentioned!",
      solution: "Citation Tracking Shows You",
      insights: [
        {
          name: "Domain Authority",
          description: "Which websites AI trusts most as sources",
          action: "Get featured/mentioned on these high-authority sites",
          icon: Award
        },
        {
          name: "Top URLs",
          description: "Specific pages AI cites most frequently",
          action: "Create similar high-quality content on your site",
          icon: FileText
        },
        {
          name: "Your Citations",
          description: "When AI directly cites YOUR website",
          action: "These pages are doing it right - replicate their structure",
          icon: Target
        },
        {
          name: "Brand Mentions",
          description: "Other sites that mention your brand + get cited",
          action: "Build relationships with these sites for more mentions",
          icon: MessageSquare
        }
      ],
      why: "WHY THIS MATTERS: Getting cited = getting mentioned. If AI cites Forbes and Forbes mentions you, you get recommended. Build citations strategically!",
      example: "If TechCrunch is cited 500x and they mention your tool, AI will recommend you based on that authority."
    }
  },
  {
    id: 6,
    title: "Audit Tool",
    icon: Search,
    bgColor: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    content: {
      problem: "Is Your Website AI-Friendly?",
      problemText: "Not all content is created equal. AI models prefer content that's clear, structured, factual, and citable.",
      solution: "What the Audit Checks",
      dimensions: [
        {
          name: "Citation Likelihood",
          description: "How likely AI is to cite this page as a source",
          improve: "Add clear facts, data, expert quotes, proper structure"
        },
        {
          name: "Readability",
          description: "How easy it is for AI to understand your content",
          improve: "Use clear language, short paragraphs, bullet points"
        },
        {
          name: "Structure",
          description: "Proper headings, sections, logical flow",
          improve: "Add H1/H2/H3 tags, organize content logically"
        },
        {
          name: "Entity Coverage",
          description: "Mentions of key terms, brands, concepts",
          improve: "Include industry terms, related concepts, context"
        },
        {
          name: "Factual Density",
          description: "Facts, statistics, concrete information",
          improve: "Add numbers, dates, specific details, research"
        },
        {
          name: "Source Quality",
          description: "Links to authoritative sources",
          improve: "Cite reputable sources, add external links"
        }
      ],
      why: "WHY THIS MATTERS: Two websites can say the same thing, but AI will cite the one that's better structured, more factual, and easier to understand.",
      example: "Page A: 'We're great!' → GEO Score: 45/100\nPage B: 'We increased customer ROI by 85% (Harvard study, 2024)' → GEO Score: 92/100"
    }
  },
  {
    id: 7,
    title: "Content Studio",
    icon: FileText,
    bgColor: "from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    content: {
      problem: "Write AI-Optimized Content",
      problemText: "Before publishing, check if your content will perform well in AI search results.",
      solution: "Real-Time GEO Scoring",
      features: [
        {
          name: "Live GEO Score",
          description: "See your score update as you write (0-100)",
          icon: BarChart3
        },
        {
          name: "Dimension Breakdown",
          description: "Which areas are strong/weak (same 6 as Audit)",
          icon: TrendingUp
        },
        {
          name: "Actionable Suggestions",
          description: "Specific improvements: 'Add more facts', 'Improve structure'",
          icon: Lightbulb
        },
        {
          name: "Before/After Comparison",
          description: "See how edits improve your score",
          icon: CheckCircle2
        }
      ],
      workflow: [
        "1. Write your content in the editor",
        "2. Click 'Analyze' to get GEO score",
        "3. Review suggestions",
        "4. Make improvements",
        "5. Re-analyze until score is 85+",
        "6. Publish optimized content"
      ],
      why: "WHY THIS MATTERS: Optimize BEFORE publishing. Don't waste time publishing content that AI won't cite. Get it right the first time!",
      example: "Draft article GEO score: 62/100 → Follow suggestions → Final score: 91/100 → 3x more likely to be cited by AI!"
    }
  },
  {
    id: 8,
    title: "How It All Connects",
    icon: Zap,
    bgColor: "from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    content: {
      problem: "The Complete GEO Strategy",
      problemText: "All features work together to maximize your AI visibility:",
      solution: "The GEO Workflow",
      workflow: [
        {
          step: "1. DISCOVER",
          tools: "Prompt Explorer",
          action: "Find questions your customers are asking AI",
          result: "Know what prompts to optimize for"
        },
        {
          step: "2. BENCHMARK",
          tools: "Dashboard + Competitors",
          action: "See where you stand vs competition",
          result: "Identify gaps and opportunities"
        },
        {
          step: "3. RESEARCH",
          tools: "Citations",
          action: "Find which sources AI trusts",
          result: "Know what content to create and where to get mentioned"
        },
        {
          step: "4. OPTIMIZE",
          tools: "Audit + Content Studio",
          action: "Create AI-friendly content",
          result: "High GEO score pages that get cited"
        },
        {
          step: "5. MONITOR",
          tools: "Prompt Tracking",
          action: "Daily checks if you're mentioned",
          result: "Track improvements, catch problems early"
        },
        {
          step: "6. IMPROVE",
          tools: "All Tools",
          action: "Use data to refine strategy",
          result: "Continuous improvement cycle"
        }
      ],
      why: "WHY THIS MATTERS: GEO is not a one-time thing. It's a continuous process of monitoring, optimizing, and improving.",
      finalMessage: "Goal: When someone asks AI a question in your domain, YOUR brand is mentioned, ranked in top 3, with positive sentiment, driving qualified traffic to your site."
    }
  }
];

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const step = DEMO_STEPS[currentStep];
  const Icon = step.icon;
  
  const handleNext = () => {
    if (currentStep < DEMO_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {DEMO_STEPS.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / DEMO_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className={`bg-gradient-to-br ${step.bgColor} border-2 ${step.borderColor} shadow-2xl`}>
          <CardContent className="pt-12 pb-12 px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-gray-900 shadow-lg mb-6">
                <Icon className="h-10 w-10 text-gray-900 dark:text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {step.title}
              </h1>
            </div>

            {/* Step-specific content */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center space-x-2">
                    <span>🚨</span>
                    <span>{step.content.problem}</span>
                  </h3>
                  <p className="text-red-800 dark:text-red-200 text-lg leading-relaxed">
                    {step.content.problemText}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center space-x-2">
                    <span>✅</span>
                    <span>{step.content.solution}</span>
                  </h3>
                  <p className="text-green-800 dark:text-green-200 text-lg leading-relaxed mb-4">
                    {step.content.solutionText}
                  </p>
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-green-200 dark:border-green-700">
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      {step.content.example}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {step.content.stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center border-2 border-gray-200 dark:border-gray-800">
                      <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.content.solution}
                  </h3>
                  <div className="space-y-4">
                    {step.content.metrics.map((metric, idx) => {
                      const MetricIcon = metric.icon;
                      return (
                        <div key={idx} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <MetricIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {metric.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {metric.description}
                            </p>
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                              💡 {metric.why}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
                  <p className="text-blue-900 dark:text-blue-100 text-lg font-medium">
                    {step.content.example}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.content.problem}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {step.content.problemText}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.content.solution}
                  </h3>
                  <div className="space-y-3">
                    {step.content.steps.map((s, idx) => {
                      const StepIcon = s.icon;
                      return (
                        <div key={idx} className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                            <StepIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {s.step}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {s.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    {step.content.why}
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                    {step.content.example}
                  </p>
                </div>
              </div>
            )}

            {(currentStep === 3 || currentStep === 4) && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.content.problem}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {step.content.problemText}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.content.solution}
                  </h3>
                  <div className="space-y-3">
                    {(step.content.metrics || step.content.insights)?.map((item, idx) => {
                      const ItemIcon = item.icon || Target;
                      return (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start space-x-3 mb-2">
                            <ItemIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                {item.description}
                              </p>
                              <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded inline-block">
                                → {item.action}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    {step.content.why}
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200">
                    {step.content.example}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.content.problem}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {step.content.problemText}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.content.solution}
                  </h3>
                  <div className="space-y-3">
                    {step.content.dimensions?.map((item, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {item.description}
                          </p>
                          <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded inline-block">
                            ✅ How to improve: {item.improve}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    {step.content.why}
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 whitespace-pre-line">
                    {step.content.example}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.content.problem}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {step.content.problemText}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.content.solution}
                  </h3>
                  <div className="space-y-3">
                    {step.content.features?.map((item, idx) => {
                      const ItemIcon = item.icon || CheckCircle2;
                      return (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start space-x-3">
                            <ItemIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {step.content.workflow && (
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Workflow:</h4>
                      <div className="space-y-2">
                        {step.content.workflow.map((w, idx) => (
                          <div key={idx} className="text-sm text-blue-800 dark:text-blue-200">
                            {w}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    {step.content.why}
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 whitespace-pre-line">
                    {step.content.example}
                  </p>
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.content.problem}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {step.content.problemText}
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {step.content.solution}
                  </h3>
                  <div className="space-y-4">
                    {step.content.workflow?.map((w, idx) => (
                      <div key={idx} className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-700">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-indigo-900 dark:text-indigo-100 text-lg mb-2">
                              {w.step}
                            </h4>
                            <div className="grid grid-cols-1 gap-2 text-sm">
                              <div className="flex items-start space-x-2">
                                <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[80px]">Tools:</span>
                                <span className="text-gray-900 dark:text-white font-semibold">{w.tools}</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[80px]">Action:</span>
                                <span className="text-gray-700 dark:text-gray-300">{w.action}</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-green-600 dark:text-green-400 font-medium min-w-[80px]">Result:</span>
                                <span className="text-green-700 dark:text-green-300 font-medium">{w.result}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    {step.content.why}
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-200 text-lg font-medium">
                    {step.content.finalMessage}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>

              {currentStep < DEMO_STEPS.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Next</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <Link
                  href="/onboarding"
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg transition-all flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Start Free Trial</span>
                  <Sparkles className="h-5 w-5" />
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

