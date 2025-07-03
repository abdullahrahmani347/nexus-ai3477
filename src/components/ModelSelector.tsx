
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chatStore';
import { modelCategories } from '@/services/togetherService';
import { Bot, Code, Sparkles, Calculator, Zap } from 'lucide-react';

const categoryIcons = {
  'Code & Development': Code,
  'General Chat & Reasoning': Bot,
  'Creative Writing': Sparkles,
  'Math & Science': Calculator,
};

export const ModelSelector = () => {
  const { model, setModel } = useChatStore();
  const [showDetails, setShowDetails] = React.useState(false);

  const getCurrentModel = () => {
    for (const [category, data] of Object.entries(modelCategories)) {
      const foundModel = data.models.find(m => m.id === model);
      if (foundModel) {
        return { ...foundModel, category };
      }
    }
    return null;
  };

  const currentModel = getCurrentModel();

  return (
    <div className="space-y-4">
      {/* Compact Model Selection and Rate Limit Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Current Model Selection */}
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">AI Model:</span>
          </div>
          
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-60 h-9 bg-white/10 border-white/20 text-white rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/20">
              {Object.entries(modelCategories).map(([category, data]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-xs font-medium text-white/60 uppercase tracking-wide">
                    {category}
                  </div>
                  {data.models.map((modelOption) => (
                    <SelectItem 
                      key={modelOption.id} 
                      value={modelOption.id}
                      className="text-white hover:bg-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <span>{modelOption.name}</span>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                          {category.split(' ')[0]}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-white/60 hover:text-white hover:bg-white/10 text-xs rounded-lg"
          >
            {showDetails ? 'Less' : 'Details'}
          </Button>
        </div>

        {/* Rate Limit Notice */}
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
          <Bot className="w-4 h-4 text-yellow-300" />
          <div className="text-xs">
            <span className="font-medium text-yellow-300">Rate Limit:</span>
            <span className="text-yellow-200/80 ml-1">50 requests/min</span>
          </div>
        </div>
      </div>

      {/* Current Model Info */}
      {currentModel && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
              {currentModel.category}
            </Badge>
            <span className="text-white text-sm font-medium">{currentModel.name}</span>
          </div>
          <p className="text-white/70 text-xs">{currentModel.description}</p>
        </div>
      )}

      {/* Detailed Model Information */}
      {showDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(modelCategories).map(([category, data]) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
            return (
              <Card key={category} className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-purple-400" />
                    <CardTitle className="text-white text-sm">{category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.models.map((modelOption) => (
                    <div
                      key={modelOption.id}
                      className={`p-2 rounded-lg border cursor-pointer transition-all ${
                        model === modelOption.id
                          ? 'border-purple-400 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => setModel(modelOption.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white text-xs">{modelOption.name}</div>
                          <div className="text-xs text-white/60 mt-0.5">{modelOption.description}</div>
                        </div>
                        {model === modelOption.id && (
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
