
export const modelCategories = {
  'General Chat & Reasoning': {
    description: 'Best for general conversation, reasoning, and problem-solving',
    models: [
      {
        id: 'meta-llama/Llama-3-70b-chat-hf',
        name: 'Llama 3 70B Chat',
        description: 'Excellent for general conversations, reasoning, and complex problem-solving with high accuracy.'
      },
      {
        id: 'meta-llama/Llama-3-8b-chat-hf',
        name: 'Llama 3 8B Chat',
        description: 'Fast and efficient for everyday conversations and quick responses.'
      },
      {
        id: 'deepseek-ai/deepseek-r1-0528',
        name: 'DeepSeek R1',
        description: 'Advanced reasoning model optimized for complex logical thinking, mathematical problems, and analytical tasks.'
      }
    ]
  },
  'Code & Development': {
    description: 'Specialized for programming, debugging, and technical tasks',
    models: [
      {
        id: 'deepseek-ai/deepseek-v3-0324',
        name: 'DeepSeek V3',
        description: 'State-of-the-art coding model for software development, code review, debugging, and technical documentation.'
      },
      {
        id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        name: 'Mixtral 8x7B',
        description: 'Excellent for code generation, debugging, and technical explanations with multilingual support.'
      }
    ]
  },
  'Creative Writing': {
    description: 'Optimized for creative content, storytelling, and artistic tasks',
    models: [
      {
        id: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
        name: 'Nous Hermes 2 Mixtral',
        description: 'Creative and eloquent model perfect for storytelling, creative writing, and artistic content.'
      }
    ]
  },
  'Math & Science': {
    description: 'Specialized for mathematical calculations and scientific analysis',
    models: [
      {
        id: 'openchat/openchat-3.5-1210',
        name: 'OpenChat 3.5',
        description: 'Strong mathematical capabilities for calculations, equations, and scientific problem-solving.'
      }
    ]
  }
};

export class TogetherService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async streamChat(
    messages: Array<{ role: string; content: string }>,
    model: string,
    options: {
      onToken: (token: string) => void;
      onComplete: (response: string) => void;
      onError: (error: string) => void;
    },
    signal?: AbortSignal
  ) {
    try {
      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          max_tokens: 4096,
          temperature: 0.7,
        }),
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let fullResponse = '';

      while (true) {
        const { done, value } = awaitReader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              options.onComplete(fullResponse);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
                options.onToken(content);
              }
            } catch (e) {
              // Skip invalid JSON chunks
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        options.onComplete(fullResponse);
      } else {
        options.onError(error instanceof Error ? error.message : 'Unknown error');
      }
    }
  }
}
