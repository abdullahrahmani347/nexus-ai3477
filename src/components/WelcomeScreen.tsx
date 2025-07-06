
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrandLogo } from '@/components/ui/brand-logo';
import { AuthModal } from '@/components/auth/AuthModal';
import { 
  MessageSquare, 
  Sparkles, 
  Users, 
  Zap, 
  Star, 
  Brain, 
  Mic, 
  FileText, 
  Shield, 
  History, 
  ArrowRight,
  Crown,
  CheckCircle,
  Globe,
  Rocket,
  BarChart3,
  Code,
  Search
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const heroFeatures = [
    {
      icon: Brain,
      title: "Advanced AI Models",
      description: "Access cutting-edge AI including GPT-4, Claude, and specialized models",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Mic,
      title: "Voice Integration",
      description: "Natural voice conversations with real-time speech recognition",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share conversations and collaborate in team workspaces",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with privacy-first architecture",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const recentActivities = [
    { icon: MessageSquare, text: "AI-powered creative writing assistance", detail: "Generate compelling narratives and stories" },
    { icon: Code, text: "Code review and optimization suggestions", detail: "Improve code quality and performance" },
    { icon: Sparkles, text: "Advanced data analysis and insights", detail: "Transform raw data into actionable intelligence" },
    { icon: Search, text: "Intelligent research and summarization", detail: "Comprehensive information synthesis" }
  ];

  const pricingFeatures = [
    "Unlimited conversations",
    "Access to premium AI models",
    "Team collaboration tools",
    "Advanced analytics",
    "Priority support",
    "Custom integrations"
  ];

  // Auto-cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % heroFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroFeatures.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Navigation */}
      <nav className="glass-effect border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-50">
        <div className="container-brand flex items-center justify-between">
          <BrandLogo size="md" variant="premium" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
              Features
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
              Pricing
            </Button>
            <Button 
              onClick={() => setAuthModalOpen(true)}
              className="btn-primary"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <div className="container-brand">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Main Headline */}
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Introducing ChatHub Pro v2.1
              </Badge>
              
              <h1 className="text-h1 text-gray-900 dark:text-gray-100 max-w-3xl mx-auto leading-tight">
                Intelligent Conversations,
                <span className="text-brand-gradient block">
                  Unlimited Possibilities
                </span>
              </h1>
              
              <p className="text-body-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Experience the future of AI conversations with advanced models, intelligent features, 
                and seamless collaboration. Built for professionals who demand excellence.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setAuthModalOpen(true)}
                className="btn-primary text-lg px-8 py-4 h-auto"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button 
                variant="secondary"
                className="text-lg px-8 py-4 h-auto"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400 pt-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Enterprise-grade security</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-500" />
                <span>99.9% uptime guarantee</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-h2 text-gray-900 dark:text-gray-100 mb-4">
                Powerful Features for Modern Teams
              </h2>
              <p className="text-body-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Everything you need to harness the power of AI for your conversations and workflows
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {heroFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className={`card-elevated p-6 cursor-pointer transition-all duration-500 ${
                    activeFeature === index ? 'ring-2 ring-indigo-500 shadow-custom-large' : ''
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-h3 text-gray-900 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-body-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Split Layout */}
        <section className="py-20">
          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Recent Activities */}
              <div className="card-elevated p-8">
                <div className="flex items-center gap-3 mb-6">
                  <History className="w-6 h-6 text-indigo-500" />
                  <h3 className="text-h3 text-gray-900 dark:text-gray-100">
                    Popular Use Cases
                  </h3>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {activity.text}
                        </p>
                        <p className="text-body-sm text-gray-500 dark:text-gray-400 mt-1">
                          {activity.detail}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Highlight */}
              <div className="card-elevated p-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-h3 text-gray-900 dark:text-gray-100">
                      Premium AI Models
                    </h3>
                    <p className="text-body-sm text-gray-600 dark:text-gray-400">
                      Access the latest and most advanced AI models
                    </p>
                  </div>
                </div>
                <p className="text-body text-gray-700 dark:text-gray-300 mb-4">
                  Get access to GPT-4, Claude-3, Deepseek, and other cutting-edge models 
                  with optimized performance and specialized capabilities for different use cases.
                </p>
                <Button className="btn-primary">
                  Explore Models
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Pricing Card */}
              <div className="card-elevated p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5" />
                  <span className="font-semibold">ChatHub Pro</span>
                </div>
                <div className="mb-4">
                  <div className="text-3xl font-bold">$29</div>
                  <div className="text-indigo-200 text-sm">per user/month</div>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full bg-white text-indigo-600 hover:bg-gray-50 font-semibold"
                >
                  Start Free Trial
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card-elevated p-4 text-center">
                  <div className="text-2xl font-bold text-brand-gradient">50K+</div>
                  <div className="text-caption text-gray-500 dark:text-gray-400">Active Users</div>
                </div>
                <div className="card-elevated p-4 text-center">
                  <div className="text-2xl font-bold text-brand-gradient">2M+</div>
                  <div className="text-caption text-gray-500 dark:text-gray-400">Conversations</div>
                </div>
                <div className="card-elevated p-4 text-center">
                  <div className="text-2xl font-bold text-brand-gradient">99.9%</div>
                  <div className="text-caption text-gray-500 dark:text-gray-400">Uptime</div>
                </div>
                <div className="card-elevated p-4 text-center">
                  <div className="text-2xl font-bold text-brand-gradient">4.9★</div>
                  <div className="text-caption text-gray-500 dark:text-gray-400">Rating</div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="card-elevated p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-body-sm text-gray-600 dark:text-gray-400 mb-4">
                  "ChatHub Pro transformed how our team collaborates with AI. 
                  The interface is intuitive and the AI responses are incredibly accurate."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-gradient rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">SM</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">Sarah Mitchell</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Product Manager, TechCorp</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};
