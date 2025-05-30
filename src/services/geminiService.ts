
import { Message } from '../components/MessageBubble';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function generateResponse(
  userInput: string,
  conversationHistory: Message[],
  apiKey: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  } = {}
): Promise<string> {
  const {
    model = 'gemini-2.0-flash',
    maxTokens = 2048,
    temperature = 0.7,
    systemPrompt = 'You are a helpful AI assistant. Be concise, accurate, and friendly in your responses.'
  } = options;

  try {
    // Build conversation context
    const contents = [];
    
    // Add system prompt as the first message
    if (systemPrompt) {
      contents.push({
        role: 'user',
        parts: [{ text: systemPrompt }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: 'I understand. I\'ll be helpful, concise, and friendly in my responses.' }]
      });
    }
    
    // Add conversation history (last 10 messages to maintain context)
    const recentHistory = conversationHistory.slice(-10);
    for (const message of recentHistory) {
      contents.push({
        role: message.sender === 'user' ? 'user' : 'model',
        parts: [{ text: message.text }]
      });
    }
    
    // Add current user input
    contents.push({
      role: 'user',
      parts: [{ text: userInput }]
    });

    const requestBody = {
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        topP: 0.8,
        topK: 40,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    };

    console.log('Sending request to Gemini API:', {
      model,
      messageCount: contents.length,
      userInput: userInput.substring(0, 100) + (userInput.length > 100 ? '...' : '')
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Gemini API key in settings.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (response.status >= 500) {
        throw new Error('Gemini service is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(`Request failed: ${response.status}`);
      }
    }

    const data: GeminiResponse = await response.json();
    console.log('Received response from Gemini API');

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated. Please try rephrasing your message.');
    }

    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error('Empty response received. Please try again.');
    }

    return candidate.content.parts[0].text || 'I apologize, but I was unable to generate a proper response. Please try again.';

  } catch (error) {
    console.error('Error generating response:', error);
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
}

export async function generateStreamingResponse(
  userInput: string,
  conversationHistory: Message[],
  apiKey: string,
  onChunk: (chunk: string) => void,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  } = {}
): Promise<string> {
  // For now, simulate streaming by calling the regular API and chunking the response
  const response = await generateResponse(userInput, conversationHistory, apiKey, options);
  
  // Simulate streaming by sending chunks
  const words = response.split(' ');
  let currentChunk = '';
  
  for (let i = 0; i < words.length; i++) {
    currentChunk += (i > 0 ? ' ' : '') + words[i];
    onChunk(currentChunk);
    
    // Add a small delay to simulate streaming
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  return response;
}
