/**
 * Performance Metrics API Route
 * Returns database query performance statistics
 * 
 * Access: GET /api/admin/performance
 * Auth: Admin only
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAllMetrics, getPerformanceSummary } from '@/lib/performance-monitor'

export async function GET(_req: NextRequest) {
  try {
    // TODO: Add authentication check for admin only
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const metrics = getAllMetrics()
    const summary = getPerformanceSummary()

    // Analyze trends
    const analysis = {
      totalQueries: metrics.length,
      criticalQueries: metrics.filter(m => m.maxTime > 1000),
      slowQueries: metrics.filter(m => m.avgTime > 500),
      overallHealth: metrics.every(m => m.avgTime < 500) ? 'Healthy' : 'Needs Optimization',
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      metrics: metrics.map(m => ({
        queryName: m.queryName,
        avgTime: parseFloat(m.avgTime.toFixed(2)),
        minTime: parseFloat(m.minTime.toFixed(2)),
        maxTime: parseFloat(m.maxTime.toFixed(2)),
        totalExecutions: m.totalExecutions,
        threshold: m.threshold,
        lastExecutedAt: m.lastExecutedAt,
      })),
      analysis,
      summary,
    })
  } catch (error) {
    console.error('Performance metrics error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve performance metrics' },
      { status: 500 }
    )
  }
}
