const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// --- !! IMPORTANT !! ---
// REPLACE <YOUR_ACTUAL_PASSWORD> WITH YOUR MONGODB ATLAS PASSWORD
const uri = "mongodb+srv://shruthi:abcde12345@cluster0.jvd471z.mongodb.net/?appName=Cluster0";
// ---

const client = new MongoClient(uri);
const dbName = "hospitalDB"; // You can name your database
const collectionName = "patients";

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Middleware to parse JSON bodies

let db, patientsCollection;

// Function to connect to the database
async function connectToDb() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB Atlas");
        db = client.db(dbName);
        patientsCollection = db.collection(collectionName);
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1); // Exit if we can't connect
    }
}

// --- API Endpoints ---

// 1. ADD PATIENT (Create)
app.post('/api/patients', async (req, res) => {
    try {
        const newPatient = req.body;
        if (!newPatient.patient_id) {
            return res.status(400).json({ message: "Patient ID is required" });
        }
        // Check if patient_id already exists
        const existingPatient = await patientsCollection.findOne({ patient_id: newPatient.patient_id });
        if (existingPatient) {
            return res.status(400).json({ message: "Patient ID already exists" });
        }

        const result = await patientsCollection.insertOne(newPatient);
        res.status(201).json(result);
    } catch (err) {
        console.error("Error adding patient:", err);
        res.status(500).json({ message: "Error adding patient" });
    }
});

// 2. SEARCH PATIENTS (Read)
// Search by patient_id or name (first or last)
app.get('/api/patients/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const searchRegex = { $regex: query, $options: 'i' }; // Case-insensitive regex

        const searchPatients = await patientsCollection.find({
            $or: [
                { patient_id: searchRegex },
                { first_name: searchRegex },
                { last_name: searchRegex }
            ]
        }).limit(50).toArray(); // Limit to 50 results

        res.status(200).json(searchPatients);
    } catch (err) {
        console.error("Error searching patients:", err);
        res.status(500).json({ message: "Error searching patients" });
    }
});

// 3. UPDATE PATIENT (Update)
// We use patient_id as the unique identifier
app.put('/api/patients/:patient_id', async (req, res) => {
    try {
        const { patient_id } = req.params;
        const updatedData = req.body;
        
        // The _id is MongoDB's internal field, we don't want to update it.
        // We also don't want to update the patient_id itself.
        delete updatedData._id; 
        delete updatedData.patient_id;

        const result = await patientsCollection.updateOne(
            { patient_id: patient_id },
            { $set: updatedData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({ message: "Patient updated successfully" });
    } catch (err) {
        console.error("Error updating patient:", err);
        res.status(500).json({ message: "Error updating patient" });
    }
});

// 4. DELETE PATIENT (Delete)
app.delete('/api/patients/:patient_id', async (req, res) => {
    try {
        const { patient_id } = req.params;
        const result = await patientsCollection.deleteOne({ patient_id: patient_id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.status(200).json({ message: "Patient deleted successfully" });
    } catch (err) {
        console.error("Error deleting patient:", err);
        res.status(500).json({ message: "Error deleting patient" });
    }
});


// --- Serve Frontend ---
// This serves your `index.html` file as the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
connectToDb().then(() => {
    app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    });
});