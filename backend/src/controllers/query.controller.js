import asyncHandler from '../middlewares/asyncHandler.js';
import { formatResponse } from '../utils/responseFormatter.js';
import sqlGenerator from '../services/sqlGenerator.service.js';
import sqlValidator from '../services/sqlValidator.service.js';
import queryExecutor from '../services/queryExecutor.service.js';
import chartDetector from '../services/chartDetector.service.js';
import insightGenerator from '../services/insightGenerator.service.js';

const handleQuery = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'A question string is required.'
    });
  }

  const sql = await sqlGenerator.generateSQL(question);
  const validation = await sqlValidator.validateSQL(sql);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Generated SQL failed validation.',
      sql,
      validation
    });
  }

  const results = await queryExecutor.executeQuery(sql);
  const chartType = chartDetector.detectChartType(results, question);
  const insights = await insightGenerator.generateInsights(results, question);

  res.json(formatResponse({
    question,
    sql,
    validation,
    results,
    chartType,
    insights
  }));
});

export { handleQuery };
