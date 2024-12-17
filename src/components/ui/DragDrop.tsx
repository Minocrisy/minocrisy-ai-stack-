import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DragDropProps {
  onDrop: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  showPreview?: boolean;
}

interface FilePreview {
  file: File;
  preview: string;
}

export const DragDrop: React.FC<DragDropProps> = ({
  onDrop,
  accept,
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = '',
  children,
  disabled = false,
  showPreview = true,
}) => {
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [error, setError] = useState<string>('');

  const handleDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(rejection => {
        const error = rejection.errors[0];
        switch (error.code) {
          case 'file-too-large':
            return `File ${rejection.file.name} is too large`;
          case 'file-invalid-type':
            return `File ${rejection.file.name} has invalid type`;
          case 'too-many-files':
            return 'Too many files selected';
          default:
            return `Error with file ${rejection.file.name}: ${error.message}`;
        }
      });
      setError(errors.join(', '));
      return;
    }

    // Clear any previous errors
    setError('');

    // Create previews for accepted files
    if (showPreview) {
      const newPreviews = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setPreviews(prev => [...prev, ...newPreviews]);
    }

    // Call the onDrop callback
    onDrop(acceptedFiles);
  }, [onDrop, showPreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxFiles,
    maxSize,
    disabled,
    multiple: maxFiles > 1,
  });

  // Clean up previews when component unmounts
  React.useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, [previews]);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps({
          className: `border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}`,
        })}
      >
        <input {...getInputProps()} />
        {children || (
          <div className="text-center">
            {isDragActive ? (
              <p className="text-blue-600">Drop files here...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  {accept
                    ? `Accepted formats: ${Object.values(accept)
                        .flat()
                        .join(', ')}`
                    : 'All file types accepted'}
                </p>
                {maxFiles > 1 && (
                  <p className="text-sm text-gray-500">
                    Maximum {maxFiles} files
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Maximum size: {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* File previews */}
      {showPreview && previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div
              key={preview.file.name + index}
              className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
            >
              {preview.file.type.startsWith('image/') ? (
                <img
                  src={preview.preview}
                  alt={preview.file.name}
                  className="w-full h-full object-cover"
                />
              ) : preview.file.type.startsWith('video/') ? (
                <video
                  src={preview.preview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <p className="text-sm text-gray-500 text-center p-2 break-words">
                    {preview.file.name}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
