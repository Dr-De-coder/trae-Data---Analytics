import geminiService from './gemini.service.js';
import { getSchemaPrompt } from '../prompts/schemaPrompt.js';
import { getSQLPrompt } from '../prompts/sqlPrompt.js';

function extractSql(responseText) {
  const normalizedResponse = responseText
    .replace(/```sql/gi, '')
    .replace(/```/g, '')
    .trim();

  const firstStatement = normalizedResponse.split(';')[0].trim();
  return firstStatement;
}

class SQLGeneratorService {
  async generateSQL(question) {
    const schemaPrompt = await getSchemaPrompt();
    const sqlPrompt = getSQLPrompt(question, schemaPrompt);
    const response = await geminiService.generateContent(sqlPrompt);
    return extractSql(response.data);
  }
}

export default new SQLGeneratorService();
