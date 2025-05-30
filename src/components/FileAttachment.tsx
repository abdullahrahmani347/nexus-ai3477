
import React, { useRef } from 'react';
import { Paperclip, X, File, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileService, type FileData } from '../services/fileService';

interface FileAttachmentProps {
  files: FileData[];
  onFilesAdd: (files: FileData[]) => void;
  onFileRemove: (fileId: string) => void;
  disabled?: boolean;
}

const FileAttachment: React.FC<FileAttachmentProps> = ({
  files,
  onFilesAdd,
  onFileRemove,
  disabled = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    try {
      const processedFiles = await Promise.all(
        selectedFiles.map(file => FileService.processFile(file))
      );
      onFilesAdd(processedFiles);
    } catch (error) {
      console.error('Error processing files:', error);
      alert(error instanceof Error ? error.message : 'Failed to process files');
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    
    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    try {
      const processedFiles = await Promise.all(
        droppedFiles.map(file => FileService.processFile(file))
      );
      onFilesAdd(processedFiles);
    } catch (error) {
      console.error('Error processing dropped files:', error);
      alert(error instanceof Error ? error.message : 'Failed to process files');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-2">
      {/* File attachments display */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-3 py-2 rounded-md border"
            >
              {file.type.startsWith('image/') ? (
                <Image className="w-4 h-4 text-blue-500" />
              ) : (
                <File className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-32">
                {file.name}
              </span>
              <span className="text-xs text-gray-500">
                {FileService.formatFileSize(file.size)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFileRemove(file.id)}
                className="w-5 h-5 p-0 hover:bg-red-100 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* File upload controls */}
      <div className="flex items-center space-x-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.md,.json,.jpg,.jpeg,.png,.gif,.webp,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
          title="Attach files"
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="text-xs text-gray-500 dark:text-gray-400"
        >
          or drag & drop files
        </div>
      </div>
    </div>
  );
};

export default FileAttachment;
