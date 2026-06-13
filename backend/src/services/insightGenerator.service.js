import geminiService from './gemini.service.js';

class InsightGeneratorService {
  async generateInsights(results, question) {
    void geminiService;
    return { summary: 'Data insights placeholder', keyPoints: [] };
  }
}

export default new InsightGeneratorService();
