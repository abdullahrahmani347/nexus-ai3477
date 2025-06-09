
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Users, 
  Brain, 
  Upload, 
  Search, 
  Monitor, 
  BarChart3, 
  Settings, 
  Code, 
  Palette, 
  User,
  Database,
  Zap,
  Bot,
  FileText,
  Globe,
  Shield,
  Smartphone,
  Mic,
  Camera,
  Download,
  Share,
  Star,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SimplifiedBranding } from '@/components/ui/simplified-branding';

const FeaturesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const featureCategories = [
    { id: 'all', name: 'All Features', count: 24 },
    { id: 'ai', name: 'AI & Chat', count: 6 },
    { id: 'collaboration', name: 'Collaboration', count: 4 },
    { id: 'analytics', name: 'Analytics', count: 3 },
    { id: 'development', name: 'Development', count: 5 },
    { id: 'mobile', name: 'Mobile', count: 3 },
    { id: 'customization', name: 'Customization', count: 3 }
  ];

  const allFeatures = [
    // AI & Chat Features
    {
      id: 'ai-chat',
      title: 'AI Chat Interface',
      description: 'Advanced conversational AI with streaming responses and context awareness',
      icon: MessageSquare,
      category: 'ai',
      status: 'active',
      path: '/chat',
      features: ['Real-time streaming', 'Context memory', 'Multi-model support', 'Custom prompts']
    },
    {
      id: 'voice-control',
      title: 'Voice Control',
      description: 'Speech-to-text input and text-to-speech output for hands-free interaction',
      icon: Mic,
      category: 'ai',
      status: 'active',
      path: '/chat',
      features: ['Voice input', 'Speech synthesis', 'Auto-speak responses', 'Voice commands']
    },
    {
      id: 'file-processing',
      title: 'File Processing',
      description: 'Upload and process documents, images, and other files with AI analysis',
      icon: Upload,
      category: 'ai',
      status: 'active',
      path: '/advanced',
      features: ['Multi-format support', 'AI analysis', 'Text extraction', 'Image recognition']
    },
    {
      id: 'memory-system',
      title: 'Persistent Memory',
      description: 'AI remembers important information across conversations for personalized experience',
      icon: Brain,
      category: 'ai',
      status: 'active',
      path: '/memory',
      features: ['Context retention', 'Personal preferences', 'Learning from interactions', 'Memory search']
    },
    {
      id: 'smart-search',
      title: 'Semantic Search',
      description: 'Intelligent search across all conversations and documents using AI',
      icon: Search,
      category: 'ai',
      status: 'active',
      path: '/search',
      features: ['Natural language queries', 'Cross-session search', 'Relevance ranking', 'Filter options']
    },
    {
      id: 'model-selection',
      title: 'Multi-Model Support',
      description: 'Choose from various AI models for different tasks and preferences',
      icon: Bot,
      category: 'ai',
      status: 'active',
      path: '/chat',
      features: ['GPT models', 'Gemini Pro', 'Claude support', 'Custom endpoints']
    },

    // Collaboration Features
    {
      id: 'team-workspaces',
      title: 'Team Workspaces',
      description: 'Collaborative spaces for teams to share AI conversations and knowledge',
      icon: Users,
      category: 'collaboration',
      status: 'active',
      path: '/teams',
      features: ['Shared conversations', 'Team memory', 'Role-based access', 'Collaboration tools']
    },
    {
      id: 'session-sharing',
      title: 'Session Sharing',
      description: 'Share AI conversations with team members or export for external use',
      icon: Share,
      category: 'collaboration',
      status: 'active',
      path: '/chat',
      features: ['Public links', 'Team sharing', 'Export formats', 'Access controls']
    },
    {
      id: 'real-time-sync',
      title: 'Real-time Sync',
      description: 'Synchronize conversations and data across all devices in real-time',
      icon: Globe,
      category: 'collaboration',
      status: 'active',
      path: '/advanced',
      features: ['Cross-device sync', 'Live updates', 'Conflict resolution', 'Offline support']
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Comprehensive user profiles, authentication, and access control',
      icon: User,
      category: 'collaboration',
      status: 'active',
      path: '/profile',
      features: ['Profile management', 'Authentication', 'Access controls', 'User analytics']
    },

    // Analytics Features
    {
      id: 'usage-analytics',
      title: 'Usage Analytics',
      description: 'Detailed insights into AI usage patterns, token consumption, and performance',
      icon: BarChart3,
      category: 'analytics',
      status: 'active',
      path: '/analytics',
      features: ['Usage tracking', 'Cost analysis', 'Performance metrics', 'Custom reports']
    },
    {
      id: 'performance-monitoring',
      title: 'Performance Monitoring',
      description: 'Real-time monitoring of system performance and error tracking',
      icon: Monitor,
      category: 'analytics',
      status: 'active',
      path: '/advanced',
      features: ['Real-time metrics', 'Error logging', 'Performance alerts', 'System health']
    },
    {
      id: 'conversation-analytics',
      title: 'Conversation Analytics',
      description: 'Analyze conversation patterns, topics, and AI effectiveness',
      icon: FileText,
      category: 'analytics',
      status: 'active',
      path: '/analytics',
      features: ['Topic analysis', 'Sentiment tracking', 'Response quality', 'Usage patterns']
    },

    // Development Features
    {
      id: 'api-access',
      title: 'Developer API',
      description: 'Comprehensive REST API for integrating AI capabilities into your applications',
      icon: Code,
      category: 'development',
      status: 'active',
      path: '/api',
      features: ['REST endpoints', 'Webhooks', 'SDKs', 'API documentation']
    },
    {
      id: 'webhook-integration',
      title: 'Webhook Integration',
      description: 'Real-time event notifications and integrations with external services',
      icon: Zap,
      category: 'development',
      status: 'active',
      path: '/api',
      features: ['Event triggers', 'Custom endpoints', 'Retry logic', 'Security headers']
    },
    {
      id: 'plugin-system',
      title: 'Plugin System',
      description: 'Extensible plugin architecture for custom functionality and integrations',
      icon: Database,
      category: 'development',
      status: 'active',
      path: '/api',
      features: ['Custom plugins', 'Third-party integrations', 'Plugin marketplace', 'Development tools']
    },
    {
      id: 'testing-suite',
      title: 'Testing Suite',
      description: 'Comprehensive testing tools for AI responses and system reliability',
      icon: Shield,
      category: 'development',
      status: 'active',
      path: '/api',
      features: ['Automated testing', 'Response validation', 'Performance tests', 'Quality assurance']
    },
    {
      id: 'error-monitoring',
      title: 'Error Monitoring',
      description: 'Advanced error tracking and debugging tools for developers',
      icon: Monitor,
      category: 'development',
      status: 'active',
      path: '/api',
      features: ['Error tracking', 'Debug logs', 'Stack traces', 'Performance insights']
    },

    // Mobile Features
    {
      id: 'mobile-app',
      title: 'Mobile Application',
      description: 'Native mobile experience with full feature parity and offline support',
      icon: Smartphone,
      category: 'mobile',
      status: 'active',
      path: '/chat',
      features: ['Native performance', 'Offline mode', 'Push notifications', 'Mobile UI']
    },
    {
      id: 'camera-integration',
      title: 'Camera Integration',
      description: 'Take photos and analyze images directly within the mobile application',
      icon: Camera,
      category: 'mobile',
      status: 'active',
      path: '/advanced',
      features: ['Photo capture', 'Image analysis', 'OCR', 'Visual AI']
    },
    {
      id: 'offline-mode',
      title: 'Offline Mode',
      description: 'Continue working with cached conversations and sync when online',
      icon: Download,
      category: 'mobile',
      status: 'active',
      path: '/advanced',
      features: ['Offline access', 'Data caching', 'Auto-sync', 'Local storage']
    },

    // Customization Features
    {
      id: 'white-label',
      title: 'White Label Solution',
      description: 'Customize branding, themes, and UI to match your organization',
      icon: Palette,
      category: 'customization',
      status: 'active',
      path: '/whitelabel',
      features: ['Custom branding', 'Theme editor', 'Logo upload', 'Color schemes']
    },
    {
      id: 'theme-system',
      title: 'Advanced Theming',
      description: 'Comprehensive theme customization with dark/light modes and custom colors',
      icon: Settings,
      category: 'customization',
      status: 'active',
      path: '/whitelabel',
      features: ['Dark/light themes', 'Custom colors', 'Typography', 'Component styling']
    },
    {
      id: 'admin-panel',
      title: 'Admin Dashboard',
      description: 'Comprehensive administration panel for system management and configuration',
      icon: Database,
      category: 'customization',
      status: 'active',
      path: '/admin',
      features: ['User management', 'System config', 'Analytics dashboard', 'Bulk operations']
    }
  ];

  const filteredFeatures = allFeatures.filter(feature => {
    const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'beta': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'coming-soon': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-pink-500/5" />
      
      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <SimplifiedBranding size="lg" className="mb-2" />
              <p className="text-white/60 text-lg">Complete AI Chatbot Platform Features</p>
            </div>
            <Link to="/chat">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Chatting
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {featureCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`whitespace-nowrap ${
                    selectedCategory === category.id 
                      ? 'bg-purple-500 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Filter className="w-3 h-3 mr-1" />
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => (
            <Card key={feature.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 hover:border-purple-500/30 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-sm font-semibold">{feature.title}</CardTitle>
                      <Badge className={`text-xs mt-1 ${getStatusColor(feature.status)}`}>
                        {feature.status === 'active' ? 'Active' : 
                         feature.status === 'beta' ? 'Beta' : 'Coming Soon'}
                      </Badge>
                    </div>
                  </div>
                  <Star className="w-4 h-4 text-white/30 hover:text-yellow-400 cursor-pointer transition-colors" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-white/60 text-sm mb-4 line-clamp-2">
                  {feature.description}
                </CardDescription>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {feature.features.slice(0, 3).map((subFeature, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-white/5 border-white/20 text-white/70">
                        {subFeature}
                      </Badge>
                    ))}
                    {feature.features.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-white/50">
                        +{feature.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <Link to={feature.path}>
                    <Button size="sm" className="w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-white border border-purple-500/30">
                      Try Feature →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredFeatures.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No features found</h3>
            <p className="text-white/60 mb-4">Try adjusting your search or filter criteria</p>
            <Button 
              variant="ghost" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-purple-400 hover:text-purple-300"
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Feature Statistics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-white">{allFeatures.length}</div>
              <div className="text-sm text-white/60">Total Features</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-400">
                {allFeatures.filter(f => f.status === 'active').length}
              </div>
              <div className="text-sm text-white/60">Active Features</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-400">6</div>
              <div className="text-sm text-white/60">Categories</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-400">100%</div>
              <div className="text-sm text-white/60">Mobile Ready</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
