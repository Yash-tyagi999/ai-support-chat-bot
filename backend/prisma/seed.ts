import { PrismaClient } from "@prisma/client";
import process from "process";

const prisma = new PrismaClient();

const faqs = [
  {
    question: "What are your support hours?",
    answer:
      "Our customer support team is active from Monday to Friday, 9:00 AM to 6:00 PM EST. We typically reply within 1-2 hours during business hours.",
  },
  {
    question: "What is your shipping policy?",
    answer:
      "We offer free standard shipping on all orders over $50 within the USA. Standard shipping takes 3-5 business days. Expedited shipping is available at checkout for an additional fee. We also ship worldwide, which takes 7-14 business days depending on location.",
  },
  {
    question: "What is your return/refund policy?",
    answer:
      "We offer a 30-day return policy for unused items in their original packaging. Once we receive your item, we will process your refund back to your original payment method within 5-7 business days. Return shipping is free for US domestic orders.",
  },
  {
    question: "Do you ship to USA?",
    answer:
      "Yes, we ship to all 50 states in the USA, including Alaska, Hawaii, and military APO/FPO addresses. Standard shipping is free for orders over $50.",
  },
  {
    question: "Where is my order tracking number?",
    answer:
      "Once your order is shipped, you will receive an email containing a tracking link and shipment number. This is typically sent within 24 hours of placing your order.",
  },
];

async function main() {
  console.log("Seeding FAQs...");
  for (const faq of faqs) {
    await prisma.fAQ.upsert({
      where: { question: faq.question },
      update: { answer: faq.answer },
      create: faq,
    });
  }
  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
