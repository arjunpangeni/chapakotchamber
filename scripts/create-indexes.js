const { MongoClient } = require('mongodb');
const dns = require('dns').promises;
const fs = require('fs');

function loadEnv() {
  const path = './.env.local';
  if (!fs.existsSync(path)) {
    throw new Error('.env.local not found in project root');
  }
  const content = fs.readFileSync(path, 'utf8');
  return content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .reduce((acc, line) => {
      const [key, ...rest] = line.split('=');
      acc[key] = rest.join('=').trim().replace(/^"|"$/g, '');
      return acc;
    }, {});
}

async function createIndexes() {
  const env = loadEnv();
  const uri = env.MONGODB_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI not defined (check .env.local or env var)');
  }

  console.log('Using URI: %s', uri.replace(/(mongodb\+srv:\/\/[^:]+:)[^@]+(@.*)/, '$1***$2'));

  const client = new MongoClient(uri);

  try {
    console.log('Connecting...');
    await client.connect();
    console.log('Connected.');

    const db = client.db('chapakot-chamber');
    const collections = await db.listCollections().toArray();
    const contentsExists = collections.some((col) => col.name === 'contents');

    if (contentsExists) {
        console.log('Creating text index on "contents" collection...');
        await db.collection('contents').createIndex({ title: 'text', content: 'text' });
        console.log('Text index created successfully.');
    } else {
        console.log('"contents" collection does not exist. Skipping index creation.');
    }

  } finally {
    await client.close();
    console.log('Closed connection');
  }
}

createIndexes().catch((err) => {
  console.error('Error creating indexes:', err);
  process.exit(1);
});
