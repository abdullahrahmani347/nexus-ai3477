
import React, { useState } from 'react';
import { Play, Square, CheckCircle, XCircle, Clock, Code, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TestCase {
  id: string;
  name: string;
  description: string;
  category: 'api' | 'ui' | 'integration' | 'performance';
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
}

interface TestSuite {
  name: string;
  tests: TestCase[];
}

const TEST_SUITES: TestSuite[] = [
  {
    name: 'API Tests',
    tests: [
      {
        id: 'api-connection',
        name: 'API Connection',
        description: 'Test API endpoint connectivity',
        category: 'api',
        status: 'pending'
      },
      {
        id: 'message-send',
        name: 'Message Sending',
        description: 'Test message sending functionality',
        category: 'api',
        status: 'pending'
      },
      {
        id: 'streaming-response',
        name: 'Streaming Response',
        description: 'Test real-time message streaming',
        category: 'api',
        status: 'pending'
      }
    ]
  },
  {
    name: 'UI Tests',
    tests: [
      {
        id: 'component-render',
        name: 'Component Rendering',
        description: 'Test all components render correctly',
        category: 'ui',
        status: 'pending'
      },
      {
        id: 'responsive-design',
        name: 'Responsive Design',
        description: 'Test UI responsiveness across devices',
        category: 'ui',
        status: 'pending'
      },
      {
        id: 'theme-switching',
        name: 'Theme Switching',
        description: 'Test dark/light theme functionality',
        category: 'ui',
        status: 'pending'
      }
    ]
  },
  {
    name: 'Performance Tests',
    tests: [
      {
        id: 'load-time',
        name: 'Page Load Time',
        description: 'Test application load performance',
        category: 'performance',
        status: 'pending'
      },
      {
        id: 'memory-usage',
        name: 'Memory Usage',
        description: 'Test memory consumption patterns',
        category: 'performance',
        status: 'pending'
      },
      {
        id: 'large-conversations',
        name: 'Large Conversations',
        description: 'Test performance with large message history',
        category: 'performance',
        status: 'pending'
      }
    ]
  }
];

export const TestingSuite: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>(TEST_SUITES);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<string>('all');
  const [progress, setProgress] = useState(0);

  const runTests = async (suiteFilter?: string) => {
    setIsRunning(true);
    setProgress(0);

    const suitesToRun = suiteFilter === 'all' || !suiteFilter 
      ? testSuites 
      : testSuites.filter(suite => suite.name.toLowerCase().includes(suiteFilter.toLowerCase()));

    const allTests = suitesToRun.flatMap(suite => suite.tests);
    
    for (let i = 0; i < allTests.length; i++) {
      const test = allTests[i];
      
      // Update test status to running
      setTestSuites(prev => prev.map(suite => ({
        ...suite,
        tests: suite.tests.map(t => 
          t.id === test.id ? { ...t, status: 'running' as const } : t
        )
      })));

      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
      
      // Randomly determine pass/fail (90% pass rate for demo)
      const passed = Math.random() > 0.1;
      const duration = Math.floor(Math.random() * 1000 + 100);
      
      setTestSuites(prev => prev.map(suite => ({
        ...suite,
        tests: suite.tests.map(t => 
          t.id === test.id 
            ? { 
                ...t, 
                status: passed ? 'passed' as const : 'failed' as const,
                duration,
                error: passed ? undefined : 'Simulated test failure for demo purposes'
              } 
            : t
        )
      })));

      setProgress(((i + 1) / allTests.length) * 100);
    }

    setIsRunning(false);
  };

  const stopTests = () => {
    setIsRunning(false);
    setTestSuites(prev => prev.map(suite => ({
      ...suite,
      tests: suite.tests.map(test => 
        test.status === 'running' ? { ...test, status: 'pending' } : test
      )
    })));
    setProgress(0);
  };

  const resetTests = () => {
    setTestSuites(prev => prev.map(suite => ({
      ...suite,
      tests: suite.tests.map(test => ({ ...test, status: 'pending', duration: undefined, error: undefined }))
    })));
    setProgress(0);
  };

  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
      default: return <div className="w-4 h-4 rounded-full border border-white/30" />;
    }
  };

  const getCategoryColor = (category: TestCase['category']) => {
    switch (category) {
      case 'api': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'ui': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'integration': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'performance': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const totalTests = testSuites.flatMap(suite => suite.tests).length;
  const passedTests = testSuites.flatMap(suite => suite.tests).filter(test => test.status === 'passed').length;
  const failedTests = testSuites.flatMap(suite => suite.tests).filter(test => test.status === 'failed').length;

  return (
    <div className="nexus-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Testing Suite</h3>
            <p className="text-white/60 text-sm">Comprehensive testing framework</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedSuite} onValueChange={setSelectedSuite}>
            <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              <SelectItem value="all">All Suites</SelectItem>
              {testSuites.map(suite => (
                <SelectItem key={suite.name} value={suite.name}>
                  {suite.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!isRunning ? (
            <Button onClick={() => runTests(selectedSuite === 'all' ? undefined : selectedSuite)} className="nexus-gradient">
              <Play className="w-4 h-4 mr-2" />
              Run Tests
            </Button>
          ) : (
            <Button onClick={stopTests} variant="destructive">
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          )}

          <Button onClick={resetTests} variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Reset
          </Button>
        </div>
      </div>

      {/* Test Progress */}
      {isRunning && (
        <div className="nexus-card p-4 border border-blue-500/30 bg-blue-500/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-300 font-medium">Running Tests...</span>
            <span className="text-blue-300 text-sm">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Test Results Summary */}
      {(passedTests > 0 || failedTests > 0) && (
        <div className="grid grid-cols-3 gap-4">
          <div className="nexus-card p-4 text-center">
            <div className="text-2xl font-bold text-white">{totalTests}</div>
            <div className="text-sm text-white/60">Total Tests</div>
          </div>
          <div className="nexus-card p-4 text-center border border-green-500/30 bg-green-500/10">
            <div className="text-2xl font-bold text-green-300">{passedTests}</div>
            <div className="text-sm text-white/60">Passed</div>
          </div>
          <div className="nexus-card p-4 text-center border border-red-500/30 bg-red-500/10">
            <div className="text-2xl font-bold text-red-300">{failedTests}</div>
            <div className="text-sm text-white/60">Failed</div>
          </div>
        </div>
      )}

      {/* Test Suites */}
      <div className="space-y-4">
        {testSuites.map(suite => (
          <Card key={suite.name} className="nexus-card border-white/10">
            <div className="p-4">
              <h4 className="font-semibold text-white mb-4">{suite.name}</h4>
              <div className="space-y-3">
                {suite.tests.map(test => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <div className="font-medium text-white">{test.name}</div>
                        <div className="text-sm text-white/60">{test.description}</div>
                        {test.error && (
                          <div className="text-sm text-red-400 mt-1">{test.error}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {test.duration && (
                        <span className="text-xs text-white/50">{test.duration}ms</span>
                      )}
                      <Badge variant="outline" className={getCategoryColor(test.category)}>
                        {test.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
