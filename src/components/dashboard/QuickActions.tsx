
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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
    path: '/chat',
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
      {quickActions.map((action) => (
        <Link key={action.path + action.title} to={action.path}>
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200 hover:border-white/20 cursor-pointer group h-full">
            <CardContent className="p-3 lg:p-4 flex flex-col h-full">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform flex-shrink-0`}>
                <action.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm lg:text-base mb-1 line-clamp-2">{action.title}</h3>
                <p className="text-white/60 text-xs lg:text-sm line-clamp-2">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
