const { MongoClient, ServerApiVersion } = require('mongodb')
const dns = require('dns').promises
const fs = require('fs')

function loadEnv() {
  const path = './.env.local'
  if (!fs.existsSync(path)) {
    throw new Error('.env.local not found in project root')
  }
  const content = fs.readFileSync(path, 'utf8')
  return content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .reduce((acc, line) => {
      const [key, ...rest] = line.split('=')
      acc[key] = rest.join('=').trim().replace(/^"|"$/g, '')
      return acc
    }, {})
}

function parseSrvHost(uri) {
  if (!uri.startsWith('mongodb+srv://')) return null
  const afterAt = uri.split('@')[1]
  if (!afterAt) return null
  return afterAt.split('/')[0].split('?')[0]
}

async function testConnection() {
  const env = loadEnv()
  const uri = env.MONGODB_URI || process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI not defined (check .env.local or env var)')
  }

  console.log('Using URI: %s', uri.replace(/(mongodb\+srv:\/\/[^:]+:)[^@]+(@.*)/, '$1***$2'))

  // Force public DNS lookup to avoid local / corporate resolver SRV blocking
  const publicDns = ['1.1.1.1', '8.8.8.8', '9.9.9.9']
  dns.setServers(publicDns)
  console.log('Using DNS resolvers:', dns.getServers())

  const srvHost = parseSrvHost(uri)
  if (srvHost) {
    console.log('Resolving SRV record for', srvHost)
    try {
      const records = await dns.resolveSrv(`_mongodb._tcp.${srvHost}`)
      console.log('SRV records:', records)
    } catch (err) {
      console.error('SRV resolve failed:', err.message || err)
    }
  } else {
    console.log('Not an SRV URI; skipping SRV check')
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 20000,
    connectTimeoutMS: 20000,
  })

  try {
    console.log('Connecting...')
    await client.connect()
    console.log('Connected. Pinging admin...')
    const ping = await client.db('admin').command({ ping: 1 })
    console.log('Ping result:', ping)
    console.log('✅ Connected successfully to MongoDB!')
  } finally {
    await client.close()
    console.log('Closed connection')
  }
}

testConnection().catch((err) => {
  console.error('🛑 MongoDB test failed:', err)
  process.exit(1)
})
