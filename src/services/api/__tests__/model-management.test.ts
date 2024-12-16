import { ModelManagementService } from '../model-management';
import type { Model, ModelVersion } from '../types';

describe('ModelManagementService', () => {
  let service: ModelManagementService;

  beforeEach(() => {
    service = new ModelManagementService();
    // Mock environment variable
    process.env.VITE_REPLICATE_API_TOKEN = 'test-token';
  });

  describe('Replicate Provider', () => {
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

    beforeEach(() => {
      // Mock fetch for Replicate API calls
      global.fetch = jest.fn().mockImplementation((url: string) => {
        if (url.includes('/models/owner/model')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              owner: 'owner',
              name: 'model',
              description: 'Test model',
            }),
          });
        }
        if (url.includes('/versions')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              results: [mockVersion],
            }),
          });
        }
        return Promise.reject(new Error('Not found'));
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('gets a model by id', async () => {
      const result = await service.getModel('replicate', 'owner/model');
      expect(result).toEqual(expect.objectContaining({
        id: 'owner/model',
        provider: 'replicate',
        name: 'model',
      }));
    });

    it('gets model versions', async () => {
      const versions = await service.getModelVersions('replicate', 'owner/model');
      expect(versions).toEqual([mockVersion]);
    });

    it('runs a prediction', async () => {
      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'prediction1' }),
        })
      );

      const result = await service.runPrediction(
        'replicate',
        'owner/model',
        'version1',
        { prompt: 'test' }
      );

      expect(result).toEqual({ id: 'prediction1' });
      expect(fetch).toHaveBeenCalledWith(
        'https://api.replicate.com/v1/predictions',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('owner/model:version1'),
        })
      );
    });

    it('handles API errors gracefully', async () => {
      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: false,
          statusText: 'Not Found',
        })
      );

      await expect(
        service.getModel('replicate', 'owner/nonexistent')
      ).rejects.toThrow('Replicate API error: Not Found');
    });

    it('validates provider exists', () => {
      expect(() => {
        service._getProviderForTesting('nonexistent');
      }).toThrow("Model provider 'nonexistent' not found");
    });
  });

  describe('Provider Management', () => {
    it('allows registering new providers', () => {
      const mockProvider = {
        name: 'custom',
        getModel: jest.fn(),
        getModels: jest.fn(),
        getModelVersions: jest.fn(),
        runPrediction: jest.fn(),
      };

      service.registerProvider(mockProvider);
      expect(() => service._getProviderForTesting('custom')).not.toThrow();
    });

    it('maintains separate providers', async () => {
      const mockProvider1 = {
        name: 'custom1',
        getModel: jest.fn().mockResolvedValue({ id: 'model1' }),
        getModels: jest.fn(),
        getModelVersions: jest.fn(),
        runPrediction: jest.fn(),
      };

      const mockProvider2 = {
        name: 'custom2',
        getModel: jest.fn().mockResolvedValue({ id: 'model2' }),
        getModels: jest.fn(),
        getModelVersions: jest.fn(),
        runPrediction: jest.fn(),
      };

      service.registerProvider(mockProvider1);
      service.registerProvider(mockProvider2);

      const model1 = await service.getModel('custom1', 'test');
      const model2 = await service.getModel('custom2', 'test');

      expect(model1.id).toBe('model1');
      expect(model2.id).toBe('model2');
    });
  });
});
