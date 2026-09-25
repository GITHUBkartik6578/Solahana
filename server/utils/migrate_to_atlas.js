import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

const cliAtlasUri = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : null;
const LOCAL_URI = process.env.LOCAL_MONGODB_URI || 'mongodb://localhost:27017/solahana';
const ATLAS_URI = cliAtlasUri || process.env.ATLAS_MONGODB_URI || (process.env.MONGODB_URI?.includes('mongodb+srv') ? process.env.MONGODB_URI : null);

async function checkLocalData() {
  console.log('--- CONNECTING TO LOCAL MONGODB ---');
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log('Connected to Local MongoDB:', LOCAL_URI);

  const collections = ['users', 'consultations', 'blogs', 'newsletters', 'savedcalculations'];
  const localCounts = {};

  for (const colName of collections) {
    try {
      const col = localConn.collection(colName);
      const count = await col.countDocuments();
      localCounts[colName] = count;
      console.log(`Local collection '${colName}': ${count} documents`);
    } catch (err) {
      console.log(`Local collection '${colName}': 0 documents`);
      localCounts[colName] = 0;
    }
  }

  await localConn.close();
  return localCounts;
}

async function updateEnvFile(newAtlasUri) {
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('MONGODB_URI=')) {
      envContent = envContent.replace(/MONGODB_URI=.*/, `MONGODB_URI=${newAtlasUri}`);
    } else {
      envContent += `\nMONGODB_URI=${newAtlasUri}\n`;
    }
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log(`\nUpdated backend .env file with Atlas connection string: MONGODB_URI=${newAtlasUri.substring(0, 30)}...`);
  } catch (err) {
    console.error('Could not auto-update .env file:', err.message);
  }
}

async function migrateData() {
  const localCounts = await checkLocalData();

  if (!ATLAS_URI || ATLAS_URI.includes('localhost') || ATLAS_URI.includes('127.0.0.1')) {
    console.log('\n========================================================');
    console.log('LOCAL DATABASE INVENTORY:');
    console.table(localCounts);
    console.log('========================================================');
    console.log('\nTO RUN MIGRATION:');
    console.log('Pass your Atlas connection string as an argument:');
    console.log('node server/utils/migrate_to_atlas.js "mongodb+srv://<username>:<password>@cluster.mongodb.net/solahana?retryWrites=true&w=majority"\n');
    return;
  }

  console.log('\n--- CONNECTING TO MONGODB ATLAS ---');
  console.log(`Atlas Target URI: ${ATLAS_URI.substring(0, 30)}...`);

  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log('Connected to MongoDB Atlas successfully! Preserving ObjectIds and timestamps...');

  const collections = ['users', 'consultations', 'blogs', 'newsletters', 'savedcalculations'];
  const migrationResults = {};

  for (const colName of collections) {
    const localCol = localConn.collection(colName);
    const atlasCol = atlasConn.collection(colName);

    const docs = await localCol.find({}).toArray();
    console.log(`\nMigrating ${docs.length} documents for collection '${colName}'...`);

    if (docs.length > 0) {
      for (const doc of docs) {
        await atlasCol.replaceOne({ _id: doc._id }, doc, { upsert: true });
      }
    }

    const atlasCount = await atlasCol.countDocuments();
    migrationResults[colName] = {
      localCount: docs.length,
      atlasCount: atlasCount,
      status: docs.length === atlasCount ? 'MATCHED ✅' : 'MISMATCH ⚠️'
    };
  }

  await localConn.close();
  await atlasConn.close();

  console.log('\n========================================================');
  console.log('MIGRATION SUMMARY RESULT:');
  console.table(migrationResults);
  console.log('========================================================');

  await updateEnvFile(ATLAS_URI);
}

migrateData().catch((err) => {
  console.error('Migration Error:', err.message);
  process.exit(1);
});
