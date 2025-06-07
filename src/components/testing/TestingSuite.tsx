
import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Clock, FlaskConical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
  category: 'unit' | 'integration' | 'e2e';
}

interface TestSuite {
  id: string;
  name: string;
  tests: TestCase[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  isRunning: boolean;
}

export const TestingSuite: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      id: '1',
      name: 'Chat Functionality',
      tests: [
        {
          id: '1-1',
          name: 'Send Message',
          description: 'User can send a message successfully',
          status: 'passed',
          duration: 150,
          category: 'unit'
        },
        {
          id: '1-2',
          name: 'Receive Response',
          description: 'AI responds to user message',
          status: 'passed',
          duration: 230,
          category: 'integration'
        },
        {
          id: '1-3',
          name: 'File Upload',
          description: 'User can upload and attach files',
          status: 'failed',
          duration: 180,
          error: 'File size limit exceeded',
          category: 'unit'
        }
      ],
      totalTests: 3,
      passedTests: 2,
      failedTests: 1,
      isRunning: false
    },
    {
      id: '2',
      name: 'Authentication',
      tests: [
        {
          id: '2-1',
          name: 'Login Flow',
          description: 'User can log in with valid credentials',
          status: 'passed',
          duration: 320,
          category: 'e2e'
        },
        {
          id: '2-2',
          name: 'Logout Flow',
          description: 'User can log out successfully',
          status: 'passed',
          duration: 120,
          category: 'e2e'
        },
        {
          id: '2-3',
          name: 'Token Validation',
          description: 'JWT tokens are validated correctly',
          status: 'running',
          category: 'unit'
        }
      ],
      totalTests: 3,
      passedTests: 2,
      failedTests: 0,
      isRunning: true
    }
  ]);

  const runAllTests = () => {
    setTestSuites(prev => prev.map(suite => ({
      ...suite,
      isRunning: true,
      tests: suite.tests.map(test => ({ ...test, status: 'running' as const }))
    })));

    // Simulate test execution
    setTimeout(() => {
      setTestSuites(prev => prev.map(suite => ({
        ...suite,
        isRunning: false,
        tests: suite.tests.map(test => ({
          ...test,
          status: Math.random() > 0.2 ? 'passed' as const : 'failed' as const,
          duration: Math.floor(Math.random() * 500) + 100,
          error: Math.random() > 0.8 ? 'Random test failure' : undefined
        }))
      })));
    }, 3000);
  };

  const runSuiteTests = (suiteId: string) => {
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId 
        ? {
            ...suite,
            isRunning: true,
            tests: suite.tests.map(test => ({ ...test, status: 'running' as const }))
          }
        : suite
    ));

    setTimeout(() => {
      setTestSuites(prev => prev.map(suite => 
        suite.id === suiteId 
          ? {
              ...suite,
              isRunning: false,
              tests: suite.tests.map(test => ({
                ...test,
                status: Math.random() > 0.3 ? 'passed' as const : 'failed' as const,
                duration: Math.floor(Math.random() * 400) + 100
              }))
            }
          : suite
      ));
    }, 2000);
  };

  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running': return <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'unit': return 'bg-blue-500/20 text-blue-300';
      case 'integration': return 'bg-purple-500/20 text-purple-300';
      case 'e2e': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const totalTests = testSuites.reduce((sum, suite) => sum + suite.totalTests, 0);
  const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passedTests, 0);
  const totalFailed = testSuites.reduce((sum, suite) => sum + suite.failedTests, 0);
  const isAnyRunning = testSuites.some(suite => suite.isRunning);

  return (
    <div className="space-y-6">
      <Card className="nexus-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Testing Suite</h3>
              <p className="text-white/60 text-sm">Automated testing and quality assurance</p>
            </div>
          </div>
          
          <Button 
            onClick={runAllTests}
            disabled={isAnyRunning}
            className="bg-gradient-to-r from-green-500 to-blue-500"
          >
            {isAnyRunning ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Run All Tests
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-2xl font-bold text-white">{totalTests}</div>
            <div className="text-sm text-white/60">Total Tests</div>
          </div>
          <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
            <div className="text-2xl font-bold text-green-400">{totalPassed}</div>
            <div className="text-sm text-green-300">Passed</div>
          </div>
          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/30">
            <div className="text-2xl font-bold text-red-400">{totalFailed}</div>
            <div className="text-sm text-red-300">Failed</div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-white/60">Pass Rate</div>
          </div>
        </div>

        {totalTests > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/80">Overall Progress</span>
              <span className="text-sm text-white/60">
                {totalPassed + totalFailed} / {totalTests} tests completed
              </span>
            </div>
            <Progress 
              value={((totalPassed + totalFailed) / totalTests) * 100} 
              className="h-2"
            />
          </div>
        )}
      </Card>

      {testSuites.map((suite) => (
        <Card key={suite.id} className="nexus-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-white">{suite.name}</h4>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/10 text-white/80">
                {suite.passedTests}/{suite.totalTests} passed
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => runSuiteTests(suite.id)}
                disabled={suite.isRunning}
                className="border-white/20 text-white hover:bg-white/10"
              >
                {suite.isRunning ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                ) : (
                  <Play className="w-3 h-3 mr-2" />
                )}
                Run Suite
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {suite.tests.map((test) => (
              <div key={test.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                {getStatusIcon(test.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{test.name}</span>
                    <Badge variant="secondary" className={getCategoryColor(test.category)}>
                      {test.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-white/60">{test.description}</div>
                  {test.error && (
                    <div className="text-sm text-red-400 mt-1">Error: {test.error}</div>
                  )}
                </div>
                {test.duration && (
                  <div className="text-xs text-white/60">
                    {test.duration}ms
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
