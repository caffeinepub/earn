import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadFieldProps {
  onFileSelect: (file: File) => void;
  onClear: () => void;
  selectedFile: File | null;
  accept?: string;
  label?: string;
  description?: string;
}

export default function FileUploadField({
  onFileSelect,
  onClear,
  selectedFile,
  accept = 'image/*',
  label = 'Upload Screenshot',
  description = 'Select a payment screenshot to upload',
}: FileUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    onClear();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />

      {!selectedFile ? (
        <Button
          type="button"
          variant="outline"
          className="w-full h-32 border-dashed"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click to upload</span>
          </div>
        </Button>
      ) : (
        <div className="relative border border-border rounded-lg p-4">
          {preview && (
            <div className="mb-3">
              <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={handleClear}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
