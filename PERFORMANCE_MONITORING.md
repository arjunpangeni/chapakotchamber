# Database Query Performance Monitoring Guide

## Overview

This document explains how to monitor and maintain database query performance as your Chapakot Chamber of Commerce statistics data grows.

## Current Setup

### Performance Monitoring System

**File:** `lib/performance-monitor.ts`

Automatically tracks database query execution times with:
- Average, minimum, and maximum execution times
- Total number of executions
- Performance threshold alerts
- Historical data (last 100 executions per query)

### Integrated Queries

**File:** `lib/server-data.ts` - `getHomePageContent()` function

Monitors these statistics queries:
1. **Members Count** - Active/non-inactive members
2. **Jobs Count** - Active job postings
3. **News Count** - Published, non-expired news items
4. **Articles Count** - Published, non-expired articles

### How Monitoring Works

```typescript
// Queries are monitored automatically
// If execution exceeds threshold, you'll see warnings in console:
// ⚠️  PERFORMANCE ALERT: getHomePageContent took 520.50ms (threshold: 500ms)

// Performance data is logged in development mode:
// 🔍 Stats Query Performance: 243ms
// 📊 Database Query Performance Report: [detailed metrics]
```

## Performance Thresholds

Current thresholds (configurable in `server-data.ts`):

```typescript
const PERFORMANCE_THRESHOLDS = {
  statistics: 500,  // Alert if > 500ms
  contents: 300,    // Alert if > 300ms
  members: 300,     // Alert if > 300ms
}
```

## Expected Performance

### Without Database Indexes

| Database Size | Query Time |
|---|---|
| 100 records | 50-100ms |
| 1K records | 100-200ms |
| 10K records | 200-500ms |
| 100K records | **500-2000ms** ⚠️ |

### With Database Indexes (Recommended)

| Database Size | Query Time |
|---|---|
| 100 records | 10-20ms |
| 1K records | 15-30ms |
| 10K records | 20-50ms |
| 100K records | **50-150ms** ✅ |

## Setting Up Database Indexes

### Option 1: MongoDB Atlas (Recommended)

1. Go to MongoDB Atlas Dashboard
2. Select your cluster
3. Go to **Collections** tab
4. Select **chapakot.contents**
5. Click **Indexes** tab
6. Add the following indexes:

```javascript
// Index 1
{
  "published": 1,
  "type": 1,
  "createdAt": -1
}

// Index 2
{
  "type": 1,
  "published": 1
}

// Index 3
{
  "published": 1,
  "isPinned": -1,
  "createdAt": -1
}
```

7. For **chapakot.members** collection:
```javascript
{
  "membershipStatus": 1
}
```

8. For **chapakot.jobs** collection:
```javascript
{
  "active": 1
}
```

### Option 2: MongoDB Command Line

Run in MongoDB shell:
```bash
# Connect to MongoDB
mongosh "your-mongodb-connection-string"

# Use the database
use chapakot

# Create indexes
db.contents.createIndex({ published: 1, type: 1, createdAt: -1 })
db.contents.createIndex({ type: 1, published: 1 })
db.contents.createIndex({ published: 1, isPinned: -1, createdAt: -1 })
db.members.createIndex({ membershipStatus: 1 })
db.jobs.createIndex({ active: 1 })
```

## Monitoring Performance

### Real-Time Monitoring in Development

When you run `npm run dev`, you'll see performance logs:

```
🔍 Stats Query Performance: 243ms
📊 Database Query Performance Report:
────────────────────────────────────────────────────────────────────────────────
✅ getHomePageContent
   Avg: 245.50ms | Min: 180.25ms | Max: 520.75ms | Total: 15 executions
────────────────────────────────────────────────────────────────────────────────
```

### Performance API Endpoint

Access performance metrics via API:

```bash
curl http://localhost:3000/api/admin/performance
```

Response:
```json
{
  "timestamp": "2024-03-29T10:30:00Z",
  "metrics": [
    {
      "queryName": "getHomePageContent",
      "avgTime": 245.50,
      "minTime": 180.25,
      "maxTime": 520.75,
      "totalExecutions": 15,
      "threshold": 500,
      "lastExecutedAt": "2024-03-29T10:29:55Z"
    }
  ],
  "analysis": {
    "totalQueries": 1,
    "criticalQueries": 0,
    "slowQueries": 0,
    "overallHealth": "Healthy"
  }
}
```

### Load Testing Script

Test performance with simulated database sizes:

```bash
# Run performance test (requires MongoDB connection)
node scripts/test-performance.js
```

Output example:
```
📊 Database Query Performance Testing

================================================================================

📈 Scenario: Medium DB (Est. 3,100 docs)
────────────────────────────────────────────────────────────────────────────────
  Members Count:    45ms (234 results)
  Jobs Count:       12ms (45 results)
  News Count:       38ms (156 results)
  Articles Count:   35ms (189 results)
  ─────────────────────────────────────
  Combined (Parallel): 58ms ✅
  Status: ✅ Excellent (58ms)
```

## Caching Strategy

The statistics are cached for **1 hour** to minimize database queries:

```typescript
export const revalidate = 7200 // 2 hours - home page cache revalidation
// Statistics queries run at most once every hour
```

### Cache Benefits at Scale

| DB Size | Without Cache | With 1-Hour Cache |
|---|---|---|
| 10K docs | 45,000 queries/day | 24 queries/day |
| 100K docs | 450,000+ queries/day | 24 queries/day |
| **Reduction** | - | **99.99%** ✅ |

## Optimization Checklist

- [ ] **Index Creation**: Run database index commands before going live
- [ ] **Performance Testing**: Run `node scripts/test-performance.js`
- [ ] **Threshold Adjustment**: Adjust thresholds based on your infrastructure
- [ ] **Monitoring Setup**: Set up alerts for threshold violations
- [ ] **Load Testing**: Test with realistic data volumes
- [ ] **Documentation**: Reference this guide for team members

## Troubleshooting

### Issue: Queries taking > 500ms

**Solution:**
1. Check if database indexes are created (see "Setting Up Database Indexes")
2. Run `node scripts/test-performance.js` to diagnose
3. Check MongoDB server logs for slow query logs
4. Increase `PERFORMANCE_THRESHOLDS` if using older hardware

### Issue: Memory usage increasing over time

**Solution:**
1. Performance monitor keeps last 100 executions per query (prevents memory bloat)
2. In production, consider clearing metrics periodically
3. Ensure Node.js has sufficient memory: `NODE_OPTIONS=--max-old-space-size=2048`

### Issue: Inconsistent query times

**Solution:**
1. This is normal - MongoDB caching + system load causes variation
2. Monitor average time, not individual executions
3. Peak times may show higher times (expected behavior)

## Production Recommendations

### For Small Deployments (< 1000 member records)

- ✅ Current setup is sufficient
- ✅ No special optimization needed
- ✅ Monitor performance monthly

### For Medium Deployments (1K - 10K records)

- ✅ Create recommended database indexes (critical)
- ✅ Set up performance API endpoint for monitoring
- ✅ Monitor quarterly
- ✅ Update thresholds if needed

### For Large Deployments (> 10K records)

- ✅ Create all recommended indexes (critical)
- ✅ Consider query optimization
- ✅ Set up automated alerts for threshold violations
- ✅ Monitor weekly or use APM tools
- ✅ Consider database replication for high availability

## Future Optimization Ideas

1. **Incremental Counting**: Cache individual statistics separately
2. **Background Jobs**: Recalculate stats in background every 30 minutes
3. **Database Replication**: Use read replicas for statistics queries
4. **Materialized Views**: Pre-calculate and store statistics in collection
5. **Search Indices**: Migrate to Elasticsearch for full-text search stats

## Support & Monitoring

For ongoing monitoring:
- Check `/api/admin/performance` endpoint regularly
- Review console logs in development mode
- Run performance tests before major database migrations
- Update indexes if query patterns change

---

**Last Updated:** March 29, 2026  
**Version:** 1.0  
**Status:** Working as intended ✅
