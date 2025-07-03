
import { Message } from '../components/MessageBubble';
import { generateTogetherResponse } from './togetherService';

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
  return generateTogetherResponse(userInput, conversationHistory, apiKey, onChunk, options);
}
