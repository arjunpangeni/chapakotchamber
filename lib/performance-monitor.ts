/**
 * Performance Monitoring Utility
 * Tracks database query execution times and detects performance regressions
 */

const performanceMetrics: Map<string, PerformanceMetric> = new Map()

interface PerformanceMetric {
  queryName: string
  executionTimes: number[]
  totalExecutions: number
  avgTime: number
  maxTime: number
  minTime: number
  lastExecutedAt: Date
  threshold?: number // Alert threshold in ms
}

/**
 * Record a query execution time
 */
export function recordQueryExecution(queryName: string, executionTime: number, threshold?: number) {
  if (!performanceMetrics.has(queryName)) {
    performanceMetrics.set(queryName, {
      queryName,
      executionTimes: [],
      totalExecutions: 0,
      avgTime: 0,
      maxTime: 0,
      minTime: Infinity,
      lastExecutedAt: new Date(),
      threshold,
    })
  }

  const metric = performanceMetrics.get(queryName)!
  metric.executionTimes.push(executionTime)
  metric.totalExecutions++
  metric.lastExecutedAt = new Date()

  // Keep only last 100 executions to avoid memory bloat
  if (metric.executionTimes.length > 100) {
    metric.executionTimes.shift()
  }

  // Recalculate statistics
  metric.avgTime = metric.executionTimes.reduce((a, b) => a + b, 0) / metric.executionTimes.length
  metric.maxTime = Math.max(...metric.executionTimes)
  metric.minTime = Math.min(...metric.executionTimes)

  // Log warning if threshold exceeded
  if (threshold && executionTime > threshold) {
    console.warn(`⚠️  PERFORMANCE ALERT: ${queryName} took ${executionTime.toFixed(2)}ms (threshold: ${threshold}ms)`)
  }

  return metric
}

/**
 * Get performance metrics for a query
 */
export function getQueryMetrics(queryName: string): PerformanceMetric | undefined {
  return performanceMetrics.get(queryName)
}

/**
 * Get all performance metrics
 */
export function getAllMetrics(): PerformanceMetric[] {
  return Array.from(performanceMetrics.values())
}

/**
 * Get performance summary for logging
 */
export function getPerformanceSummary(): string {
  const metrics = getAllMetrics()
  if (metrics.length === 0) return 'No performance data collected yet'

  let summary = '\n📊 Database Query Performance Report:\n'
  summary += '─'.repeat(80) + '\n'

  metrics.forEach((metric) => {
    const status = metric.maxTime > (metric.threshold || 1000) ? '⚠️ ' : '✅'
    summary += `${status} ${metric.queryName}\n`
    summary += `   Avg: ${metric.avgTime.toFixed(2)}ms | `
    summary += `Min: ${metric.minTime.toFixed(2)}ms | `
    summary += `Max: ${metric.maxTime.toFixed(2)}ms | `
    summary += `Total: ${metric.totalExecutions} executions\n`
  })

  summary += '─'.repeat(80)
  return summary
}

/**
 * Clear all metrics
 */
export function clearMetrics() {
  performanceMetrics.clear()
}

/**
 * Performance timer helper
 */
export async function measureQueryTime<T>(
  queryName: string,
  fn: () => Promise<T>,
  threshold?: number
): Promise<T> {
  const startTime = Date.now()
  const result = await fn()
  const executionTime = Date.now() - startTime
  recordQueryExecution(queryName, executionTime, threshold)
  return result
}
