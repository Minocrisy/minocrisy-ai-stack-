import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { ModelManagementProvider, useModelManagement, useReplicate } from '../ModelManagementContext';
import type { Model, ModelVersion } from '../../services/api/types';

// Mock environment variables
process.env.VITE_REPLICATE_API_TOKEN = 'test-token';

// Mock model data
const mockModel: Model = {
  id: 'owner/model',
  provider: 'replicate',
  name: 'model',
  description: 'Test model',
};

const mockVersion: ModelVersion = {
  id: 'version1',
  created_at: '2024-01-01',
};

describe('ModelManagementContext', () => {
  beforeEach(() => {
    // Mock fetch for API calls
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          owner: 'owner',
          name: 'model',
          description: 'Test model',
        }),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('provides model management functionality through useModelManagement', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModelManagementProvider>{children}</ModelManagementProvider>
    );

    const { result } = renderHook(() => useModelManagement(), { wrapper });

    expect(result.current.getModel).toBeDefined();
    expect(result.current.getModels).toBeDefined();
    expect(result.current.getModelVersions).toBeDefined();
    expect(result.current.runPrediction).toBeDefined();
  });

  it('maintains backward compatibility through useReplicate', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModelManagementProvider>{children}</ModelManagementProvider>
    );

    const { result } = renderHook(() => useReplicate(), { wrapper });

    expect(result.current.getModel).toBeDefined();
    expect(result.current.getModels).toBeDefined();
    expect(result.current.getModelVersions).toBeDefined();
    expect(result.current.getModelSchema).toBeDefined();
    expect(result.current.runPrediction).toBeDefined();
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test as we expect an error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useModelManagement());
    }).toThrow('useModelManagement must be used within a ModelManagementProvider');

    consoleSpy.mockRestore();
  });

  it('successfully fetches model through context', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModelManagementProvider>{children}</ModelManagementProvider>
    );

    const { result } = renderHook(() => useModelManagement(), { wrapper });

    let model;
    await act(async () => {
      model = await result.current.getModel('replicate', 'owner/model');
    });

    expect(model).toEqual(
      expect.objectContaining({
        id: 'owner/model',
        provider: 'replicate',
        name: 'model',
      })
    );
  });

  it('successfully runs prediction through context', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 'prediction1' }),
      })
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModelManagementProvider>{children}</ModelManagementProvider>
    );

    const { result } = renderHook(() => useModelManagement(), { wrapper });

    let prediction;
    await act(async () => {
      prediction = await result.current.runPrediction(
        'replicate',
        'owner/model',
        'version1',
        { prompt: 'test' }
      );
    });

    expect(prediction).toEqual({ id: 'prediction1' });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.replicate.com/v1/predictions',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('owner/model:version1'),
      })
    );
  });

  it('handles errors gracefully', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Not Found',
      })
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModelManagementProvider>{children}</ModelManagementProvider>
    );

    const { result } = renderHook(() => useModelManagement(), { wrapper });

    await expect(
      result.current.getModel('replicate', 'owner/nonexistent')
    ).rejects.toThrow('Replicate API error: Not Found');
  });
});
