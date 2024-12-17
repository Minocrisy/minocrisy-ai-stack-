import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DragDropProps {
  onDrop: (files: File[]) => void;
  onReorder?: (files: File[]) => void;
  onRemove?: (file: File) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  showPreview?: boolean;
  initialFiles?: File[];
}

interface FilePreview {
  file: File;
  preview: string;
  id: string; // Unique identifier for drag-and-drop
}

export const DragDrop: React.FC<DragDropProps> = ({
  onDrop,
  onReorder,
  onRemove,
  accept,
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = '',
  children,
  disabled = false,
  showPreview = true,
  initialFiles = [],
}) => {
  const [previews, setPreviews] = useState<FilePreview[]>(() =>
    initialFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }))
  );
  const [error, setError] = useState<string>('');
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleFileDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
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

    // Check if adding new files would exceed maxFiles
    if (previews.length + acceptedFiles.length > maxFiles) {
      setError(`Cannot add more than ${maxFiles} files`);
      return;
    }

    // Clear any previous errors
    setError('');

    // Create previews for accepted files
    if (showPreview) {
      const newPreviews = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9)
      }));
      setPreviews(prev => [...prev, ...newPreviews]);
    }

    // Call the onDrop callback
    onDrop(acceptedFiles);
  }, [onDrop, showPreview, maxFiles, previews.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    accept,
    maxFiles,
    maxSize,
    disabled,
    multiple: maxFiles > 1,
  });

  // Handle preview reordering
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleReorderDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    const sourceId = draggedId;

    if (sourceId && sourceId !== targetId) {
      setPreviews(prevPreviews => {
        const newPreviews = [...prevPreviews];
        const sourceIndex = newPreviews.findIndex(p => p.id === sourceId);
        const targetIndex = newPreviews.findIndex(p => p.id === targetId);

        if (sourceIndex !== -1 && targetIndex !== -1) {
          const [draggedPreview] = newPreviews.splice(sourceIndex, 1);
          newPreviews.splice(targetIndex, 0, draggedPreview);

          if (onReorder) {
            onReorder(newPreviews.map(p => p.file));
          }
        }

        return newPreviews;
      });
    }
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  // Handle file removal
  const handleRemove = (preview: FilePreview) => {
    if (disabled) return;

    setPreviews(prev => prev.filter(p => p.id !== preview.id));
    URL.revokeObjectURL(preview.preview);

    if (onRemove) {
      onRemove(preview.file);
    }
  };

  // Clean up previews when component unmounts
  React.useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, [previews]);

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

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

      {/* File previews with reordering */}
      {showPreview && previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview) => (
            <div
              key={preview.id}
              data-preview-id={preview.id}
              draggable={!disabled && maxFiles > 1}
              onDragStart={(e) => handleDragStart(e, preview.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleReorderDrop(e, preview.id)}
              onDragEnd={handleDragEnd}
              className={`relative aspect-square rounded-lg overflow-hidden border ${
                draggedId === preview.id ? 'border-blue-500' : 'border-gray-200'
              } group`}
            >
              {/* Preview content */}
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

              {/* File metadata overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex flex-col justify-between p-2">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRemove(preview)}
                    className="text-white bg-red-500 hover:bg-red-600 rounded-full p-1 float-right"
                    disabled={disabled}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                  <p className="truncate">{preview.file.name}</p>
                  <p>{formatFileSize(preview.file.size)}</p>
                </div>
              </div>

              {/* Drag handle for reordering */}
              {maxFiles > 1 && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9h8M8 15h8" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
