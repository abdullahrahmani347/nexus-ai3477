import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Mic, 
  Settings, 
  Users, 
  Brain, 
  FileText, 
  Smartphone, 
  Palette, 
  Shield, 
  Zap,
  Search,
  Cloud,
  Activity,
  Heart
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  status: 'active' | 'premium' | 'coming-soon';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, features, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'premium': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'coming-soon': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'active': return 'Active';
      case 'premium': return 'Premium';
      case 'coming-soon': return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="nexus-feature-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
          </div>
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export const FeatureShowcase: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      icon: <MessageSquare className="w-5 h-5 text-primary" />,
      title: "AI Chat System",
      description: "Advanced conversational AI with multiple model support",
      features: [
        "Multiple AI models (Llama, Mixtral, OpenChat)",
        "Real-time streaming responses",
        "Context-aware conversations",
        "Customizable system prompts",
        "Temperature and token controls"
      ],
      status: 'active'
    },
    {
      icon: <Mic className="w-5 h-5 text-primary" />,
      title: "Voice Integration",
      description: "Complete voice control with speech recognition and synthesis",
      features: [
        "Voice input with speech recognition",
        "Text-to-speech responses",
        "Auto-speak mode",
        "Adjustable speech rate and volume",
        "Cross-browser compatibility"
      ],
      status: 'active'
    },
    {
      icon: <FileText className="w-5 h-5 text-primary" />,
      title: "File Management",
      description: "Comprehensive file handling and attachment system",
      features: [
        "Drag & drop file uploads",
        "Multiple file type support",
        "File preview and management",
        "Secure file storage",
        "Context integration with AI"
      ],
      status: 'active'
    },
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: "Authentication System",
      description: "Secure user authentication with multiple providers",
      features: [
        "Email/password authentication",
        "Google OAuth integration",
        "User profile management",
        "Session persistence",
        "Secure token handling"
      ],
      status: 'active'
    },
    {
      icon: <Smartphone className="w-5 h-5 text-primary" />,
      title: "Mobile Optimization",
      description: "Fully responsive design optimized for all devices",
      features: [
        "Mobile-first responsive design",
        "Touch-optimized interface",
        "Mobile-specific navigation",
        "Adaptive layouts",
        "Progressive Web App features"
      ],
      status: 'active'
    },
    {
      icon: <Palette className="w-5 h-5 text-primary" />,
      title: "Theme System",
      description: "Beautiful theming with dark/light mode support",
      features: [
        "Dynamic theme switching",
        "Nexus gradient design system",
        "Custom color tokens",
        "Glassmorphism effects",
        "Consistent branding"
      ],
      status: 'active'
    },
    {
      icon: <Settings className="w-5 h-5 text-primary" />,
      title: "Advanced Settings",
      description: "Comprehensive configuration and customization options",
      features: [
        "API key management",
        "Model selection and tuning",
        "Voice settings configuration",
        "UI customization options",
        "Export/import settings"
      ],
      status: 'active'
    },
    {
      icon: <Brain className="w-5 h-5 text-primary" />,
      title: "Persistent Memory",
      description: "AI memory system for contextual conversations",
      features: [
        "Conversation history storage",
        "Context retention across sessions",
        "Smart memory management",
        "User preference learning",
        "Semantic search integration"
      ],
      status: 'premium'
    },
    {
      icon: <Users className="w-5 h-5 text-primary" />,
      title: "Team Workspaces",
      description: "Collaborative features for team productivity",
      features: [
        "Shared team conversations",
        "Role-based permissions",
        "Collaborative AI sessions",
        "Team analytics",
        "Workspace management"
      ],
      status: 'premium'
    },
    {
      icon: <Activity className="w-5 h-5 text-primary" />,
      title: "Analytics Dashboard",
      description: "Comprehensive usage analytics and insights",
      features: [
        "Usage tracking and metrics",
        "Performance analytics",
        "Cost optimization insights",
        "User behavior analysis",
        "Custom reporting"
      ],
      status: 'premium'
    },
    {
      icon: <Search className="w-5 h-5 text-primary" />,
      title: "Semantic Search",
      description: "Advanced search capabilities across conversations",
      features: [
        "Vector-based search",
        "Contextual query matching",
        "Cross-session search",
        "Intelligent result ranking",
        "Search history"
      ],
      status: 'premium'
    },
    {
      icon: <Cloud className="w-5 h-5 text-primary" />,
      title: "Cloud Sync",
      description: "Seamless data synchronization across devices",
      features: [
        "Real-time data sync",
        "Cross-device continuity",
        "Offline mode support",
        "Conflict resolution",
        "Backup and restore"
      ],
      status: 'coming-soon'
    }
  ];

  const activeFeatures = features.filter(f => f.status === 'active').length;
  const premiumFeatures = features.filter(f => f.status === 'premium').length;
  const comingSoonFeatures = features.filter(f => f.status === 'coming-soon').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="nexus-brand-logo w-16 h-16">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold nexus-text-gradient">
          Platform Features
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover all the powerful features and capabilities built into Nexus Chat
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <Card className="nexus-card text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl nexus-text-gradient">{activeFeatures}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Active Features</p>
          </CardContent>
        </Card>
        <Card className="nexus-card text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl text-purple-400">{premiumFeatures}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Premium Features</p>
          </CardContent>
        </Card>
        <Card className="nexus-card text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl text-blue-400">{comingSoonFeatures}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Coming Soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      {/* Footer */}
      <div className="text-center space-y-6 pt-8">
        <div className="p-6 nexus-card max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold">Built with Love</h3>
          </div>
          <p className="text-muted-foreground">
            Nexus Chat is continuously evolving with new features and improvements. 
            Your feedback helps shape the future of this platform.
          </p>
        </div>
        <Button className="nexus-button">
          Start Chatting Now
        </Button>
      </div>
    </div>
  );
};