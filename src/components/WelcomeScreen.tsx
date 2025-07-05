import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthModal } from '@/components/auth/AuthModal';
import { FeatureShowcase } from '@/components/FeatureShowcase';
import { MessageSquare, Sparkles, Users, Zap, Star } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="welcome" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 w-80">
              <TabsTrigger value="welcome">Welcome</TabsTrigger>
              <TabsTrigger value="features">All Features</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="welcome">
            <div className="flex items-center justify-center min-h-[80vh]">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                {/* Logo and Title */}
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="nexus-brand-logo w-20 h-20">
                      <MessageSquare className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold nexus-text-gradient">
                    Nexus Chat
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                    Your intelligent AI companion for seamless conversations, powered by cutting-edge technology
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  <div className="nexus-feature-card">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
                    <p className="text-muted-foreground text-sm">
                      Advanced language models for intelligent, context-aware conversations
                    </p>
                  </div>

                  <div className="nexus-feature-card">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-accent/10">
                        <Zap className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                    <p className="text-muted-foreground text-sm">
                      Real-time streaming responses with optimized performance
                    </p>
                  </div>

                  <div className="nexus-feature-card">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-secondary/10">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Personalized</h3>
                    <p className="text-muted-foreground text-sm">
                      Tailored conversations with persistent memory and context
                    </p>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Button
                      onClick={() => setAuthModalOpen(true)}
                      className="nexus-button text-lg px-8 py-6 h-auto"
                    >
                      Get Started
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Join thousands of users already having amazing conversations
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-8 max-w-md mx-auto border-t border-border/50 pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold nexus-text-gradient">10K+</div>
                      <div className="text-xs text-muted-foreground">Active Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold nexus-text-gradient">1M+</div>
                      <div className="text-xs text-muted-foreground">Conversations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold nexus-text-gradient">99.9%</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
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