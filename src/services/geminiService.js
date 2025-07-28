import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyBcw7qNx7MMmhZr5js4xPFj8f73q85xlc8');

export class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Simulates fetching real-time info from LuxDev sources
   * In production, integrate scraping or Twitter/X API here
   */
  async fetchLiveLuxDevData() {
    try {
      // Fetch from LuxDev's live website or socials
      const dynamicContext = `
        LuxDev HQ is an edtech platform offering programs like Data Science,Data Analytics, Data Engineering, ML and AI.
        Recently launched a bootcamp in Nairobi (July 2025).
        Blog: https://luxdevhq.ai/blog
        FAQs: https://luxdevhq.ai/faqs
        Contact: info@luxdevhq.ai
        More updates coming soon!
      `;
      return dynamicContext;
    } catch (error) {
      console.error('Error fetching real-time LuxDev data:', error);
      return '';
    }
  }

  /**
   * Generates a Gemini response based on user query and context
   */
  async generateResponse(userQuestion) {
    try {
      const context = await this.fetchLiveLuxDevData();

      const prompt = `
You are an AI assistant helping users with real-time information about LuxDev HQ.

Context (real-time web data):
${context}

User Question:
${userQuestion}

Respond concisely and factually using the data above. Avoid hallucinating if unsure.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating Gemini response:', error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact our support team.";
    }
  }
}

export const geminiService = new GeminiService();
