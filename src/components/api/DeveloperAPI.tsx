
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Code, Copy, Key, Activity, Book, Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: Date;
  lastUsed?: Date;
  requests: number;
  status: 'active' | 'revoked';
}

export const DeveloperAPI: React.FC = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = () => {
    // Mock API keys
    const mockKeys: APIKey[] = [
      {
        id: '1',
        name: 'Production API',
        key: 'nx_1234567890abcdef',
        created: new Date(),
        lastUsed: new Date(),
        requests: 1250,
        status: 'active'
      },
      {
        id: '2',
        name: 'Development API',
        key: 'nx_abcdef1234567890',
        created: new Date(),
        requests: 485,
        status: 'active'
      }
    ];
    setApiKeys(mockKeys);
  };

  const generateAPIKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `nx_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date(),
      requests: 0,
      status: 'active'
    };

    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    toast.success('API key generated successfully');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const revokeKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' } : key
    ));
    toast.success('API key revoked');
  };

  const codeExamples = {
    curl: `curl -X POST https://api.nexusai.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "nexus-gpt-4",
    "messages": [
      {"role": "user", "content": "Hello, world!"}
    ]
  }'`,
    javascript: `const response = await fetch('https://api.nexusai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'nexus-gpt-4',
    messages: [
      { role: 'user', content: 'Hello, world!' }
    ]
  })
});

const data = await response.json();
console.log(data);`,
    python: `import requests

response = requests.post(
    'https://api.nexusai.com/v1/chat/completions',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'model': 'nexus-gpt-4',
        'messages': [
            {'role': 'user', 'content': 'Hello, world!'}
        ]
    }
)

print(response.json())`
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Developer API</h1>
          <p className="text-muted-foreground">Integrate Nexus AI into your applications</p>
        </div>
        <Badge variant="secondary">
          <Code className="mr-1 h-3 w-3" />
          API v1.0
        </Badge>
      </div>

      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate New API Key</CardTitle>
              <CardDescription>Create a new API key for your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API, Development API"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={generateAPIKey}>
                    <Key className="mr-2 h-4 w-4" />
                    Generate Key
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>Manage your existing API keys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{apiKey.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created {apiKey.created.toLocaleDateString()}
                          {apiKey.lastUsed && ` • Last used ${apiKey.lastUsed.toLocaleDateString()}`}
                        </p>
                      </div>
                      <Badge variant={apiKey.status === 'active' ? 'default' : 'destructive'}>
                        {apiKey.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1 font-mono text-sm bg-muted p-2 rounded">
                        {showKeys[apiKey.id] ? apiKey.key : apiKey.key.replace(/./g, '•')}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {apiKey.status === 'active' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => revokeKey(apiKey.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Activity className="h-4 w-4" />
                        {apiKey.requests} requests
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Complete guide to the Nexus AI API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Base URL</h3>
                  <code className="bg-muted p-2 rounded block">https://api.nexusai.com/v1</code>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Include your API key in the Authorization header:
                  </p>
                  <code className="bg-muted p-2 rounded block">Authorization: Bearer YOUR_API_KEY</code>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Endpoints</h3>
                  <div className="space-y-2">
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">POST</Badge>
                        <code>/chat/completions</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Generate chat completions using various AI models
                      </p>
                    </div>
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">GET</Badge>
                        <code>/models</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        List available AI models
                      </p>
                    </div>
                    <div className="border rounded p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">POST</Badge>
                        <code>/embeddings</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Generate text embeddings for semantic search
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>Sample code in different programming languages</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="curl" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>

                {Object.entries(codeExamples).map(([lang, code]) => (
                  <TabsContent key={lang} value={lang}>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                        <code>{code}</code>
                      </pre>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
              <CardDescription>Monitor your API usage and limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded p-4 text-center">
                    <div className="text-2xl font-bold">1,735</div>
                    <p className="text-sm text-muted-foreground">Requests this month</p>
                  </div>
                  <div className="border rounded p-4 text-center">
                    <div className="text-2xl font-bold">125ms</div>
                    <p className="text-sm text-muted-foreground">Avg response time</p>
                  </div>
                  <div className="border rounded p-4 text-center">
                    <div className="text-2xl font-bold">99.9%</div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Rate Limits</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">Requests per minute</span>
                      <Badge variant="outline">100</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">Requests per day</span>
                      <Badge variant="outline">10,000</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
