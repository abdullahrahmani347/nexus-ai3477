
export interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string | ArrayBuffer;
  preview?: string;
}

export class FileService {
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  static readonly ALLOWED_TYPES = [
    'text/plain',
    'text/markdown',
    'application/json',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ];

  static async processFile(file: File): Promise<FileData> {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${this.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported`);
    }

    const content = await this.readFile(file);
    const fileData: FileData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2),
      name: file.name,
      type: file.type,
      size: file.size,
      content
    };

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      fileData.preview = await this.generateImagePreview(file);
    }

    return fileData;
  }

  private static readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target?.result || '');
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      if (file.type.startsWith('text/') || file.type === 'application/json') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }

  private static generateImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to generate preview'));
      };

      reader.readAsDataURL(file);
    });
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
