import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DBService {
  static async getConversation(conversationId: string) {
    return prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });
  }

  static async createConversation(metadata?: string) {
    return prisma.conversation.create({
      data: {
        metadata,
      },
    });
  }

  static async saveMessage(conversationId: string, sender: 'user' | 'ai', text: string) {
    return prisma.message.create({
      data: {
        conversationId,
        sender,
        text,
      },
    });
  }

  static async getAllFAQs() {
    return prisma.fAQ.findMany();
  }
}
