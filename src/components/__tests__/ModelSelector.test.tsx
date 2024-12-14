import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModelSelector } from '../ModelSelector';
import { ReplicateContext } from '../../contexts/ReplicateContext';
import type { ReplicateModel, ModelVersion } from '../../services/api/types';

// Mock Replicate context
const mockGetModel = jest.fn();
const mockGetModels = jest.fn();
const mockGetModelVersions = jest.fn();
const mockGetModelSchema = jest.fn();

const mockReplicateContext = {
  getModel: mockGetModel,
  getModels: mockGetModels,
  getModelVersions: mockGetModelVersions,
  getModelSchema: mockGetModelSchema,
};

// Mock model data
const mockModels: ReplicateModel[] = [
  {
    owner: 'test-owner-1',
    name: 'test-model-1',
    description: 'Test model 1 description',
  },
  {
    owner: 'test-owner-2',
    name: 'test-model-2',
    description: 'Test model 2 description',
  },
];

const mockVersions: ModelVersion[] = [
  {
    id: 'version-1',
    created_at: '2023-01-01',
  },
  {
    id: 'version-2',
    created_at: '2023-01-02',
  },
];

// Wrap component with Replicate context
const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <ReplicateContext.Provider value={mockReplicateContext as any}>
      {ui}
    </ReplicateContext.Provider>
  );
};

describe('ModelSelector', () => {
  const mockOnModelSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetModels.mockResolvedValue(mockModels);
    mockGetModelVersions.mockResolvedValue(mockVersions);
  });

  it('renders select model button', () => {
    renderWithContext(
      <ModelSelector onModelSelect={mockOnModelSelect} modelType="character" />
    );

    expect(screen.getByRole('button', { name: /select model/i })).toBeInTheDocument();
  });

  it('opens model selection dialog on button click', async () => {
    renderWithContext(
      <ModelSelector onModelSelect={mockOnModelSelect} modelType="character" />
    );

    const selectButton = screen.getByRole('button', { name: /select model/i });
    fireEvent.click(selectButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/select model/i)).toBeInTheDocument();
  });

  it('loads and displays models', async () => {
    renderWithContext(
      <ModelSelector onModelSelect={mockOnModelSelect} modelType="character" />
    );

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /select model/i }));

    // Wait for models to load
    await waitFor(() => {
      expect(mockGetModels).toHaveBeenCalled();
    });

    // Check if models are displayed
    expect(screen.getByText('test-owner-1/test-model-1')).toBeInTheDocument();
    expect(screen.getByText('test-owner-2/test-model-2')).toBeInTheDocument();
  });

  it('handles model search', async () => {
    renderWithContext(
      <ModelSelector onModelSelect={mockOnModelSelect} modelType="character" />
    );

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /select model/i }));

    // Type in search
    const searchInput = screen.getByPlaceholderText(/search models/i);
    await userEvent.type(searchInput, 'test search');

    // Click search button
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // Verify search was performed
    expect(mockGetModels).toHaveBeenCalledWith('test search character');
  });

  it('loads model versions when model is selected', async () => {
    renderWithContext(
      <ModelSelector onModelSelect={mockOnModelSelect} modelType="character" />
    );

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /select model/i }));

    // Wait for models to load
    await waitFor(() => {
      expect(screen.getByText('test-owner-1/test-model-1')).toBeInTheDocument();
    });

    // Select a model
    fireEvent.click(screen.getByText('test-owner-1/test-model-1'));

    // Verify versions are loaded
    await waitFor(() => {
      expect(mockGetModelVersions).toHaveBeenCalledWith('test-owner-1', 'test-model-1');
    });

    // Check if versions are displayed
    expect(screen.getByText('version-1'.substring(0, 8))).toBeInTheDocument();
    expect(screen.getByText('version-2'.substring(0, 8))).toBeInTheDocument();
  });

  it('calls onModelSelect with selected model and version', async () => {
    renderWithContext(
      <ModelSelector onModelSelect={mockOnModelSelect} modelType="character" />
    );

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /select model/i }));

    // Wait for models to load and select one
    await waitFor(() => {
      expect(screen.getByText('test-owner-1/test-model-1')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('test-owner-1/test-model-1'));

    // Wait for versions to load and select one
    await waitFor(() => {
      expect(screen.getByText('version-1'.substring(0, 8))).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('version-1'.substring(0, 8)));

    // Click select button
    fireEvent.click(screen.getByRole('button', { name: /^select$/i }));

    // Verify onModelSelect was called with correct args
    expect(mockOnModelSelect).toHaveBeenCalledWith(mockModels[0], mockVersions[0]);
  });

  it('handles suggested models', async () => {
    const suggestedModels = [
      { owner: 'suggested-owner', name: 'suggested-model', version: 'suggested-version' }
    ];

    mockGetModel.mockResolvedValueOnce({
      owner: 'suggested-owner',
      name: 'suggested-model',
      description: 'Suggested model description',
    });

    mockGetModelSchema.mockResolvedValueOnce({
      id: 'suggested-version',
      created_at: '2023-01-01',
    });

    renderWithContext(
      <ModelSelector
        onModelSelect={mockOnModelSelect}
        modelType="character"
        suggestedModels={suggestedModels}
      />
    );

    // Verify suggested models are loaded
    await waitFor(() => {
      expect(mockGetModel).toHaveBeenCalledWith('suggested-owner', 'suggested-model');
      expect(mockGetModelSchema).toHaveBeenCalledWith(
        'suggested-owner',
        'suggested-model',
        'suggested-version'
      );
    });
  });

  it('displays error message when loading fails', async () => {
    const errorMessage = 'Failed to load models';
    mockGetModels.mockRejectedValueOnce(new Error(errorMessage));

    renderWithContext(
      <ModelSelector onModelSelect={mockOnModelSelect} modelType="character" />
    );

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /select model/i }));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('handles loading states correctly', async () => {
    // Mock a delay in loading
    mockGetModels.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockModels), 100)));

    renderWithContext(
      <ModelSelector onModelSelect={mockOnModelSelect} modelType="character" />
    );

    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /select model/i }));

    // Check for loading state
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText('test-owner-1/test-model-1')).toBeInTheDocument();
    });
  });
});
