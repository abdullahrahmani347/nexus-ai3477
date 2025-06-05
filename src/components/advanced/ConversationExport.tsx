
import React, { useState } from 'react';
import { Download, FileText, Image, Mail, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chatStore';
import { useToast } from '@/hooks/use-toast';

interface ExportOptions {
  format: 'txt' | 'json' | 'markdown' | 'pdf';
  includeTimestamps: boolean;
  includeMetadata: boolean;
  selectedMessages?: string[];
}

export const ConversationExport: React.FC = () => {
  const { messages, getCurrentSession } = useChatStore();
  const { toast } = useToast();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'txt',
    includeTimestamps: true,
    includeMetadata: false
  });
  const [isExporting, setIsExporting] = useState(false);

  const formatConversation = (format: string) => {
    const session = getCurrentSession();
    const timestamp = new Date().toISOString();
    
    switch (format) {
      case 'txt':
        return messages.map(msg => {
          let line = `${msg.sender.toUpperCase()}: ${msg.text}`;
          if (exportOptions.includeTimestamps) {
            line += ` (${new Date(msg.timestamp).toLocaleString()})`;
          }
          return line;
        }).join('\n\n');
        
      case 'markdown':
        let markdown = `# ${session?.title || 'Chat Session'}\n\n`;
        if (exportOptions.includeMetadata) {
          markdown += `**Exported:** ${new Date().toLocaleString()}\n`;
          markdown += `**Messages:** ${messages.length}\n\n`;
        }
        markdown += '---\n\n';
        
        messages.forEach(msg => {
          markdown += `## ${msg.sender === 'user' ? '👤 You' : '🤖 Nexus AI'}\n\n`;
          if (exportOptions.includeTimestamps) {
            markdown += `*${new Date(msg.timestamp).toLocaleString()}*\n\n`;
          }
          markdown += `${msg.text}\n\n`;
        });
        return markdown;
        
      case 'json':
        return JSON.stringify({
          session: {
            title: session?.title || 'Chat Session',
            exportedAt: timestamp,
            messageCount: messages.length
          },
          messages: messages.map(msg => ({
            id: msg.id,
            sender: msg.sender,
            text: msg.text,
            timestamp: exportOptions.includeTimestamps ? msg.timestamp : undefined,
            ...(exportOptions.includeMetadata && {
              attachments: msg.attachments?.length || 0
            })
          }))
        }, null, 2);
        
      default:
        return '';
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    if (messages.length === 0) {
      toast({
        title: "No messages to export",
        description: "Start a conversation to export your chat.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const session = getCurrentSession();
      const content = formatConversation(exportOptions.format);
      const filename = `${session?.title || 'chat-session'}-${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
      
      downloadFile(content, filename);
      
      toast({
        title: "Export successful",
        description: `Chat exported as ${exportOptions.format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your conversation.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const shareConversation = async () => {
    if (navigator.share && messages.length > 0) {
      try {
        const content = formatConversation('txt');
        await navigator.share({
          title: getCurrentSession()?.title || 'Chat Session',
          text: content.slice(0, 200) + (content.length > 200 ? '...' : ''),
        });
        
        toast({
          title: "Shared successfully",
          description: "Conversation shared via system share.",
        });
      } catch (error) {
        console.error('Share error:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const content = formatConversation('txt');
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Conversation copied to your clipboard.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Export Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white/90">Export Format</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'txt', label: 'Text', icon: FileText, desc: 'Plain text format' },
                { value: 'markdown', label: 'Markdown', icon: FileText, desc: 'Formatted markdown' },
                { value: 'json', label: 'JSON', icon: FileText, desc: 'Structured data' },
                { value: 'pdf', label: 'PDF', icon: FileText, desc: 'Coming soon', disabled: true }
              ].map(({ value, label, icon: Icon, desc, disabled }) => (
                <Button
                  key={value}
                  variant={exportOptions.format === value ? "default" : "ghost"}
                  size="sm"
                  disabled={disabled}
                  onClick={() => setExportOptions(prev => ({ ...prev, format: value as any }))}
                  className={`flex flex-col h-auto p-3 ${
                    exportOptions.format === value 
                      ? "bg-purple-500 hover:bg-purple-600" 
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span className="text-xs font-medium">{label}</span>
                  <span className="text-xs opacity-60">{desc}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white/90">Options</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeTimestamps}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    includeTimestamps: e.target.checked 
                  }))}
                  className="rounded bg-white/10 border-white/20"
                />
                <span className="text-sm text-white/90">Include timestamps</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.includeMetadata}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    includeMetadata: e.target.checked 
                  }))}
                  className="rounded bg-white/10 border-white/20"
                />
                <span className="text-sm text-white/90">Include metadata</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Preview</label>
            <div className="bg-black/40 rounded-lg p-3 border border-white/10 max-h-32 overflow-y-auto">
              <pre className="text-xs text-white/70 whitespace-pre-wrap">
                {messages.length > 0 
                  ? formatConversation(exportOptions.format).slice(0, 200) + '...'
                  : 'No messages to preview'
                }
              </pre>
            </div>
          </div>

          {/* Export Stats */}
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              {messages.length} messages
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              {messages.filter(m => m.sender === 'user').length} from you
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {messages.filter(m => m.sender === 'bot').length} from AI
            </Badge>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleExport}
              disabled={isExporting || messages.length === 0}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            
            <Button
              variant="ghost"
              onClick={shareConversation}
              disabled={messages.length === 0}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
