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
  Heart,
  Bot,
  ArrowRight
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  status: 'active' | 'premium' | 'coming-soon';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, features, status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active': return { 
        color: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
        text: 'Active',
        bg: 'bg-black/20'
      };
      case 'premium': return { 
        color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
        text: 'Premium',
        bg: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10'
      };
      case 'coming-soon': return { 
        color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
        text: 'Coming Soon',
        bg: 'bg-black/20'
      };
      default: return { 
        color: 'from-gray-500/20 to-gray-400/20 border-gray-500/30 text-gray-400',
        text: 'Unknown',
        bg: 'bg-black/20'
      };
    }
  };

  const config = getStatusConfig();

  return (
    <Card className={`${config.bg} backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 group hover:scale-105`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg text-white">{title}</CardTitle>
            </div>
          </div>
          <Badge className={`bg-gradient-to-r ${config.color} border-0`}>
            {config.text}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex-shrink-0" />
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
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Platform Features
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Discover all the powerful features and capabilities built into Nexus AI
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <Card className="bg-black/20 backdrop-blur-xl border border-white/10 text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {features.filter(f => f.status === 'active').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">Active Features</p>
          </CardContent>
        </Card>
        <Card className="bg-black/20 backdrop-blur-xl border border-white/10 text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl text-purple-400">
              {features.filter(f => f.status === 'premium').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">Premium Features</p>
          </CardContent>
        </Card>
        <Card className="bg-black/20 backdrop-blur-xl border border-white/10 text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl text-blue-400">
              {features.filter(f => f.status === 'coming-soon').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">Coming Soon</p>
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
        <div className="p-6 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Built with Love</h3>
          </div>
          <p className="text-gray-300">
            Nexus AI is continuously evolving with new features and improvements. 
            Your feedback helps shape the future of this platform.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
          Start Chatting Now
        </Button>
      </div>
    </div>
  );
};
