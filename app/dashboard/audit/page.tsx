"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Globe,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";

const progressSteps = [
  { id: 1, label: "Preparing", duration: 500 },
  { id: 2, label: "Crawling", duration: 1500 },
  { id: 3, label: "Processing", duration: 1200 },
  { id: 4, label: "Analyzing", duration: 1800 },
  { id: 5, label: "Finalizing", duration: 1000 }
];

export default function AuditPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [auditResults, setAuditResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUrlContent = async () => {
    if (!url) return;
    
    setIsFetching(true);
    setError(null);
    setShowResults(false);
    
    try {
      // Use server-side API to fetch URL (no CORS issues)
      const response = await fetch('/api/audit/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch URL');
      }
      
      setContent(data.content);
      setTitle(data.title);
      
      // Automatically start audit after fetching
      setIsFetching(false);
      handleAudit();
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError((err as Error).message || 'Could not fetch URL. Please check if the URL is accessible.');
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!isAuditing) return;

    let stepIndex = 0;
    let totalDuration = 0;
    
    const runSteps = async () => {
      for (const step of progressSteps) {
        setCurrentStep(stepIndex);
        
        // Animate progress for this step
        const startProgress = totalDuration;
        const totalTime = progressSteps.reduce((sum, s) => sum + s.duration, 0);
        
        const animationFrames = 60;
        const frameDelay = step.duration / animationFrames;
        
        for (let i = 0; i <= animationFrames; i++) {
          await new Promise(resolve => setTimeout(resolve, frameDelay));
          const currentProgress = startProgress + (step.duration * i / animationFrames);
          setProgress((currentProgress / totalTime) * 100);
        }
        
        totalDuration += step.duration;
        stepIndex++;
      }
    };
    
    // Run animation and API call in parallel
    runSteps();
    
    fetch('/api/audit/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, title })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setIsAuditing(false);
        } else {
          setAuditResults(data);
          // Wait for animation to finish
          setTimeout(() => {
            setIsAuditing(false);
            setShowResults(true);
            setProgress(0);
            setCurrentStep(0);
          }, Math.max(0, progressSteps.reduce((sum, s) => sum + s.duration, 0) - Date.now()));
        }
      })
      .catch(err => {
        console.error('Audit error:', err);
        setError('Failed to analyze the page. Please try again.');
        setIsAuditing(false);
      });
  }, [isAuditing, content, title]);

  const handleAudit = () => {
    setError(null);
    setIsAuditing(true);
    setShowResults(false);
    setAuditResults(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GEO Website Audit</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Analiza tu sitio con las 6 dimensiones de GEO
        </p>
      </div>

      {/* Audit Input */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Website GEO Audit</CardTitle>
          <CardDescription>
            Analyze any webpage by entering its URL - we&apos;ll fetch and audit the content automatically
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <Globe className="h-6 w-6 text-purple-600" />
                <span>Enter Website URL</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/your-page"
                  className="flex-1 px-5 py-4 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && url && !isFetching) {
                      fetchUrlContent();
                    }
                  }}
                />
                <button
                  onClick={fetchUrlContent}
                  disabled={isFetching || !url}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap shadow-lg"
                >
                  {isFetching ? (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-6 w-6" />
                      <span>Audit Page</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-blue-900 dark:text-blue-300 flex items-start space-x-2">
                <span className="text-lg">💡</span>
                <span>
                  <strong>Tip:</strong> This will fetch the entire webpage and analyze it across 6 GEO dimensions. 
                  For quick content checks, use <a href="/dashboard/content" className="underline font-semibold">Content Checker</a> instead.
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Animation */}
      {isAuditing && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardContent className="pt-8 pb-8">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                Analyzing Your Website...
              </h3>
              
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-4 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center mt-2 text-sm font-semibold text-purple-600 dark:text-purple-400">
                  {Math.round(progress)}%
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {progressSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                      index === currentStep
                        ? "bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900"
                        : index < currentStep
                        ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900"
                        : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      index === currentStep
                        ? "bg-purple-600 text-white animate-pulse"
                        : index < currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : index === currentStep ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <span className={`font-medium ${
                      index === currentStep
                        ? "text-purple-900 dark:text-purple-300"
                        : index < currentStep
                        ? "text-green-900 dark:text-green-300"
                        : "text-gray-600 dark:text-gray-400"
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
                  Audit Failed
                </h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {showResults && auditResults && (
        <>
          {/* Score Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-2 border-purple-200 dark:border-purple-900">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    GEO Audit Score
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{auditResults.title}</p>
                </div>
                <div className="text-center">
                  <div className="text-7xl font-bold text-purple-600 dark:text-purple-400">
                    {auditResults.score}
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-400 mt-1">out of 100</div>
                  <div className={`mt-3 px-4 py-2 rounded-full text-sm font-semibold ${
                    auditResults.score >= 85 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                    auditResults.score >= 70 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                    auditResults.score >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}>
                    {auditResults.score >= 85 ? 'Excellent' : auditResults.score >= 70 ? 'Good' : auditResults.score >= 50 ? 'Fair' : 'Needs Improvement'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6 Dimensions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Analysis by Dimension
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {auditResults.dimensions.map((dimension: any, index: number) => (
                <Card key={index} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{dimension.name}</CardTitle>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                        {dimension.score}
                      </div>
                    </div>
                    <CardDescription>{dimension.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            dimension.score >= 85 ? 'bg-green-600' :
                            dimension.score >= 70 ? 'bg-blue-600' :
                            dimension.score >= 60 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${dimension.score}%` }}
                        />
                      </div>
                    </div>

                    {/* Issues */}
                    {dimension.issues.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-1">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span>Issues to Fix</span>
                        </h4>
                        <div className="space-y-2">
                          {dimension.issues.map((issue, idx) => (
                            <div key={idx} className="flex items-start space-x-2 text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                issue.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                issue.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                                'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                              }`}>
                                {issue.priority}
                              </span>
                              <span className="text-gray-700 dark:text-gray-300">{issue.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strengths */}
                    {dimension.strengths.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-1">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>Strengths</span>
                        </h4>
                        <div className="space-y-1">
                          {dimension.strengths.map((strength, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                              <span>{strength}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
              Descargar Informe Completo (PDF)
            </button>
            <button className="border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Export to CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
}


