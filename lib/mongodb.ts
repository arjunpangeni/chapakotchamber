import { Db, MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

const uri = process.env.MONGODB_URI

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 20000,
  connectTimeoutMS: 20000,
}

type MongoCache = {
  client: MongoClient | null
  promise: Promise<MongoClient> | null
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoCache: MongoCache | undefined
}

const cache = global._mongoCache || { client: null, promise: null }
global._mongoCache = cache

export async function connectToDatabase() {
  if (cache.client) {
    return { client: cache.client, db: cache.client.db('chapakot-chamber') }
  }

  if (!cache.promise) {
    const client = new MongoClient(uri, options)
    cache.promise = client.connect()
  }

  cache.client = await cache.promise
  return { client: cache.client, db: cache.client.db('chapakot-chamber') }
}

export async function closeDatabase() {
  if (!cache.client) return

  await cache.client.close()
  cache.client = null
  cache.promise = null
}

export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase()
  return db
}
