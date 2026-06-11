import { Request, Response } from 'express';
import { DBService } from '../services/db.service';
import { MessageRouter } from '../services/router.service';
import { Logger } from '../utils/logger';

export class ChatController {
  static async handleMessage(req: Request, res: Response) {
    try {
      const { message, sessionId } = req.body;

      // Pass input payload to the multi-channel message router
      const result = await MessageRouter.routeMessage({
        channel: 'web',
        sessionId,
        text: message,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      Logger.error('Error in handleMessage controller:', error);
      return res.status(500).json({
        error: 'An internal server error occurred while processing your message.',
      });
    }
  }

  static async getHistory(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required.' });
      }

      const conversation = await DBService.getConversation(sessionId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation session not found.' });
      }

      return res.status(200).json({
        sessionId: conversation.id,
        createdAt: conversation.createdAt,
        messages: conversation.messages.map((m) => ({
          id: m.id,
          sender: m.sender,
          text: m.text,
          timestamp: m.timestamp,
        })),
      });
    } catch (error: any) {
      Logger.error('Error in getHistory controller:', error);
      return res.status(500).json({
        error: 'An internal server error occurred while retrieving history.',
      });
    }
  }
}
