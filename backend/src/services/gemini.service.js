import aiConfig from '../config/gemini.js';

class GroqService {
  async generateContent(prompt) {
    if (!aiConfig.apiKey) {
      throw new Error('Groq API key is missing. Set GROQ_API_KEY in the backend .env file.');
    }

    const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: aiConfig.model,
        temperature: 0,
        max_completion_tokens: 1024,
        top_p: 1,
        messages: [
          {
            role: 'system',
            content: 'You are a backend analytics assistant. Return concise, production-usable output.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ||
        data?.error ||
        data?.message ||
        `Groq API request failed with status ${response.status}.`;
      throw new Error(errorMessage);
    }

    const text = data?.choices?.[0]?.message?.content?.trim();

    if (!text) {
      throw new Error('Groq API returned an empty response.');
    }

    return { success: true, data: text };
  }
}

export default new GroqService();
