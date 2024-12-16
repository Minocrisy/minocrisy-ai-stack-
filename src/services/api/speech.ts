import type {
  SpeechRecognition,
  SpeechRecognitionConstructor,
  SpeechRecognitionEvent,
} from '../../types/speech';

export interface SpeechRecognitionOptions {
  provider: 'browser' | 'whisper';
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  model?: {
    whisper?: {
      model: string;
      language?: string;
    };
  };
}

export interface SpeechAPI {
  startRecognition: (options: SpeechRecognitionOptions & {
    onResult: (text: string, isFinal: boolean) => void;
    onEnd: () => void;
  }) => Promise<void>;
  stopRecognition: () => void;
  getAvailableProviders: () => Promise<Array<{
    id: string;
    name: string;
    description: string;
    models?: Array<{
      id: string;
      name: string;
      description: string;
    }>;
  }>>;
}

class SpeechService implements SpeechAPI {
  private recognition: SpeechRecognitionConstructor | null = null;
  private whisperToken: string;
  private isListening: boolean = false;

  constructor() {
    this.whisperToken = import.meta.env.VITE_OPENAI_API_KEY;

    // Initialize browser speech recognition if available
    if ('webkitSpeechRecognition' in window) {
      this.recognition = window.webkitSpeechRecognition;
    }
  }

  async startRecognition(options: SpeechRecognitionOptions & {
    onResult: (text: string, isFinal: boolean) => void;
    onEnd: () => void;
  }): Promise<void> {
    if (this.isListening) {
      this.stopRecognition();
    }

    switch (options.provider) {
      case 'browser':
        return this.startBrowserRecognition(options);
      case 'whisper':
        return this.startWhisperRecognition(options);
      default:
        throw new Error(`Unsupported speech recognition provider: ${options.provider}`);
    }
  }

  private async startBrowserRecognition(options: SpeechRecognitionOptions & {
    onResult: (text: string, isFinal: boolean) => void;
    onEnd: () => void;
  }): Promise<void> {
    if (!this.recognition) {
      throw new Error('Browser speech recognition is not supported');
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const recognition = new this.recognition();
      recognition.continuous = options.continuous ?? false;
      recognition.interimResults = options.interimResults ?? false;
      recognition.lang = options.language ?? 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const last = event.results.length - 1;
        const text = event.results[last][0].transcript;
        const isFinal = event.results[last].isFinal;
        options.onResult(text, isFinal);
      };

      recognition.onend = () => {
        this.isListening = false;
        options.onEnd();
      };

      recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Error starting browser speech recognition:', error);
      throw error;
    }
  }

  private async startWhisperRecognition(options: SpeechRecognitionOptions & {
    onResult: (text: string, isFinal: boolean) => void;
    onEnd: () => void;
  }): Promise<void> {
    if (!this.whisperToken) {
      throw new Error('VITE_OPENAI_API_KEY is required for Whisper');
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('model', options.model?.whisper?.model ?? 'whisper-1');
        if (options.model?.whisper?.language) {
          formData.append('language', options.model.whisper.language);
        }

        try {
          const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.whisperToken}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Whisper API error: ${response.statusText}`);
          }

          const data = await response.json();
          options.onResult(data.text, true);
        } catch (error) {
          console.error('Error transcribing with Whisper:', error);
          throw error;
        } finally {
          options.onEnd();
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      this.isListening = true;

      // Stop recording after a set duration or based on options
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, options.continuous ? 30000 : 10000); // 30 seconds for continuous, 10 for single
    } catch (error) {
      console.error('Error starting Whisper speech recognition:', error);
      throw error;
    }
  }

  stopRecognition(): void {
    if (this.recognition && this.isListening) {
      // Since recognition is stored as constructor, we need to create an instance
      const recognition = new this.recognition();
      recognition.stop();
    }
    this.isListening = false;
  }

  async getAvailableProviders() {
    const providers = [];

    // Browser speech recognition
    if ('webkitSpeechRecognition' in window) {
      providers.push({
        id: 'browser',
        name: 'Browser Speech Recognition',
        description: 'Native browser-based speech recognition',
      });
    }

    // Whisper
    if (this.whisperToken) {
      providers.push({
        id: 'whisper',
        name: 'OpenAI Whisper',
        description: 'High-accuracy speech recognition using Whisper',
        models: [
          {
            id: 'whisper-1',
            name: 'Whisper v1',
            description: 'Latest Whisper model',
          },
        ],
      });
    }

    return providers;
  }
}

export const speechService = new SpeechService();
