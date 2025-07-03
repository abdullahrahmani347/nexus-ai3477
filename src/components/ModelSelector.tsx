
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chatStore';
import { modelCategories } from '@/services/togetherService';
import { Bot, Code, Sparkles, Calculator, Zap, Clock, AlertCircle } from 'lucide-react';

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
      {/* Enhanced Model Selection and Rate Limit Row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Current Model Selection */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-semibold text-white">AI Model:</span>
            </div>
            
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-64 h-10 bg-white/10 border-white/20 text-white rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/95 border-white/20 backdrop-blur-xl">
                {Object.entries(modelCategories).map(([category, data]) => (
                  <div key={category}>
                    <div className="px-3 py-2 text-xs font-medium text-white/70 uppercase tracking-wider border-b border-white/10">
                      {category}
                    </div>
                    {data.models.map((modelOption) => (
                      <SelectItem 
                        key={modelOption.id} 
                        value={modelOption.id}
                        className="text-white hover:bg-white/10 focus:bg-white/15 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{modelOption.name}</span>
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs border-purple-500/30">
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
              className="text-white/70 hover:text-white hover:bg-white/10 text-xs rounded-xl border border-white/20 transition-all duration-200"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </div>

        {/* Enhanced Rate Limit Notice */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-300" />
            <AlertCircle className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-sm">
            <span className="font-semibold text-amber-200">Rate Limit:</span>
            <span className="text-amber-100/90 ml-2">50 requests/min</span>
          </div>
        </div>
      </div>

      {/* Current Model Info Card */}
      {currentModel && (
        <div className="bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs border-purple-500/30">
              {currentModel.category}
            </Badge>
            <span className="text-white font-semibold text-lg">{currentModel.name}</span>
            <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 text-xs border-green-500/30">
              Active
            </Badge>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">{currentModel.description}</p>
        </div>
      )}

      {/* Detailed Model Information */}
      {showDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(modelCategories).map(([category, data]) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
            return (
              <Card key={category} className="bg-white/5 border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                      <IconComponent className="w-5 h-5 text-purple-300" />
                    </div>
                    <CardTitle className="text-white text-base">{category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.models.map((modelOption) => (
                    <div
                      key={modelOption.id}
                      className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        model === modelOption.id
                          ? 'border-purple-400/50 bg-gradient-to-r from-purple-500/10 to-blue-500/10 shadow-lg shadow-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                      }`}
                      onClick={() => setModel(modelOption.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-white text-sm mb-1">{modelOption.name}</div>
                          <div className="text-xs text-white/70 leading-relaxed">{modelOption.description}</div>
                        </div>
                        {model === modelOption.id && (
                          <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 text-xs border-purple-500/30 ml-3">
                            <Zap className="w-3 h-3 mr-1" />
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
