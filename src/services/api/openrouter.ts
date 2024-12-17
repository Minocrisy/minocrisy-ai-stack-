import type { OpenRouterAPI, OpenRouterModel } from './types';

class OpenRouterService implements OpenRouterAPI {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_OPENROUTER_API_KEY is required');
    }
    this.apiKey = apiKey;
  }

  private async fetchFromOpenRouter(path: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Yogi AI Platform',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    return response.json();
  }

  async listModels(): Promise<OpenRouterModel[]> {
    const data = await this.fetchFromOpenRouter('/models');
    return data.data;
  }

  async chat(messages: Array<{ role: string; content: string }>, model: string): Promise<string> {
    try {
      const response = await this.fetchFromOpenRouter('/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
        }),
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter chat error:', error);
      throw error;
    }
  }

  async complete(prompt: string, model: string): Promise<string> {
    try {
      const response = await this.fetchFromOpenRouter('/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
        }),
      });

      return response.choices[0].text;
    } catch (error) {
      console.error('OpenRouter completion error:', error);
      throw error;
    }
  }
}

export const openRouterService = new OpenRouterService();
