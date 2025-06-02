import React, { useState } from 'react';
import { Download, FileText, FileJson, File, Printer, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useChatStore } from '@/store/chatStore';
import jsPDF from 'jspdf';

interface ExportFormat {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'json',
    name: 'JSON',
    icon: <FileJson className="w-4 h-4" />,
    description: 'Structured data format'
  },
  {
    id: 'txt',
    name: 'Text',
    icon: <FileText className="w-4 h-4" />,
    description: 'Plain text format'
  },
  {
    id: 'pdf',
    name: 'PDF',
    icon: <File className="w-4 h-4" />,
    description: 'Portable document format'
  },
  {
    id: 'csv',
    name: 'CSV',
    icon: <FileText className="w-4 h-4" />,
    description: 'Comma-separated values'
  }
];

interface ExportOptionsProps {
  children: React.ReactNode;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ children }) => {
  const { messages, getCurrentSession, currentSessionId } = useChatStore();
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [dateRange, setDateRange] = useState('all');

  const generateExport = async () => {
    const session = getCurrentSession();
    const exportData = {
      sessionId: currentSessionId,
      sessionTitle: session?.title || 'API Conversation',
      exportedAt: new Date().toISOString(),
      format: selectedFormat,
      metadata: includeMetadata ? {
        totalMessages: messages.length,
        userMessages: messages.filter(m => m.sender === 'user').length,
        botMessages: messages.filter(m => m.sender === 'bot').length,
        dateRange: { start: messages[0]?.timestamp, end: messages[messages.length - 1]?.timestamp }
      } : undefined,
      messages: messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: msg.timestamp,
        attachments: includeAttachments ? msg.attachments : undefined
      }))
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (selectedFormat) {
      case 'json':
        content = JSON.stringify(exportData, null, 2);
        filename = `nexus-api-export-${currentSessionId}.json`;
        mimeType = 'application/json';
        break;

      case 'txt':
        content = `Nexus AI API Export\n${'='.repeat(50)}\n\n`;
        content += `Session: ${exportData.sessionTitle}\n`;
        content += `Exported: ${new Date().toLocaleString()}\n`;
        content += `Messages: ${messages.length}\n\n`;
        content += messages.map(msg => 
          `[${new Date(msg.timestamp).toLocaleString()}] ${msg.sender.toUpperCase()}: ${msg.text}`
        ).join('\n\n');
        filename = `nexus-api-export-${currentSessionId}.txt`;
        mimeType = 'text/plain';
        break;

      case 'csv':
        const headers = ['Timestamp', 'Sender', 'Message', 'Attachments'];
        const rows = messages.map(msg => [
          new Date(msg.timestamp).toISOString(),
          msg.sender,
          `"${msg.text.replace(/"/g, '""')}"`,
          msg.attachments?.length || 0
        ]);
        content = [headers, ...rows].map(row => row.join(',')).join('\n');
        filename = `nexus-api-export-${currentSessionId}.csv`;
        mimeType = 'text/csv';
        break;

      case 'pdf':
        const pdf = new jsPDF();
        pdf.setFontSize(20);
        pdf.text('Nexus AI API Export', 20, 30);
        
        pdf.setFontSize(12);
        let yPosition = 50;
        
        messages.forEach((msg, index) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          
          const timestamp = new Date(msg.timestamp).toLocaleString();
          const sender = msg.sender.toUpperCase();
          const text = msg.text.length > 100 ? msg.text.substring(0, 100) + '...' : msg.text;
          
          pdf.text(`[${timestamp}] ${sender}:`, 20, yPosition);
          yPosition += 10;
          pdf.text(text, 20, yPosition);
          yPosition += 20;
        });
        
        pdf.save(`nexus-api-export-${currentSessionId}.pdf`);
        return;

      default:
        return;
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
      <DialogContent className="sm:max-w-md nexus-card border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Download className="w-5 h-5 text-purple-400" />
            Export API Conversation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white/80 mb-2 block">
              Export Format
            </label>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/20">
                {EXPORT_FORMATS.map(format => (
                  <SelectItem key={format.id} value={format.id}>
                    <div className="flex items-center gap-2">
                      {format.icon}
                      <div>
                        <div className="font-medium">{format.name}</div>
                        <div className="text-xs text-white/60">{format.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-white/80">Options</label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="metadata"
                checked={includeMetadata}
                onCheckedChange={(checked) => setIncludeMetadata(checked === true)}
              />
              <label htmlFor="metadata" className="text-sm text-white/70">
                Include metadata and statistics
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="attachments"
                checked={includeAttachments}
                onCheckedChange={(checked) => setIncludeAttachments(checked === true)}
              />
              <label htmlFor="attachments" className="text-sm text-white/70">
                Include attachment information
              </label>
            </div>
          </div>

          <div className="nexus-card p-3 border border-white/10">
            <p className="text-sm text-white/60">
              Export will include {messages.length} messages from this API session.
            </p>
          </div>

          <Button 
            onClick={generateExport}
            className="w-full nexus-gradient hover:opacity-90 text-white font-medium"
            disabled={messages.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Conversation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
