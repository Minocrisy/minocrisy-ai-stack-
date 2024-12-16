import { HedraAPI } from './types';

class HedraService implements HedraAPI {
  private apiKey: string;
  private baseUrl = 'https://api.hedra.dev/v1';

  constructor() {
    const apiKey = import.meta.env.VITE_HEDRA_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_HEDRA_API_KEY is required');
    }
    this.apiKey = apiKey;
  }

  async process(input: {
    text: string;
    type: 'analyze' | 'enhance' | 'summarize';
  }): Promise<{
    result: string;
    metadata?: Record<string, any>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${input.type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          text: input.text,
          options: {
            language: 'en',
            format: 'json',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Hedra API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        result: data.result,
        metadata: data.metadata,
      };
    } catch (error) {
      console.error('Hedra processing error:', error);
      throw error;
    }
  }
}

export const hedraService = new HedraService();
