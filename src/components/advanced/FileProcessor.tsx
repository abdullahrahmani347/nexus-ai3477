
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image, FileText, Archive } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ProcessedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
  url?: string;
  processingStatus: 'pending' | 'processing' | 'completed' | 'error';
  extractedText?: string;
  metadata?: Record<string, any>;
}

export const FileProcessor: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload files",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    const newFiles: ProcessedFile[] = acceptedFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      processingStatus: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Process each file
    for (const file of acceptedFiles) {
      const fileId = newFiles.find(f => f.name === file.name)?.id;
      if (!fileId) continue;

      try {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, processingStatus: 'processing' } : f
        ));

        const processedData = await processFile(file);
        
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, ...processedData, processingStatus: 'completed' }
            : f
        ));
      } catch (error) {
        console.error('File processing error:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, processingStatus: 'error' } : f
        ));
      }
    }

    setIsProcessing(false);
  }, [user, toast]);

  const processFile = async (file: File): Promise<Partial<ProcessedFile>> => {
    if (!user) throw new Error('User not authenticated');

    // Upload to Supabase storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('file-uploads')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('file-uploads')
      .getPublicUrl(fileName);

    // Extract text content based on file type
    let extractedText = '';
    let metadata = {};

    if (file.type.startsWith('text/')) {
      extractedText = await file.text();
    } else if (file.type === 'application/pdf') {
      extractedText = 'PDF text extraction requires additional processing';
    } else if (file.type.startsWith('image/')) {
      metadata = { 
        dimensions: 'Processing...',
        format: file.type.split('/')[1]
      };
    }

    return {
      url: publicUrl,
      extractedText,
      metadata
    };
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/*': ['.txt', '.md', '.json'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type === 'application/pdf') return <FileText className="w-5 h-5" />;
    if (type.includes('archive') || type.includes('zip')) return <Archive className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const getStatusColor = (status: ProcessedFile['processingStatus']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300';
      case 'processing': return 'bg-blue-500/20 text-blue-300';
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'error': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="nexus-card p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-purple-400 bg-purple-500/10' 
              : 'border-white/20 hover:border-purple-400/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-white/60" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {isDragActive ? 'Drop files here' : 'Upload Files for Processing'}
          </h3>
          <p className="text-white/60 mb-4">
            Drag & drop files or click to select. Supports text, images, PDFs, and documents.
          </p>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            Browse Files
          </Button>
        </div>
      </Card>

      {files.length > 0 && (
        <Card className="nexus-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Processing Queue</h3>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium truncate">{file.name}</span>
                    <Badge variant="secondary" className={getStatusColor(file.processingStatus)}>
                      {file.processingStatus}
                    </Badge>
                  </div>
                  <div className="text-xs text-white/60">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                  {file.processingStatus === 'processing' && (
                    <Progress value={50} className="w-full mt-2" />
                  )}
                  {file.extractedText && (
                    <div className="text-xs text-white/60 mt-1">
                      Extracted: {file.extractedText.substring(0, 100)}...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
