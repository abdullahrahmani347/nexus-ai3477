
interface StreamingResponse {
  content: string;
  done: boolean;
  error?: string;
}

interface StreamingCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: string) => void;
}

export class StreamingService {
  private static readonly TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
  
  static async streamChat(
    messages: Array<{ role: string; content: string }>,
    apiKey: string,
    model: string = 'meta-llama/Llama-3-8b-chat-hf',
    callbacks: StreamingCallbacks,
    signal?: AbortSignal
  ): Promise<void> {
    if (!apiKey) {
      callbacks.onError('API key is required');
      return;
    }

    try {
      const response = await fetch(this.TOGETHER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          max_tokens: 2048,
          temperature: 0.7,
        }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let fullResponse = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                callbacks.onComplete(fullResponse);
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const token = parsed.choices?.[0]?.delta?.content;
                
                if (token) {
                  fullResponse += token;
                  callbacks.onToken(token);
                }
              } catch (parseError) {
                console.warn('Failed to parse streaming chunk:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      callbacks.onComplete(fullResponse);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          callbacks.onError('Request was cancelled');
        } else {
          callbacks.onError(error.message);
        }
      } else {
        callbacks.onError('An unknown error occurred');
      }
    }
  }

  static async generateTitle(messages: Array<{ role: string; content: string }>, apiKey: string): Promise<string> {
    if (!apiKey || messages.length === 0) return 'New Chat';

    const firstUserMessage = messages.find(m => m.role === 'user')?.content;
    if (!firstUserMessage) return 'New Chat';

    try {
      const response = await fetch(this.TOGETHER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3-8b-chat-hf',
          messages: [
            {
              role: 'system',
              content: 'Generate a short, descriptive title (max 6 words) for this conversation. Only return the title, nothing else.'
            },
            {
              role: 'user',
              content: firstUserMessage.slice(0, 200)
            }
          ],
          max_tokens: 20,
          temperature: 0.3,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const title = data.choices?.[0]?.message?.content?.trim();
        return title && title.length <= 50 ? title : firstUserMessage.slice(0, 30) + '...';
      }
    } catch (error) {
      console.warn('Failed to generate title:', error);
    }

    return firstUserMessage.slice(0, 30) + '...';
  }
}
