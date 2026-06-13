class ChartDetectorService {
  detectChartType(results, question) {
    return 'table';
  }
}

export default new ChartDetectorService();
