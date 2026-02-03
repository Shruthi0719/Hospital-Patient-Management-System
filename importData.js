const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const csv = require('csv-parser');

const uri = "mongodb+srv://shruthi:abcde12345@cluster0.jvd471z.mongodb.net/?appName=Cluster0";
// ---

const client = new MongoClient(uri);
const dbName = "hospitalDB";
const collectionName = "patients";
const csvFilePath = path.join(__dirname, 'patients.csv');

async function importCSVData() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas...");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        await collection.deleteMany({});
        console.log("Cleared existing data from 'patients' collection.");

        const patients = [];
        
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                patients.push(row);
            })
            .on('end', async () => {
                console.log('CSV file successfully processed.');

                if (patients.length > 0) {
                    const result = await collection.insertMany(patients);
                    console.log(`${result.insertedCount} patients were imported successfully!`);

            
                    await collection.createIndex({ patient_id: 1 }, { unique: true });
                    console.log("Created unique index on 'patient_id'.");

                } else {
                    console.log("No patients found in CSV file.");
                }

                await client.close();
            });

    } catch (err) {
        console.error("Error during data import:", err);
        await client.close();
    }
}

importCSVData();