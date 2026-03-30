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
    const collectionNames = collections.map((col) => col.name);

    console.log('\n📊 Creating Performance Indexes...\n');

    // Contents collection indexes
    if (collectionNames.includes('contents')) {
      console.log('📍 Creating indexes on "contents" collection...');
      
      // Index 1: For published + type + sorting by createdAt
      await db.collection('contents').createIndex(
        { published: 1, type: 1, createdAt: -1 },
        { name: 'idx_published_type_created' }
      );
      console.log('  ✅ Index 1: published + type + createdAt');

      // Index 2: For type + published queries
      await db.collection('contents').createIndex(
        { type: 1, published: 1 },
        { name: 'idx_type_published' }
      );
      console.log('  ✅ Index 2: type + published');

      // Index 3: For pinned items sorting
      await db.collection('contents').createIndex(
        { published: 1, isPinned: -1, createdAt: -1 },
        { name: 'idx_published_pinned_created' }
      );
      console.log('  ✅ Index 3: published + isPinned + createdAt');

      // Index 4: Text search index
      await db.collection('contents').createIndex({
        title: 'text',
        content: 'text',
      });
      console.log('  ✅ Index 4: Text search (title + content)');
    } else {
      console.log('⚠️  "contents" collection does not exist. Skipping.');
    }

    // Members collection indexes
    if (collectionNames.includes('members')) {
      console.log('\n📍 Creating indexes on "members" collection...');
      
      await db.collection('members').createIndex(
        { membershipStatus: 1 },
        { name: 'idx_membership_status' }
      );
      console.log('  ✅ Index 1: membershipStatus');
    } else {
      console.log('\n⚠️  "members" collection does not exist. Skipping.');
    }

    // Jobs collection indexes
    if (collectionNames.includes('jobs')) {
      console.log('\n📍 Creating indexes on "jobs" collection...');
      
      await db.collection('jobs').createIndex(
        { status: 1, createdAt: -1 },
        { name: 'idx_status_created' }
      );
      console.log('  ✅ Index 1: status + createdAt');
    } else {
      console.log('\n⚠️  "jobs" collection does not exist. Skipping.');
    }

    console.log('\n✅ All indexes created successfully!\n');

  } finally {
    await client.close();
    console.log('Closed connection');
  }
}

createIndexes().catch((err) => {
  console.error('Error creating indexes:', err);
  process.exit(1);
});
