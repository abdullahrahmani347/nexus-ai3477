import React from 'react';
import { Check, ChevronDown, Upload, X, Search, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Enhanced Input Component
interface NexusInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'search' | 'password';
}

export const NexusInput: React.FC<NexusInputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  variant = 'default',
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = variant === 'password' || props.type === 'password';
  const isSearch = variant === 'search';

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : props.type;

  return (
    <div className="nexus-stack-sm">
      {label && (
        <Label className="nexus-small font-medium text-foreground">
          {label}
        </Label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        
        <Input
          {...props}
          type={inputType}
          className={cn(
            'nexus-input transition-all duration-200',
            leftIcon && 'pl-10',
            (rightIcon || isPassword || isSearch) && 'pr-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
        />
        
        {(rightIcon || isPassword || isSearch) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isPassword ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            ) : isSearch ? (
              <Search className="w-4 h-4 text-muted-foreground" />
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>
      
      {(error || helper) && (
        <div className="nexus-caption">
          {error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <span className="text-muted-foreground">{helper}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Enhanced Select Component
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface NexusSelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  helper?: string;
  searchable?: boolean;
  onValueChange: (value: string) => void;
  className?: string;
}

export const NexusSelect: React.FC<NexusSelectProps> = ({
  options,
  value,
  placeholder = "Select an option",
  label,
  error,
  helper,
  searchable = false,
  onValueChange,
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const selectedOption = options.find(opt => opt.value === value);
  
  const filteredOptions = searchable
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  return (
    <div className={cn('nexus-stack-sm', className)}>
      {label && (
        <Label className="nexus-small font-medium text-foreground">
          {label}
        </Label>
      )}
      
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full justify-between nexus-input h-auto py-3',
            error && 'border-red-500',
            !selectedOption && 'text-muted-foreground'
          )}
        >
          <span>{selectedOption?.label || placeholder}</span>
          <ChevronDown className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} />
        </Button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 nexus-card p-2 z-50 max-h-60 overflow-y-auto">
            {searchable && (
              <div className="p-2 border-b border-border mb-2">
                <NexusInput
                  variant="search"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  if (!option.disabled) {
                    onValueChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }
                }}
                className={cn(
                  'p-3 rounded-lg cursor-pointer transition-colors duration-200',
                  'hover:bg-muted/50',
                  option.disabled && 'opacity-50 cursor-not-allowed',
                  value === option.value && 'bg-primary/10 text-primary'
                )}
              >
                {option.label}
              </div>
            ))}
            
            {filteredOptions.length === 0 && (
              <div className="p-3 text-center text-muted-foreground">
                No options found
              </div>
            )}
          </div>
        )}
      </div>
      
      {(error || helper) && (
        <div className="nexus-caption">
          {error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <span className="text-muted-foreground">{helper}</span>
          )}
        </div>
      )}
    </div>
  );
};

// File Upload Component
interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  label?: string;
  helper?: string;
  error?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept,
  multiple = false,
  maxSize = 10,
  label,
  helper,
  error,
  className
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return false;
      }
      return true;
    });
    
    onFileSelect(validFiles);
  };

  return (
    <div className={cn('nexus-stack-sm', className)}>
      {label && (
        <Label className="nexus-small font-medium text-foreground">
          {label}
        </Label>
      )}
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
          error && 'border-red-500'
        )}
      >
        <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
        <div className="nexus-small">
          <span className="font-medium">Click to upload</span> or drag and drop
        </div>
        <div className="nexus-caption mt-1">
          {accept && `Accepted formats: ${accept}`}
          {maxSize && ` • Max size: ${maxSize}MB`}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      {(error || helper) && (
        <div className="nexus-caption">
          {error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <span className="text-muted-foreground">{helper}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Switch Component
interface NexusSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const NexusSwitch: React.FC<NexusSwitchProps> = ({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className
}) => {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <button
        type="button"
        onClick={() => !disabled && onCheckedChange(!checked)}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          checked ? 'bg-primary' : 'bg-muted',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-200',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
      
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <div className="nexus-small font-medium text-foreground">
              {label}
            </div>
          )}
          {description && (
            <div className="nexus-caption text-muted-foreground">
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};