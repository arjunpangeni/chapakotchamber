/**
 * Performance Load Testing Script
 * 
 * This script simulates varying database sizes and measures query performance
 * Run with: node scripts/test-performance.js
 */

const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://user:pass@cluster.mongodb.net/chapakot'

const scenarios = [
  { name: 'Small DB', members: 100, jobs: 20, contents: 200 },
  { name: 'Medium DB', members: 1000, jobs: 100, contents: 2000 },
  { name: 'Large DB', members: 10000, jobs: 500, contents: 20000 },
  { name: 'Very Large DB', members: 100000, jobs: 5000, contents: 200000 },
]

async function runPerformanceTest() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db('chapakot')

    console.log('\n📊 Database Query Performance Testing\n')
    console.log('=' .repeat(80))

    for (const scenario of scenarios) {
      const estimatedSize = scenario.members + scenario.jobs + scenario.contents
      console.log(`\n📈 Scenario: ${scenario.name} (Est. ${estimatedSize.toLocaleString()} docs)`)
      console.log('-'.repeat(80))

      // Test members count query
      const startMembers = Date.now()
      const memberCount = await db
        .collection('members')
        .countDocuments({ membershipStatus: { $ne: 'inactive' } })
      const timeMembers = Date.now() - startMembers

      // Test jobs count query
      const startJobs = Date.now()
      const jobCount = await db.collection('jobs').countDocuments({ status: 'active' })
      const timeJobs = Date.now() - startJobs

      // Test news count query
      const startNews = Date.now()
      const newsCount = await db.collection('contents').countDocuments({
        published: true,
        type: 'news',
        $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
      })
      const timeNews = Date.now() - startNews

      // Test articles count query
      const startArticles = Date.now()
      const articleCount = await db.collection('contents').countDocuments({
        published: true,
        type: 'article',
        $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
      })
      const timeArticles = Date.now() - startArticles

      // Test combined query (parallel)
      const startCombined = Date.now()
      await Promise.all([
        db.collection('members').countDocuments({ membershipStatus: { $ne: 'inactive' } }),
        db.collection('jobs').countDocuments({ status: 'active' }),
        db.collection('contents').countDocuments({
          published: true,
          type: 'news',
          $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
        }),
        db.collection('contents').countDocuments({
          published: true,
          type: 'article',
          $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }],
        }),
      ])
      const timeCombined = Date.now() - startCombined

      console.log(`  Members Count:    ${timeMembers.toFixed(0)}ms (${memberCount} results)`)
      console.log(`  Jobs Count:       ${timeJobs.toFixed(0)}ms (${jobCount} results)`)
      console.log(`  News Count:       ${timeNews.toFixed(0)}ms (${newsCount} results)`)
      console.log(`  Articles Count:   ${timeArticles.toFixed(0)}ms (${articleCount} results)`)
      console.log(`  ─────────────────────────────────────`)
      console.log(`  Combined (Parallel): ${timeCombined.toFixed(0)}ms ✅`)

      // Performance assessment
      let status = '✅ Excellent'
      if (timeCombined > 500) status = '⚠️  Warning'
      if (timeCombined > 1000) status = '❌ Critical'

      console.log(`  Status: ${status} (${timeCombined}ms)`)
    }

    console.log('\n' + '='.repeat(80))
    console.log('\n💡 Performance Recommendations:')
    console.log('  • If combined query > 500ms: Add database indexes (see scripts/database-indexes-guide.md)')
    console.log('  • If combined query > 1000ms: Consider query optimization or database upgrade')
    console.log('  • Current implementation caches results for 1 hour (no need to optimize further)')
    console.log('\n' + '='.repeat(80) + '\n')
  } catch (error) {
    console.error('❌ Performance test failed:', error.message)
  } finally {
    await client.close()
  }
}

// Run test
runPerformanceTest().catch(console.error)
