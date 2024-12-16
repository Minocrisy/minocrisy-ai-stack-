import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModelPanel } from '../ModelPanel';
import type { ReplicateModel, ModelVersion } from '../../services/api/types';

// Mock model data
const mockModel: ReplicateModel = {
  owner: 'test-owner',
  name: 'test-model',
  description: 'Test model description',
};

const mockVersion: ModelVersion = {
  id: 'version-1',
  created_at: '2023-01-01',
  openapi_schema: {
    components: {
      schemas: {
        Input: {
          properties: {
            prompt: {
              type: 'string',
              description: 'Text prompt for generation',
            },
            negative_prompt: {
              type: 'string',
              description: 'Text to exclude from generation',
            },
          },
        },
      },
    },
  },
};

// Mock handlers
const mockOnModelSelect = jest.fn();
const mockOnRunPrediction = jest.fn();

describe('ModelPanel', () => {
  const defaultProps = {
    title: 'Test Model Panel',
    description: 'Test description',
    modelType: 'imageGeneration' as const,
    onModelSelect: mockOnModelSelect,
    onRunPrediction: mockOnRunPrediction,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial collapsed state', () => {
    render(<ModelPanel {...defaultProps} />);

    expect(screen.getByText('Test Model Panel')).toBeInTheDocument();
    expect(screen.queryByText('Model Inputs:')).not.toBeInTheDocument();
  });

  it('expands and collapses on click', async () => {
    render(<ModelPanel {...defaultProps} />);

    // Initially collapsed
    expect(screen.queryByText('Model Inputs:')).not.toBeInTheDocument();

    // Expand
    const expandButton = screen.getByRole('button');
    await userEvent.click(expandButton);
    expect(screen.getByText(/select model/i)).toBeInTheDocument();

    // Collapse
    await userEvent.click(expandButton);
    expect(screen.queryByText(/select model/i)).not.toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    render(<ModelPanel {...defaultProps} />);

    // Hover over info icon
    const infoIcon = screen.getByRole('img', { hidden: true });
    fireEvent.mouseEnter(infoIcon);

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('displays selected model information', () => {
    render(
      <ModelPanel
        {...defaultProps}
        selectedModel={{ model: mockModel, version: mockVersion }}
      />
    );

    // Expand panel
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText(`Selected Model: ${mockModel.owner}/${mockModel.name}`)).toBeInTheDocument();
    expect(screen.getByText(`Version: ${mockVersion.id}`)).toBeInTheDocument();
  });

  it('renders input fields based on model schema', () => {
    render(
      <ModelPanel
        {...defaultProps}
        selectedModel={{ model: mockModel, version: mockVersion }}
      />
    );

    // Expand panel
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByLabelText('prompt')).toBeInTheDocument();
    expect(screen.getByLabelText('negative_prompt')).toBeInTheDocument();
  });

  it('handles input changes', async () => {
    render(
      <ModelPanel
        {...defaultProps}
        selectedModel={{ model: mockModel, version: mockVersion }}
      />
    );

    // Expand panel
    fireEvent.click(screen.getByRole('button'));

    // Type in prompt
    const promptInput = screen.getByLabelText('prompt');
    await userEvent.type(promptInput, 'test prompt');
    expect(promptInput).toHaveValue('test prompt');

    // Type in negative prompt
    const negativePromptInput = screen.getByLabelText('negative_prompt');
    await userEvent.type(negativePromptInput, 'test negative prompt');
    expect(negativePromptInput).toHaveValue('test negative prompt');
  });

  it('calls onRunPrediction with input values', async () => {
    mockOnRunPrediction.mockResolvedValueOnce({});

    render(
      <ModelPanel
        {...defaultProps}
        selectedModel={{ model: mockModel, version: mockVersion }}
      />
    );

    // Expand panel
    fireEvent.click(screen.getByRole('button'));

    // Fill inputs
    await userEvent.type(screen.getByLabelText('prompt'), 'test prompt');
    await userEvent.type(screen.getByLabelText('negative_prompt'), 'test negative prompt');

    // Run prediction
    await userEvent.click(screen.getByText('Run Model'));

    expect(mockOnRunPrediction).toHaveBeenCalledWith({
      prompt: 'test prompt',
      negative_prompt: 'test negative prompt',
    });
  });

  it('displays loading state while running prediction', async () => {
    // Mock a delayed prediction
    mockOnRunPrediction.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <ModelPanel
        {...defaultProps}
        selectedModel={{ model: mockModel, version: mockVersion }}
        loading={true}
      />
    );

    // Expand panel
    fireEvent.click(screen.getByRole('button'));

    const runButton = screen.getByRole('button', { name: /running/i });
    expect(runButton).toBeDisabled();
    expect(screen.getByText(/running/i)).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'Test error message';

    render(
      <ModelPanel
        {...defaultProps}
        selectedModel={{ model: mockModel, version: mockVersion }}
        error={errorMessage}
      />
    );

    // Expand panel
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('handles prediction errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockOnRunPrediction.mockRejectedValueOnce(new Error('Prediction failed'));

    render(
      <ModelPanel
        {...defaultProps}
        selectedModel={{ model: mockModel, version: mockVersion }}
      />
    );

    // Expand panel
    fireEvent.click(screen.getByRole('button'));

    // Run prediction
    await userEvent.click(screen.getByText('Run Model'));

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error running prediction:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
