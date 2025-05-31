
import React, { useState } from 'react';
import { Download, FileText, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChatStore } from '../store/chatStore';

interface ExportDialogProps {
  children: React.ReactNode;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ children }) => {
  const [format, setFormat] = useState<'txt' | 'json' | 'md'>('txt');
  const { messages, getCurrentSession, currentSessionId } = useChatStore();

  const exportTranscript = () => {
    const session = getCurrentSession();
    const sessionMessages = session?.messages || messages;
    
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'txt':
        content = sessionMessages
          .map(msg => `${msg.sender.toUpperCase()} (${new Date(msg.timestamp).toLocaleString()}): ${msg.text}`)
          .join('\n\n');
        filename = `chat-transcript-${currentSessionId}.txt`;
        mimeType = 'text/plain';
        break;
        
      case 'json':
        content = JSON.stringify({
          sessionId: currentSessionId,
          sessionTitle: session?.title || 'Chat Session',
          exportedAt: new Date().toISOString(),
          messages: sessionMessages.map(msg => ({
            id: msg.id,
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp,
            attachments: msg.attachments?.map(att => ({
              name: att.name,
              type: att.type,
              size: att.size
            }))
          }))
        }, null, 2);
        filename = `chat-export-${currentSessionId}.json`;
        mimeType = 'application/json';
        break;
        
      case 'md':
        content = `# ${session?.title || 'Chat Session'}\n\n*Exported on ${new Date().toLocaleDateString()}*\n\n---\n\n`;
        content += sessionMessages
          .map(msg => {
            const timestamp = new Date(msg.timestamp).toLocaleString();
            const sender = msg.sender === 'user' ? '👤 **You**' : '🤖 **AI Assistant**';
            return `## ${sender}\n*${timestamp}*\n\n${msg.text}\n`;
          })
          .join('\n---\n\n');
        filename = `chat-transcript-${currentSessionId}.md`;
        mimeType = 'text/markdown';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export Chat</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Export Format
            </label>
            <Select value={format} onValueChange={(value) => setFormat(value as 'txt' | 'json' | 'md')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="txt">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Plain Text (.txt)</span>
                  </div>
                </SelectItem>
                <SelectItem value="md">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Markdown (.md)</span>
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center space-x-2">
                    <FileJson className="w-4 h-4" />
                    <span>JSON (.json)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {format === 'txt' && 'Export as a simple text file with timestamps'}
              {format === 'md' && 'Export as a formatted Markdown document'}
              {format === 'json' && 'Export as structured JSON data with metadata'}
            </p>
          </div>
          
          <Button 
            onClick={exportTranscript}
            className="w-full"
            disabled={messages.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export {messages.length} Message{messages.length !== 1 ? 's' : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
