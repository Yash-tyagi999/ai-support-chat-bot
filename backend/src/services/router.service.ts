import { DBService } from './db.service';
import { LLMService } from './llm.service';
import { Logger } from '../utils/logger';

export interface InboundMessage {
  channel: 'web' | 'whatsapp' | 'instagram';
  sessionId: string | null;
  text: string;
}

export interface RouterResponse {
  reply: string;
  sessionId: string;
}

export class MessageRouter {
  static async routeMessage(inbound: InboundMessage): Promise<RouterResponse> {
    const { channel, sessionId, text } = inbound;
    Logger.info(`Incoming message on [${channel}]: "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}"`);

    let conversationId = sessionId;
    let conversationExists = false;

    if (conversationId) {
      const conv = await DBService.getConversation(conversationId);
      if (conv) {
        conversationExists = true;
      }
    }

    if (!conversationId || !conversationExists) {
      const newConv = await DBService.createConversation(`${channel.toUpperCase()} Support Chat Session`);
      conversationId = newConv.id;
      Logger.info(`New session created: ${conversationId}`);
    }

    await DBService.saveMessage(conversationId, 'user', text);

    const conversation = await DBService.getConversation(conversationId);
    const messages = (conversation?.messages || []).map((msg) => ({
      sender: msg.sender as 'user' | 'ai',
      text: msg.text,
    }));

    // Exclude current message from history context
    const historyContext = messages.slice(0, -1);
    const userPrompt = messages[messages.length - 1]?.text || text;

    const reply = await LLMService.generateReply(historyContext, userPrompt);

    await DBService.saveMessage(conversationId, 'ai', reply);
    Logger.info(`Routed reply successfully for ${conversationId}`);

    return {
      reply,
      sessionId: conversationId,
    };
  }
}
