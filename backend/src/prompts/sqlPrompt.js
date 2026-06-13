function getSQLPrompt(question, schema) {
  return [
    'Generate one SQLite query for the question below.',
    'Use only tables and columns from the schema.',
    'Return SQL only.',
    'Do not include markdown fences, explanations, or comments.',
    'The query must be read-only.',
    '',
    `Question: ${question}`,
    `Schema: ${schema}`
  ].join('\n');
}

export { getSQLPrompt };
