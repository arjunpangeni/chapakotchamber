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

async function migrateCommitteePriority() {
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

    // Check if committee-members collection exists
    const collections = await db.listCollections().toArray();
    const committeeExists = collections.some((col) => col.name === 'committee-members');

    if (!committeeExists) {
      console.log('"committee-members" collection does not exist. Skipping migration.');
      return;
    }

    console.log('Updating existing committee members with priority values...');

    // Update all committee members that don't have priority field
    const result = await db.collection('committee-members').updateMany(
      { priority: { $exists: false } },
      { $set: { priority: 50 } }
    );

    console.log(`Updated ${result.modifiedCount} committee members with default priority of 50.`);

    // Optional: Set specific priorities for common roles
    const rolePriorities = {
      'President': 1,
      'Vice President': 2,
      'Secretary': 3,
      'Treasurer': 4,
      'Member': 10
    };

    for (const [role, priority] of Object.entries(rolePriorities)) {
      const updateResult = await db.collection('committee-members').updateMany(
        { role: { $regex: role, $options: 'i' }, priority: 50 },
        { $set: { priority: priority } }
      );
      if (updateResult.modifiedCount > 0) {
        console.log(`Set priority ${priority} for ${updateResult.modifiedCount} ${role}s`);
      }
    }

    console.log('Migration completed successfully.');

  } finally {
    await client.close();
    console.log('Closed connection');
  }
}

migrateCommitteePriority().catch((err) => {
  console.error('Error during migration:', err);
  process.exit(1);
});