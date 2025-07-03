
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chatStore';
import { modelCategories } from '@/services/togetherService';
import { Bot, Code, Sparkles, Calculator } from 'lucide-react';

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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">AI Model Selection</h3>
          <p className="text-sm text-white/60">Choose the best model for your task</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
      </div>

      {/* Current Model Display */}
      {currentModel && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                {currentModel.category}
              </Badge>
              <CardTitle className="text-white text-sm">{currentModel.name}</CardTitle>
            </div>
            <CardDescription className="text-white/70 text-xs">
              {currentModel.description}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Model Categories */}
      {showDetails && (
        <div className="space-y-4">
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
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        model === modelOption.id
                          ? 'border-purple-400 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => setModel(modelOption.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white text-sm">{modelOption.name}</div>
                          <div className="text-xs text-white/60 mt-1">{modelOption.description}</div>
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

      {/* Rate Limit Notice */}
      <Card className="bg-yellow-500/10 border-yellow-500/20">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-yellow-300">
            <Bot className="w-4 h-4" />
            <span className="text-sm font-medium">Rate Limit: 50 requests per minute</span>
          </div>
          <p className="text-xs text-yellow-200/80 mt-1">
            Please allow brief pauses between requests if you reach the limit.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
