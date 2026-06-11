import { FAQ } from '@prisma/client';
import { openai } from '../config/llm.config';
import { DBService } from './db.service';
import OpenAI from 'openai';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export class LLMService {
  static async generateReply(history: ChatMessage[], userMessage: string): Promise<string> {
    let faqs: FAQ[] = [];
    try {
      faqs = await DBService.getAllFAQs();
    } catch (err) {
      console.error('Failed to retrieve FAQs from DB:', err);
    }

    const faqContext = faqs
      .map((faq, idx) => `${idx + 1}. Q: ${faq.question}\n   A: ${faq.answer}`)
      .join('\n\n');

    const systemPrompt = `You are a highly professional, patient, and friendly AI customer support agent for our online e-commerce store.
Your goal is to assist customers with their queries with maximum courtesy and care.

=== STORE DOMAIN KNOWLEDGE (FAQs) ===
${faqContext || 'No store FAQs available.'}
======================================

GUIDELINES:
1. Always maintain a polite, helpful, and welcoming tone.
2. Under no circumstances should you show frustration, annoyance, sarcasm, or break character, even if the customer asks the same question multiple times or tries to provoke you.
3. Prioritize using the FAQ answers provided above. Adhere strictly to these details (e.g., shipping costs, support hours, return windows).
4. If the user asks about something not covered in the FAQs, use general knowledge politely but advise them that they can reach our human support team at support@example.com during business hours (Mon-Fri 9AM-6PM EST).
5. Do not invent policies (like custom refund terms) that contradict the FAQs.
6. Keep your replies concise (under 4 sentences) and polite.
7. If the user asks for a human agent or is highly frustrated, reassure them and let them know a human agent will be notified, citing our support hours.`;

    const slicedHistory = history.slice(-10);

    try {
      if (openai) {
        return await this.callOpenAI(systemPrompt, slicedHistory, userMessage);
      } else {
        return this.callMockResponder(faqs, slicedHistory, userMessage);
      }
    } catch (error: any) {
      console.error('LLM API Error:', error);
      return `I apologize, but I am currently experiencing connection difficulties. Please try again in a moment, or reach our support team at support@example.com.`;
    }
  }

  private static async callOpenAI(
    systemPrompt: string,
    history: ChatMessage[],
    userMessage: string
  ): Promise<string> {
    if (!openai) throw new Error('OpenAI client not initialized');

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      })),
      { role: 'user', content: userMessage },
    ];

    const response = await Promise.race([
      openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages,
        max_tokens: 250,
        temperature: 0.3,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('OpenAI API request timed out')), 8000)
      ),
    ]);

    return response.choices[0]?.message?.content?.trim() || 'I could not generate a reply.';
  }

  private static callMockResponder(
    faqs: FAQ[],
    history: ChatMessage[],
    userMessage: string
  ): string {
    const text = userMessage.toLowerCase();
    
    for (const faq of faqs) {
      const keywords = faq.question.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
      const matches = keywords.some((kw: string) => text.includes(kw));
      if (matches) {
        return `Based on our FAQs: ${faq.answer}`;
      }
    }

    return `Hello! Thanks for contacting our store support. How can I help you today? You can ask about shipping, returns, support hours, or order tracking.`;
  }
}
