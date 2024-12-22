import React from 'react';
import { render } from '@testing-library/react';
import { DragDrop } from '../DragDrop';
import { useDropzone } from 'react-dropzone';

jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn()
}));

describe('DragDrop', () => {
  beforeEach(() => {
    (useDropzone as jest.Mock).mockImplementation(() => ({
      getRootProps: () => ({
        role: 'presentation'
      }),
      getInputProps: () => ({
        type: 'file',
        accept: '*/*'
      }),
      isDragActive: false,
      isDragAccept: false,
      isDragReject: false,
      isFileDialogActive: false,
      isFocused: false,
      acceptedFiles: [],
      fileRejections: [],
      rootRef: { current: null },
      inputRef: { current: null },
      open: jest.fn()
    }));
  });

  it('renders without crashing', () => {
    const { container } = render(
      <DragDrop onDrop={() => {}} />
    );
    expect(container).toBeInTheDocument();
  });
});
