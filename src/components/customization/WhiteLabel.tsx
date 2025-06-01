
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Palette, Upload, Eye, Download, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface BrandingConfig {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  customCSS: string;
  showPoweredBy: boolean;
  customDomain: string;
  welcomeMessage: string;
}

export const WhiteLabel: React.FC = () => {
  const [config, setConfig] = useState<BrandingConfig>({
    companyName: 'Nexus AI',
    logoUrl: '',
    primaryColor: '#7c3aed',
    secondaryColor: '#a855f7',
    fontFamily: 'Inter',
    customCSS: '',
    showPoweredBy: true,
    customDomain: '',
    welcomeMessage: 'Welcome to our AI assistant!'
  });

  const [previewMode, setPreviewMode] = useState(false);

  const updateConfig = (key: keyof BrandingConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const saveConfiguration = () => {
    // Save configuration logic here
    toast.success('Branding configuration saved');
  };

  const exportConfiguration = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'nexus-branding-config.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Configuration exported');
  };

  const colorPresets = [
    { name: 'Purple', primary: '#7c3aed', secondary: '#a855f7' },
    { name: 'Blue', primary: '#2563eb', secondary: '#3b82f6' },
    { name: 'Green', primary: '#059669', secondary: '#10b981' },
    { name: 'Red', primary: '#dc2626', secondary: '#ef4444' },
    { name: 'Orange', primary: '#ea580c', secondary: '#f97316' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">White Label Customization</h1>
          <p className="text-muted-foreground">Customize the appearance and branding of your AI platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={exportConfiguration}>
            <Download className="mr-2 h-4 w-4" />
            Export Config
          </Button>
          <Button onClick={saveConfiguration}>
            Save Changes
          </Button>
        </div>
      </div>

      {previewMode && (
        <Card className="border-dashed border-2">
          <CardContent className="p-6" style={{ 
            backgroundColor: config.primaryColor + '10',
            borderColor: config.primaryColor 
          }}>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2" style={{ color: config.primaryColor }}>
                {config.companyName}
              </h2>
              <p className="text-muted-foreground">{config.welcomeMessage}</p>
              {config.showPoweredBy && (
                <Badge variant="outline" className="mt-4">
                  Powered by Nexus AI
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Branding</CardTitle>
              <CardDescription>Configure your company's basic branding elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={config.companyName}
                  onChange={(e) => updateConfig('companyName', e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <Label htmlFor="welcome-message">Welcome Message</Label>
                <Textarea
                  id="welcome-message"
                  value={config.welcomeMessage}
                  onChange={(e) => updateConfig('welcomeMessage', e.target.value)}
                  placeholder="Welcome message for users"
                />
              </div>

              <div>
                <Label htmlFor="logo-upload">Logo</Label>
                <div className="flex items-center gap-4">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                  {config.logoUrl && (
                    <img src={config.logoUrl} alt="Logo" className="h-10 w-auto" />
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="custom-domain">Custom Domain</Label>
                <Input
                  id="custom-domain"
                  value={config.customDomain}
                  onChange={(e) => updateConfig('customDomain', e.target.value)}
                  placeholder="your-domain.com"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="powered-by">Show "Powered by Nexus AI"</Label>
                  <p className="text-sm text-muted-foreground">Display attribution to Nexus AI</p>
                </div>
                <Switch
                  id="powered-by"
                  checked={config.showPoweredBy}
                  onCheckedChange={(checked) => updateConfig('showPoweredBy', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>Customize your brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Color Presets</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {colorPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="h-16 p-2"
                      onClick={() => {
                        updateConfig('primaryColor', preset.primary);
                        updateConfig('secondaryColor', preset.secondary);
                      }}
                    >
                      <div className="space-y-1">
                        <div 
                          className="w-full h-6 rounded"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <p className="text-xs">{preset.name}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig('primaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => updateConfig('primaryColor', e.target.value)}
                      placeholder="#7c3aed"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig('secondaryColor', e.target.value)}
                      placeholder="#a855f7"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Customize fonts and text styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="font-family">Font Family</Label>
                <select
                  id="font-family"
                  value={config.fontFamily}
                  onChange={(e) => updateConfig('fontFamily', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>

              <div>
                <Label>Font Preview</Label>
                <div 
                  className="p-4 border rounded bg-muted mt-2"
                  style={{ fontFamily: config.fontFamily }}
                >
                  <h3 className="text-lg font-bold mb-2">The quick brown fox jumps over the lazy dog</h3>
                  <p className="text-sm">This is how your text will appear with the selected font family.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Customization</CardTitle>
              <CardDescription>Custom CSS and advanced styling options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-css">Custom CSS</Label>
                <Textarea
                  id="custom-css"
                  value={config.customCSS}
                  onChange={(e) => updateConfig('customCSS', e.target.value)}
                  placeholder="/* Custom CSS rules */
.custom-class {
  /* Your styles here */
}"
                  className="font-mono"
                  rows={10}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Add custom CSS to further customize the appearance of your platform
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <h4 className="font-medium mb-2">⚠️ Advanced Features</h4>
                <p className="text-sm text-muted-foreground">
                  Custom CSS can override default styles. Test thoroughly before deploying to production.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
