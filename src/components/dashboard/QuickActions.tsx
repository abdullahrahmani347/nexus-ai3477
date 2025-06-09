
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Users, 
  Brain, 
  Search, 
  BarChart3, 
  Code,
  Upload,
  Monitor
} from 'lucide-react';

const quickActions = [
  {
    title: 'Start Chat',
    description: 'Begin AI conversation',
    icon: MessageSquare,
    path: '/',
    color: 'from-purple-500 to-blue-500'
  },
  {
    title: 'Team Spaces',
    description: 'Collaborate with team',
    icon: Users,
    path: '/teams',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Memory Bank',
    description: 'Manage AI memory',
    icon: Brain,
    path: '/memory',
    color: 'from-pink-500 to-purple-500'
  },
  {
    title: 'Search',
    description: 'Find content fast',
    icon: Search,
    path: '/search',
    color: 'from-green-500 to-teal-500'
  },
  {
    title: 'Analytics',
    description: 'View usage stats',
    icon: BarChart3,
    path: '/analytics',
    color: 'from-orange-500 to-red-500'
  },
  {
    title: 'API Tools',
    description: 'Developer features',
    icon: Code,
    path: '/api',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    title: 'File Upload',
    description: 'Process documents',
    icon: Upload,
    path: '/advanced',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: 'Monitoring',
    description: 'System health',
    icon: Monitor,
    path: '/advanced',
    color: 'from-gray-500 to-slate-500'
  }
];

export const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {quickActions.map((action) => (
        <Link key={action.path} to={action.path}>
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 hover:border-white/20 cursor-pointer group">
            <CardContent className="p-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{action.title}</h3>
              <p className="text-white/60 text-xs">{action.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
