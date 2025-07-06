
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NexusLogo } from '@/components/ui/nexus-logo';
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
  Search,
  Bot,
  Cpu
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const heroFeatures = [
    {
      icon: Brain,
      title: "Advanced Neural Networks",
      description: "State-of-the-art AI models with deep learning capabilities",
      gradient: "from-blue-500 via-purple-600 to-indigo-700"
    },
    {
      icon: Mic,
      title: "Voice Intelligence",
      description: "Natural voice interactions with real-time understanding",
      gradient: "from-cyan-500 via-blue-600 to-purple-700"
    },
    {
      icon: Users,
      title: "Collaborative AI",
      description: "Team workspaces with shared AI intelligence",
      gradient: "from-green-500 via-teal-600 to-blue-700"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Military-grade security with complete privacy protection",
      gradient: "from-orange-500 via-red-600 to-pink-700"
    }
  ];

  const recentActivities = [
    { icon: MessageSquare, text: "Advanced conversational AI assistance", detail: "Natural language processing with context awareness" },
    { icon: Code, text: "Intelligent code generation and review", detail: "Multi-language programming support with optimization" },
    { icon: Sparkles, text: "Creative content and ideation", detail: "Art, writing, and innovative solution generation" },
    { icon: Search, text: "Semantic research and analysis", detail: "Deep information synthesis and insights" }
  ];

  const pricingFeatures = [
    "Unlimited AI conversations",
    "Access to latest AI models",
    "Advanced team collaboration",
    "Real-time analytics dashboard",
    "Priority enterprise support",
    "Custom AI model training"
  ];

  // Auto-cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % heroFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroFeatures.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 glass-effect border-b border-white/10 px-6 py-4 sticky top-0">
        <div className="container-brand flex items-center justify-between">
          <NexusLogo size="md" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
              Features
            </Button>
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
              Pricing
            </Button>
            <Button 
              onClick={() => setAuthModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <div className="container-brand relative z-10">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Main Headline */}
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 px-6 py-3 text-lg">
                <Bot className="w-5 h-5 mr-2" />
                Introducing Nexus AI v2.1
              </Badge>
              
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  NEXUS AI
                </span>
                <br />
                <span className="text-white/90 text-4xl md:text-5xl">
                  Advanced Intelligence Platform
                </span>
              </h1>
              
              <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                Experience the future of artificial intelligence with cutting-edge neural networks, 
                collaborative workspaces, and enterprise-grade security.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setAuthModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold text-lg px-10 py-4 h-auto rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <Rocket className="w-6 h-6 mr-3" />
                Start Free Trial
              </Button>
              <Button 
                variant="outline"
                className="text-lg px-10 py-4 h-auto border-white/30 text-white hover:bg-white/10 rounded-xl"
              >
                <BarChart3 className="w-6 h-6 mr-3" />
                View Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-white/60 pt-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>Enterprise-grade security</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-400" />
                <span>99.9% uptime SLA</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Powered by Advanced AI Technology
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Revolutionary features that redefine what's possible with artificial intelligence
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {heroFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className={`nexus-card p-8 cursor-pointer nexus-transition ${
                    activeFeature === index ? 'nexus-glow border-blue-400/50' : 'hover:border-white/30'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl nexus-transition hover:scale-110`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
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
              <div className="nexus-card p-10">
                <div className="flex items-center gap-4 mb-8">
                  <Cpu className="w-8 h-8 text-blue-400" />
                  <h3 className="text-2xl font-bold text-white">
                    AI Capabilities
                  </h3>
                </div>
                <div className="space-y-6">
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-6 p-6 hover:bg-white/5 rounded-2xl nexus-transition cursor-pointer group"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 nexus-transition">
                        <activity.icon className="w-7 h-7 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold text-white group-hover:text-blue-300 nexus-transition">
                          {activity.text}
                        </p>
                        <p className="text-white/60 mt-2 leading-relaxed">
                          {activity.detail}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-blue-400 nexus-transition flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Pricing Card */}
              <div className="nexus-card p-8 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20 border-blue-400/30">
                <div className="flex items-center gap-3 mb-6">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <span className="font-bold text-white text-lg">Nexus AI Pro</span>
                </div>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-white">$39</div>
                  <div className="text-blue-300 text-sm">per user/month</div>
                </div>
                <ul className="space-y-3 mb-8 text-sm">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Start Free Trial
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="nexus-card p-6 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">100K+</div>
                  <div className="text-xs text-white/60 mt-1">Active Users</div>
                </div>
                <div className="nexus-card p-6 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">10M+</div>
                  <div className="text-xs text-white/60 mt-1">AI Interactions</div>
                </div>
                <div className="nexus-card p-6 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">99.9%</div>
                  <div className="text-xs text-white/60 mt-1">Uptime</div>
                </div>
                <div className="nexus-card p-6 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">4.9★</div>
                  <div className="text-xs text-white/60 mt-1">Rating</div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="nexus-card p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 leading-relaxed">
                  "Nexus AI has transformed our workflow completely. The intelligence and capabilities are beyond anything we've experienced."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">AM</span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Alex Morgan</div>
                    <div className="text-xs text-white/60">CTO, InnovateCorp</div>
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
