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
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                Dashboard
              </Link>
              <ThemeToggle />
              <Link 
                href="/onboarding" 
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
              >
                Start Free
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
                Features
              </Link>
              <Link 
                href="#pricing" 
                className="block px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/dashboard" 
                className="block px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/onboarding" 
                className="block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-center font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 sm:px-4 py-2 rounded-full mb-6 sm:mb-8 border border-gray-200 dark:border-gray-800">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">AI Engine Optimization</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 px-2">
            Be Discovered by
            <span className="block mt-2 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
              AI Search Engines
            </span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Optimize your content to be cited and recommended by ChatGPT, Claude, Perplexity, 
            Google AI and other generative search engines.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/onboarding"
              className="bg-black dark:bg-white text-white dark:text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
            >
              Start Free
            </Link>
            <Link
              href="/demo"
              className="bg-white dark:bg-black text-gray-900 dark:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-2 border-gray-200 dark:border-gray-800"
            >
              View Demo
            </Link>
          </div>

          {/* Logo Carousel */}
          <div className="mt-12 sm:mt-16">
            <LogoCarousel />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-20 max-w-4xl mx-auto px-4">
            <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">50M+</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">AI Searches Monitored</div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">98%</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Improvement Rate</div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-2">500+</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Brands Trusting Us</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20 bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Powerful GEO Features
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              Everything you need to optimize your presence in AI search engines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Feature 1 */}
            <div className="p-5 sm:p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
              <div className="bg-black dark:bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Real-Time AI Monitoring
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Track brand mentions in ChatGPT, Claude, Perplexity and more. 
                Get instant alerts when your brand is cited.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 sm:p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
              <div className="bg-black dark:bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <FileSearch className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Website Audit
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Deep analysis of your site for AI optimization. Identify issues 
                and get actionable recommendations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 sm:p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
              <div className="bg-black dark:bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Content Optimization
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Optimize your content for better understanding and citation by AI. 
                Advanced NLP analysis and suggestions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 sm:p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
              <div className="bg-black dark:bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Analytics Dashboard
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Visualize mentions, trends and performance across all AI engines. 
                Compare with competitors.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-5 sm:p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
              <div className="bg-black dark:bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Keyword Research
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Discover which queries trigger brand mentions. Identify content gaps 
                and opportunities.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-5 sm:p-8 bg-white dark:bg-gray-900 rounded-xl hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800">
              <div className="bg-black dark:bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white dark:text-black" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Competitor Analysis
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Compare your performance with competitors. See what works in your industry 
                and stay ahead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-black transition-colors">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-white mx-auto mb-4 sm:mb-6" />
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Optimize Your AI Presence?
          </h2>
          <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
            Join hundreds of brands already dominating generative engine optimization
          </p>
          <Link
            href="/onboarding"
            className="inline-block bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Free Trial
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
                Optimization for generative AI engines. Be discovered, cited and recommended.
              </p>
            </div>
            <div>
              <h4 className="text-black dark:text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-black dark:hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-black dark:hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-black dark:text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/demo" className="hover:text-black dark:hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-black dark:text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2025 Geoptimo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

