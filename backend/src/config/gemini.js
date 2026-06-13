import 'dotenv/config';

const aiConfig = {
  apiKey: process.env.GROQ_API_KEY,
  model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  baseUrl: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'
};

export default aiConfig;
