
import { Message } from '../components/MessageBubble';

interface TogetherResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface StreamingOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

// Rate limiting for 50 RPM
class RateLimiter {
  private requests: number[] = [];
  private maxRequests = 50;
  private windowMs = 60000; // 1 minute

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    return this.requests.length < this.maxRequests;
  }

  addRequest(): void {
    this.requests.push(Date.now());
  }

  getWaitTime(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    return Math.max(0, this.windowMs - (Date.now() - oldestRequest));
  }
}

const rateLimiter = new RateLimiter();

export const modelCategories = {
  'Code & Development': {
    models: [
      { id: 'meta-llama/CodeLlama-34b-Instruct-hf', name: 'CodeLlama 34B', description: 'Specialized for code generation, debugging, and programming assistance' },
      { id: 'WizardLM/WizardCoder-Python-34B-V1.0', name: 'WizardCoder Python 34B', description: 'Expert in Python programming and development' },
      { id: 'codellama/CodeLlama-13b-Instruct-hf', name: 'CodeLlama 13B', description: 'Efficient code assistance and programming support' }
    ]
  },
  'General Chat & Reasoning': {
    models: [
      { id: 'meta-llama/Llama-3-70b-chat-hf', name: 'Llama 3 70B Chat', description: 'Advanced conversational AI with superior reasoning capabilities' },
      { id: 'meta-llama/Llama-3-8b-chat-hf', name: 'Llama 3 8B Chat', description: 'Fast and efficient general purpose conversational AI' },
      { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', description: 'Multilingual model with excellent reasoning and knowledge' }
    ]
  },
  'Creative Writing': {
    models: [
      { id: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO', name: 'Nous Hermes 2 Mixtral', description: 'Creative storytelling, content generation, and artistic writing' },
      { id: 'mistralai/Mistral-7B-Instruct-v0.2', name: 'Mistral 7B', description: 'Balanced creativity and coherence for writing tasks' },
      { id: 'togethercomputer/RedPajama-INCITE-7B-Chat', name: 'RedPajama 7B', description: 'Open-source creative writing assistant' }
    ]
  },
  'Math & Science': {
    models: [
      { id: 'microsoft/WizardMath-70B-V1.0', name: 'WizardMath 70B', description: 'Mathematical problem solving and scientific computation expert' },
      { id: 'meta-llama/Llama-3-70b-chat-hf', name: 'Llama 3 70B Science', description: 'Strong analytical and scientific reasoning capabilities' }
    ]
  }
};

export async function generateTogetherResponse(
  userInput: string,
  conversationHistory: Message[],
  apiKey: string,
  onChunk: (chunk: string) => void,
  options: StreamingOptions = {}
): Promise<string> {
  const {
    model = 'meta-llama/Llama-3-8b-chat-hf',
    maxTokens = 2048,
    temperature = 0.7,
    systemPrompt = 'You are a helpful AI assistant. Be concise, accurate, and friendly in your responses.'
  } = options;

  console.log('generateTogetherResponse called with:', {
    model,
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'No API key',
    userInput: userInput.substring(0, 50) + '...'
  });

  // Validate API key
  if (!apiKey || !apiKey.trim()) {
    throw new Error('API key is required but not provided');
  }

  if (!apiKey.startsWith('tgp_v1_')) {
    throw new Error('Invalid Together.ai API key format');
  }

  // Check rate limit
  if (!rateLimiter.canMakeRequest()) {
    const waitTime = rateLimiter.getWaitTime();
    throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds before making another request.`);
  }

  try {
    // Build conversation messages
    const messages = [];
    
    // Add system prompt
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }
    
    // Add conversation history (last 10 messages to avoid token limits)
    const recentHistory = conversationHistory.slice(-10);
    for (const message of recentHistory) {
      messages.push({
        role: message.sender === 'user' ? 'user' : 'assistant',
        content: message.text
      });
    }
    
    // Add current user input
    messages.push({
      role: 'user',
      content: userInput
    });

    const requestBody = {
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream: true
    };

    console.log('Making request to Together.ai:', {
      model,
      messagesCount: messages.length,
      maxTokens,
      temperature
    });

    rateLimiter.addRequest();

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Together.ai response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Together.ai API error:', response.status, errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Together.ai API key configuration.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
      } else if (response.status >= 500) {
        throw new Error('Together.ai service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(`Request failed with status ${response.status}: ${errorData}`);
      }
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response stream');
    }

    const decoder = new TextDecoder();
    let fullResponse = '';
    let currentText = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() === '' || !line.startsWith('data: ')) continue;
          
          if (line.includes('[DONE]')) continue;
          
          try {
            const jsonStr = line.replace('data: ', '');
            const data = JSON.parse(jsonStr);
            
            if (data.choices && data.choices[0]?.delta?.content) {
              const newText = data.choices[0].delta.content;
              currentText += newText;
              fullResponse = currentText;
              onChunk(currentText);
            }
          } catch (e) {
            // Skip malformed JSON lines
            continue;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (!fullResponse) {
      throw new Error('No response generated. Please try rephrasing your message.');
    }

    console.log('Together.ai response completed, length:', fullResponse.length);
    return fullResponse;

  } catch (error) {
    console.error('Error in Together.ai streaming response:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred while generating the response.');
    }
  }
}
