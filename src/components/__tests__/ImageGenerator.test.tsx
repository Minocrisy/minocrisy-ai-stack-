import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageGenerator from '../ImageGenerator';

// Mock the ReplicateContext module
jest.mock('../../contexts/ReplicateContext', () => {
  const mockRunPrediction = jest.fn();
  const mockGetModel = jest.fn();
  const mockGetModels = jest.fn();
  const mockGetModelVersions = jest.fn();
  const mockGetModelSchema = jest.fn();

  const mockContext = {
    loading: false,
    error: null,
    selectedModels: {
      imageGeneration: {
        owner: 'test-owner',
        name: 'test-model'
      }
    },
    runPrediction: mockRunPrediction,
    getModel: mockGetModel,
    getModels: mockGetModels,
    getModelVersions: mockGetModelVersions,
    getModelSchema: mockGetModelSchema
  };

  return {
    useReplicate: jest.fn().mockReturnValue(mockContext),
    ReplicateContext: React.createContext(mockContext)
  };
});

// Import the mocked module to access the mock functions
const mockedReplicateContext = jest.requireMock('../../contexts/ReplicateContext');
const mockUseReplicate = mockedReplicateContext.useReplicate;

describe('ImageGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation to default values
    mockUseReplicate.mockReturnValue({
      loading: false,
      error: null,
      selectedModels: {
        imageGeneration: {
          owner: 'test-owner',
          name: 'test-model'
        }
      },
      runPrediction: jest.fn(),
      getModel: jest.fn(),
      getModels: jest.fn(),
      getModelVersions: jest.fn(),
      getModelSchema: jest.fn()
    });
  });

  it('renders correctly with initial state', () => {
    render(<ImageGenerator />);
    
    expect(screen.getByText('Image Generator')).toBeInTheDocument();
    expect(screen.getByLabelText('Prompt')).toBeInTheDocument();
    expect(screen.getByLabelText('Negative Prompt')).toBeInTheDocument();
    expect(screen.getByText('Show Advanced Settings')).toBeInTheDocument();
    expect(screen.getByText('Generate Image')).toBeInTheDocument();
  });

  it('toggles advanced settings visibility', async () => {
    render(<ImageGenerator />);
    
    // Advanced settings should be hidden initially
    expect(screen.queryByText('Width: 768px')).not.toBeInTheDocument();
    
    // Click to show advanced settings
    await userEvent.click(screen.getByText('Show Advanced Settings'));
    
    // Advanced settings should be visible with default values
    expect(screen.getByText('Width: 768px')).toBeInTheDocument();
    expect(screen.getByText('Height: 768px')).toBeInTheDocument();
    expect(screen.getByText('Steps: 50')).toBeInTheDocument();
    expect(screen.getByText('Guidance Scale: 7.5')).toBeInTheDocument();
    expect(screen.getByText('Number of Images')).toBeInTheDocument();
    
    // Click to hide advanced settings
    await userEvent.click(screen.getByText('Hide Advanced Settings'));
    
    // Advanced settings should be hidden again
    expect(screen.queryByText('Width: 768px')).not.toBeInTheDocument();
  });

  it('handles prompt input correctly', async () => {
    render(<ImageGenerator />);
    
    const promptInput = screen.getByLabelText('Prompt');
    await userEvent.type(promptInput, 'test prompt');
    
    expect(promptInput).toHaveValue('test prompt');
  });

  it('handles negative prompt input correctly', async () => {
    render(<ImageGenerator />);
    
    const negativePromptInput = screen.getByLabelText('Negative Prompt');
    await userEvent.type(negativePromptInput, 'test negative prompt');
    
    expect(negativePromptInput).toHaveValue('test negative prompt');
  });

  it('updates advanced settings correctly', async () => {
    render(<ImageGenerator />);
    
    // Show advanced settings
    await userEvent.click(screen.getByText('Show Advanced Settings'));
    
    // Test width slider
    const widthSlider = screen.getByLabelText('Width');
    expect(widthSlider).toHaveAttribute('min', '256');
    expect(widthSlider).toHaveAttribute('max', '1024');
    expect(widthSlider).toHaveAttribute('step', '64');
    fireEvent.change(widthSlider, { target: { value: '512' } });
    expect(screen.getByText('Width: 512px')).toBeInTheDocument();
    
    // Test height slider
    const heightSlider = screen.getByLabelText('Height');
    expect(heightSlider).toHaveAttribute('min', '256');
    expect(heightSlider).toHaveAttribute('max', '1024');
    expect(heightSlider).toHaveAttribute('step', '64');
    fireEvent.change(heightSlider, { target: { value: '512' } });
    expect(screen.getByText('Height: 512px')).toBeInTheDocument();
    
    // Test steps slider
    const stepsSlider = screen.getByLabelText('Steps');
    expect(stepsSlider).toHaveAttribute('min', '20');
    expect(stepsSlider).toHaveAttribute('max', '100');
    fireEvent.change(stepsSlider, { target: { value: '75' } });
    expect(screen.getByText('Steps: 75')).toBeInTheDocument();
    
    // Test guidance scale slider
    const guidanceSlider = screen.getByLabelText('Guidance Scale');
    expect(guidanceSlider).toHaveAttribute('min', '1');
    expect(guidanceSlider).toHaveAttribute('max', '20');
    expect(guidanceSlider).toHaveAttribute('step', '0.1');
    fireEvent.change(guidanceSlider, { target: { value: '10.5' } });
    expect(screen.getByText('Guidance Scale: 10.5')).toBeInTheDocument();
    
    // Test number of outputs
    const outputsSelect = screen.getByLabelText('Number of Images');
    await userEvent.selectOptions(outputsSelect, '2');
    expect(outputsSelect).toHaveValue('2');
  });

  it('calls runPrediction with correct parameters when generating', async () => {
    const mockOnImageGenerated = jest.fn();
    const mockRunPrediction = jest.fn().mockResolvedValueOnce(['generated-image-url']);
    mockUseReplicate.mockReturnValue({
      ...mockUseReplicate(),
      runPrediction: mockRunPrediction
    });

    render(<ImageGenerator onImageGenerated={mockOnImageGenerated} />);
    
    // Enter prompt
    await userEvent.type(screen.getByLabelText('Prompt'), 'test prompt');
    
    // Show advanced settings and modify them
    await userEvent.click(screen.getByText('Show Advanced Settings'));
    fireEvent.change(screen.getByLabelText('Width'), { target: { value: '512' } });
    fireEvent.change(screen.getByLabelText('Height'), { target: { value: '512' } });
    
    // Click generate button
    await userEvent.click(screen.getByText('Generate Image'));
    
    // Verify runPrediction was called with correct parameters
    expect(mockRunPrediction).toHaveBeenCalledWith('imageGeneration', {
      prompt: 'test prompt',
      negative_prompt: '',
      width: 512,
      height: 512,
      num_inference_steps: 50,
      guidance_scale: 7.5,
      num_outputs: 1
    });
    
    // Verify onImageGenerated callback was called
    await waitFor(() => {
      expect(mockOnImageGenerated).toHaveBeenCalledWith('generated-image-url');
    });
  });

  it('disables generate button when loading', () => {
    mockUseReplicate.mockReturnValue({
      ...mockUseReplicate(),
      loading: true
    });
    
    render(<ImageGenerator />);
    
    const generateButton = screen.getByText('Generating...');
    expect(generateButton).toBeDisabled();
    expect(generateButton).toHaveAttribute('data-loading', 'true');
  });

  it('displays error message when error occurs', () => {
    const errorMessage = 'Test error message';
    mockUseReplicate.mockReturnValue({
      ...mockUseReplicate(),
      error: errorMessage
    });
    
    render(<ImageGenerator />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('disables generate button when no prompt is entered', () => {
    render(<ImageGenerator />);
    
    const generateButton = screen.getByText('Generate Image');
    expect(generateButton).toBeDisabled();
  });

  it('disables generate button when no image generation model is selected', () => {
    mockUseReplicate.mockReturnValue({
      ...mockUseReplicate(),
      selectedModels: {
        imageGeneration: null
      }
    });
    
    render(<ImageGenerator />);
    
    const generateButton = screen.getByText('Generate Image');
    expect(generateButton).toBeDisabled();
  });

  it('handles prediction errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockRunPrediction = jest.fn().mockRejectedValueOnce(new Error('API Error'));
    mockUseReplicate.mockReturnValue({
      ...mockUseReplicate(),
      runPrediction: mockRunPrediction
    });
    
    render(<ImageGenerator />);
    
    // Enter prompt and generate
    await userEvent.type(screen.getByLabelText('Prompt'), 'test prompt');
    await userEvent.click(screen.getByText('Generate Image'));
    
    // Verify error was logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error generating image:', expect.any(Error));
    });
    
    consoleErrorSpy.mockRestore();
  });
});
