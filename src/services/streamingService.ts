
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

    console.log('Starting streaming request to Gemini API with model:', model);

    // Try streaming first
    try {
      const streamResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (streamResponse.ok) {
        const reader = streamResponse.body?.getReader();
        if (reader) {
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

          if (fullResponse) {
            return fullResponse;
          }
        }
      }
    } catch (streamError) {
      console.log('Streaming failed, falling back to regular API:', streamError);
    }

    // Fallback to regular API
    console.log('Using fallback to regular Gemini API');
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

    const data = await response.json();
    console.log('Received response from Gemini API');

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated. Please try rephrasing your message.');
    }

    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error('Empty response received. Please try again.');
    }

    const fullResponse = candidate.content.parts[0].text || 'I apologize, but I was unable to generate a proper response. Please try again.';
    
    // Simulate streaming for the fallback
    const words = fullResponse.split(' ');
    let currentChunk = '';
    
    for (let i = 0; i < words.length; i++) {
      currentChunk += (i > 0 ? ' ' : '') + words[i];
      onChunk(currentChunk);
      
      // Add a small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 30));
    }

    return fullResponse;

  } catch (error) {
    console.error('Error in streaming response:', error);
    throw error;
  }
}
