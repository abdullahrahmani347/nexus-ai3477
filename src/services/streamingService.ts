
import { Message } from '../components/MessageBubble';

interface StreamingOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export async function generateStreamingResponse(
  userInput: string,
  conversationHistory: Message[],
  apiKey: string,
  onChunk: (chunk: string) => void,
  options: StreamingOptions = {}
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
    
    // Add system prompt
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
    
    // Add conversation history (last 10 messages)
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

    console.log('Starting streaming request to Gemini API');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}`,
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
      throw new Error(`Request failed: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body reader available');
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
          
          try {
            const jsonStr = line.replace('data: ', '');
            const data = JSON.parse(jsonStr);
            
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
              const newText = data.candidates[0].content.parts[0].text;
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

    return fullResponse || 'I apologize, but I was unable to generate a proper response. Please try again.';

  } catch (error) {
    console.error('Error in streaming response:', error);
    throw error;
  }
}
