
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthModal } from '@/components/auth/AuthModal';
import { FeatureShowcase } from '@/components/FeatureShowcase';
import { MessageSquare, Sparkles, Users, Zap, Star, Bot, Mic, FileText, Shield, History, ArrowRight } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const quickFeatures = [
    {
      icon: Bot,
      title: "AI-Powered Chat",
      description: "Advanced conversational AI with multiple models",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Mic,
      title: "Voice Integration",
      description: "Speak naturally with voice recognition",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: FileText,
      title: "File Processing",
      description: "Upload and analyze documents seamlessly",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security and privacy",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const recentActivities = [
    { icon: MessageSquare, text: "Chat with AI Bot", detail: "Generate ideas for writing a novel..." },
    { icon: FileText, text: "Help me write a detailed character...", detail: "Complete story development" },
    { icon: Sparkles, text: "Describe and show me the perfect...", detail: "Creative visualization" },
    { icon: Users, text: "Suggest several ways to describe...", detail: "Writing assistance" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Mobile-First Design Container */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Tabs defaultValue="welcome" className="w-full">
          {/* Modern Tab Navigation */}
          <div className="flex justify-center mb-8">
            <TabsList className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-1">
              <TabsTrigger 
                value="welcome" 
                className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
              >
                Welcome
              </TabsTrigger>
              <TabsTrigger 
                value="features"
                className="rounded-xl px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300"
              >
                All Features
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="welcome">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Left Panel - Welcome & Features */}
              <div className="lg:col-span-2 space-y-8">
                {/* Hero Section */}
                <div className="text-center lg:text-left space-y-6">
                  <div className="flex justify-center lg:justify-start">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                        <Bot className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold">
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        Nexus AI
                      </span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
                      Your intelligent AI companion for seamless conversations, creative tasks, and productivity enhancement
                    </p>
                  </div>
                </div>

                {/* Quick Features Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {quickFeatures.map((feature, index) => (
                    <div 
                      key={index}
                      className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-black/30 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                          <p className="text-sm text-gray-400">{feature.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Section */}
                <div className="text-center space-y-6">
                  <Button
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started Free
                  </Button>
                  <p className="text-sm text-gray-400">
                    Join thousands of users creating amazing content with AI
                  </p>
                </div>
              </div>

              {/* Right Panel - History & Stats */}
              <div className="space-y-6">
                {/* Premium Plan Card */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-white">Premium Plan</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    Harness the full power of AI with a Premium Plan
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20 rounded-xl"
                  >
                    Upgrade now
                  </Button>
                </div>

                {/* History Section */}
                <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <History className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold text-white">History</h3>
                  </div>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group"
                      >
                        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <activity.icon className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate group-hover:text-purple-300 transition-colors">
                            {activity.text}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{activity.detail}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      10K+
                    </div>
                    <div className="text-xs text-gray-400">Active Users</div>
                  </div>
                  <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      1M+
                    </div>
                    <div className="text-xs text-gray-400">Conversations</div>
                  </div>
                  <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      99.9%
                    </div>
                    <div className="text-xs text-gray-400">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features">
            <FeatureShowcase />
          </TabsContent>
        </Tabs>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};
