
import React, { useState } from 'react';
import { Plus, BookOpen, Code, Briefcase, GraduationCap, Heart, Lightbulb, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConversationTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  prompt: string;
  tags: string[];
  color: string;
}

interface ConversationTemplatesProps {
  onSelectTemplate: (prompt: string) => void;
}

const templates: ConversationTemplate[] = [
  {
    id: 'creative-writing',
    title: 'Creative Writing Assistant',
    description: 'Get help with storytelling, character development, and creative writing',
    category: 'Creative',
    icon: BookOpen,
    prompt: "I'd like help with creative writing. I'm working on [describe your project - story, novel, screenplay, etc.] and need assistance with [plot development/character creation/dialogue/world-building/etc.]. Can you help me brainstorm and develop ideas?",
    tags: ['writing', 'creative', 'storytelling'],
    color: 'purple'
  },
  {
    id: 'code-review',
    title: 'Code Review & Debug',
    description: 'Get code reviewed, debug issues, and improve your programming',
    category: 'Development',
    icon: Code,
    prompt: "I need help with code review and debugging. I'm working with [programming language/framework] and having issues with [describe the problem]. Here's my code: [paste your code]. Can you help me identify issues and suggest improvements?",
    tags: ['programming', 'debugging', 'code review'],
    color: 'blue'
  },
  {
    id: 'business-strategy',
    title: 'Business Strategy',
    description: 'Develop business plans, strategies, and analyze market opportunities',
    category: 'Business',
    icon: Briefcase,
    prompt: "I'm working on business strategy for [describe your business/industry]. I need help with [market analysis/business model/competitive analysis/growth strategy/etc.]. My current situation is [describe context]. What insights and recommendations can you provide?",
    tags: ['business', 'strategy', 'planning'],
    color: 'green'
  },
  {
    id: 'learning-tutor',
    title: 'Learning & Study Tutor',
    description: 'Get personalized tutoring and learning assistance on any subject',
    category: 'Education',
    icon: GraduationCap,
    prompt: "I'm learning about [subject/topic] and need help understanding [specific concept/problem]. My current level is [beginner/intermediate/advanced]. Can you explain this concept clearly and provide examples to help me learn?",
    tags: ['education', 'tutoring', 'learning'],
    color: 'orange'
  },
  {
    id: 'wellness-coach',
    title: 'Wellness & Life Coach',
    description: 'Get guidance on personal development, wellness, and life goals',
    category: 'Personal',
    icon: Heart,
    prompt: "I'm working on personal development and wellness. I'd like guidance with [goal setting/habit formation/work-life balance/stress management/etc.]. My current challenge is [describe situation]. What advice and strategies can you suggest?",
    tags: ['wellness', 'personal development', 'coaching'],
    color: 'pink'
  },
  {
    id: 'brainstorm-ideas',
    title: 'Brainstorming Session',
    description: 'Generate creative ideas and solutions for any challenge',
    category: 'Creative',
    icon: Lightbulb,
    prompt: "I need to brainstorm ideas for [describe your challenge/project]. The goal is to [what you want to achieve]. I'm looking for creative, innovative solutions. Can you help me generate and explore different ideas?",
    tags: ['brainstorming', 'creativity', 'innovation'],
    color: 'yellow'
  }
];

const categories = ['All', 'Creative', 'Development', 'Business', 'Education', 'Personal'];

export const ConversationTemplates: React.FC<ConversationTemplatesProps> = ({
  onSelectTemplate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isOpen, setIsOpen] = useState(false);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: ConversationTemplate) => {
    onSelectTemplate(template.prompt);
    setIsOpen(false);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
      green: 'from-green-500/20 to-green-600/20 border-green-500/30',
      orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
      pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
      yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
          <BookOpen className="h-4 w-4 mr-2" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-white">Conversation Templates</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <ScrollArea className="h-96">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {filteredTemplates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <div
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className={`
                      p-4 rounded-lg cursor-pointer transition-all duration-200 border
                      bg-gradient-to-br ${getColorClasses(template.color)}
                      hover:scale-105 hover:shadow-lg group
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        p-2 rounded-lg flex-shrink-0
                        ${template.color === 'purple' ? 'bg-purple-500/20' :
                          template.color === 'blue' ? 'bg-blue-500/20' :
                          template.color === 'green' ? 'bg-green-500/20' :
                          template.color === 'orange' ? 'bg-orange-500/20' :
                          template.color === 'pink' ? 'bg-pink-500/20' :
                          'bg-yellow-500/20'}
                      `}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1 group-hover:text-white/90">
                          {template.title}
                        </h3>
                        <p className="text-sm text-white/70 mb-3 leading-relaxed">
                          {template.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map(tag => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-white/10 text-white/80 border-white/20"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-8 text-white/60">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No templates found matching your search.</p>
              </div>
            )}
          </ScrollArea>

          {/* Create Custom Template */}
          <div className="border-t border-white/10 pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-white/70 hover:text-white hover:bg-white/10 border border-white/20 border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Template (Coming Soon)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
