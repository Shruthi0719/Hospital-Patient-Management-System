// replacePatients.js
// Usage: node replacePatients.js
// It will: export existing collection to backup JSON, delete all docs, insert new docs from CSV.

// -------------- CONFIG --------------
const MONGODB_URI = "mongodb+srv://shruthi:abcde12345@cluster0.jvd471z.mongodb.net/?appName=Cluster0"; // replace if needed
const DB_NAME = "hospitalDB";
const COLLECTION_NAME = "patients";
const CSV_PATH = "./patients_hyderabad.csv"; // ensure this file exists
const BACKUP_PATH = "./patients_backup.json";
// ------------------------------------

const fs = require("fs");
const { MongoClient } = require("mongodb");
const csv = require("csv-parser");

async function readCsvToArray(csvPath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", (err) => reject(err));
  });
}

async function run() {
  const client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log("Connected to MongoDB.");

    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION_NAME);

    // 1) Backup existing collection to JSON
    console.log("Backing up existing collection to", BACKUP_PATH);
    const allDocs = await col.find({}).toArray();
    fs.writeFileSync(BACKUP_PATH, JSON.stringify(allDocs, null, 2), "utf8");
    console.log(`Backed up ${allDocs.length} documents.`);

    // 2) DELETE all documents (but keep collection/indices)
    console.log("Deleting all documents from collection...");
    const delRes = await col.deleteMany({});
    console.log(`Deleted ${delRes.deletedCount} documents.`);

    // 3) Read new dataset CSV and insert
    console.log("Reading new CSV:", CSV_PATH);
    const newPatients = await readCsvToArray(CSV_PATH);

    // Optional: convert fields, e.g., ensure patient_id is string, normalize types
    // and ensure unique index on patient_id
    // (You may want to transform dates into ISO format — leaving as strings is fine.)
    // Ensure no empty rows
    const filtered = newPatients.filter(r => Object.values(r).some(v => v && v.toString().trim() !== ""));
    if (filtered.length === 0) {
      console.log("No rows found in CSV. Aborting insert.");
      return;
    }

    console.log(`Inserting ${filtered.length} new documents...`);
    const insertRes = await col.insertMany(filtered);
    console.log(`Inserted ${insertRes.insertedCount} documents.`);

    // 4) (Optional) Create unique index on patient_id
    console.log("Creating unique index on patient_id (if not exists)...");
    try {
      await col.createIndex({ patient_id: 1 }, { unique: true });
      console.log("Unique index on patient_id ensured.");
    } catch (e) {
      console.warn("Could not create unique index (maybe duplicates exist):", e.message);
    }

    console.log("Replace operation complete. Backup at:", BACKUP_PATH);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
    console.log("Disconnected.");
  }
}

run();
