import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { DragDrop } from '../DragDrop';
import type { DropzoneOptions, FileRejection } from 'react-dropzone';

type MockDropzoneHook = {
  getRootProps: () => { 'data-testid': string };
  getInputProps: () => { 'data-testid': string };
  isDragActive: boolean;
};

// Store for the last options
let lastDropzoneOptions: DropzoneOptions | null = null;
  useDropzone: (options: DropzoneOptions): MockDropzoneHook => {
    // Store the callback for testing
    (useDropzone as any).lastOptions = options;

    return {
      getRootProps: () => ({ 'data-testid': 'dropzone' }),
      getInputProps: () => ({ 'data-testid': 'dropzone-input' }),
      isDragActive: false,
    };
  },
}));

// Helper to trigger the last onDrop callback
const triggerDropEvent = (acceptedFiles: File[], rejectedFiles: FileRejection[] = []) => {
  const lastOptions = (jest.requireMock('react-dropzone').useDropzone as any).lastOptions;
  if (lastOptions?.onDrop) {
    lastOptions.onDrop(acceptedFiles, rejectedFiles);
  }
};

describe('DragDrop', () => {
  const mockOnDrop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear all instances and calls to constructor and all methods:
    URL.createObjectURL = jest.fn(() => 'mock-url');
    URL.revokeObjectURL = jest.fn();
  });

  it('renders basic dropzone with default text', () => {
    render(<DragDrop onDrop={mockOnDrop} />);
    expect(screen.getByText(/drag and drop files here/i)).toBeInTheDocument();
  });

  it('shows custom children when provided', () => {
    render(
      <DragDrop onDrop={mockOnDrop}>
        <p>Custom dropzone content</p>
      </DragDrop>
    );
    expect(screen.getByText('Custom dropzone content')).toBeInTheDocument();
  });

  it('shows file size limit', () => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    render(<DragDrop onDrop={mockOnDrop} maxSize={maxSize} />);
    expect(screen.getByText('Maximum size: 5MB')).toBeInTheDocument();
  });

  it('shows max files limit when greater than 1', () => {
    render(<DragDrop onDrop={mockOnDrop} maxFiles={3} />);
    expect(screen.getByText('Maximum 3 files')).toBeInTheDocument();
  });

  it('shows accepted file types when provided', () => {
    const accept = {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'video/*': ['.mp4', '.mov']
    };
    render(<DragDrop onDrop={mockOnDrop} accept={accept} />);
    expect(screen.getByText(/accepted formats:/i)).toBeInTheDocument();
    expect(screen.getByText(/.jpg, .jpeg, .png, .mp4, .mov/i)).toBeInTheDocument();
  });

  it('handles file drop correctly', async () => {
    render(<DragDrop onDrop={mockOnDrop} />);
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

    triggerDropEvent([file]);

    expect(mockOnDrop).toHaveBeenCalledWith([file]);
  });

  it('shows error for rejected files', async () => {
    const maxSize = 1024; // 1KB
    render(<DragDrop onDrop={mockOnDrop} maxSize={maxSize} />);

    const largeFile = new File(['x'.repeat(2048)], 'large.txt', { type: 'text/plain' });
    const rejection: FileRejection = {
      file: largeFile,
      errors: [{ code: 'file-too-large', message: 'File is too large' }]
    };

    triggerDropEvent([], [rejection]);

    await waitFor(() => {
      expect(screen.getByText(/file large.txt is too large/i)).toBeInTheDocument();
    });
  });

  it('is disabled when disabled prop is true', () => {
    render(<DragDrop onDrop={mockOnDrop} disabled />);
    const dropzone = screen.getByTestId('dropzone');
    expect(dropzone).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('handles multiple file uploads when maxFiles > 1', async () => {
    render(<DragDrop onDrop={mockOnDrop} maxFiles={3} />);

    const files = [
      new File(['content1'], 'file1.txt', { type: 'text/plain' }),
      new File(['content2'], 'file2.txt', { type: 'text/plain' })
    ];

    triggerDropEvent(files);

    expect(mockOnDrop).toHaveBeenCalledWith(files);
  });

  it('shows preview for image files', async () => {
    render(<DragDrop onDrop={mockOnDrop} showPreview />);

    const imageFile = new File([''], 'test.png', { type: 'image/png' });

    triggerDropEvent([imageFile]);

    await waitFor(() => {
      const preview = screen.getByAltText('test.png');
      expect(preview).toBeInTheDocument();
      expect(preview).toHaveAttribute('src', 'mock-url');
    });
  });
});
