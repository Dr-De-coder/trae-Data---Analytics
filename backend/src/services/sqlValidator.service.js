class SQLValidatorService {
  async validateSQL(sql) {
    const normalizedSql = sql.trim();
    const upperSql = normalizedSql.toUpperCase();
    const blockedKeywords = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'TRUNCATE', 'ATTACH', 'DETACH', 'PRAGMA'];
    const containsBlockedKeyword = blockedKeywords.find((keyword) => upperSql.includes(keyword));

    if (!normalizedSql) {
      return {
        isValid: false,
        warnings: [],
        suggestions: ['Generate a non-empty SQL query.']
      };
    }

    if (!(upperSql.startsWith('SELECT') || upperSql.startsWith('WITH'))) {
      return {
        isValid: false,
        warnings: [],
        suggestions: ['Only read-only SELECT queries are allowed.']
      };
    }

    if (containsBlockedKeyword) {
      return {
        isValid: false,
        warnings: [`Blocked keyword detected: ${containsBlockedKeyword}`],
        suggestions: ['Remove write or admin SQL operations from the query.']
      };
    }

    return {
      isValid: true,
      warnings: [],
      suggestions: []
    };
  }
}

export default new SQLValidatorService();
