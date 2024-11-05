const express = require('express');
const PORT = 5000;
const CORS = require('cors');
const fs = require('fs');
const path = require('path');

const { MongoClient, ServerApiVersion, Collection } = require('mongodb');

require('dotenv').config();

const uri = process.env.MongoURL;
const DBName = process.env.DBName;
const CollectionName = process.env.CollectionName;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

client.connect();
client.db("admin").command({ ping: 1 });
console.log("Pinged your deployment. You successfully connected to MongoDB!");

const app = express();

app.use(express.json());

app.use(CORS());

app.get('/', (req, res) => {
    res.send('Pinged Succesfully');
});

// Route to get all songs data
app.get('/api/songs', async (req, res) => {
    try {
        const database = client.db(DBName);
        const collection = database.collection(CollectionName);

        // Find the documents matching the query and convert them to an array
        const result = await collection.find({}).toArray();

        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data');
    }
});


// async function send(DBName, CollectionName, data) {
//     var result;
//     const database = client.db(DBName);
//     const collection = database.collection(CollectionName);
//     result = await collection.insertOne(data);
//     if (result) {
//         console.log(`Message sent with _id: ${result.insertedId}`);
//     } else {
//         console.log("Message not sent.");
//     }
//     return result;
// }

//Route to add new playlist to the db
// app.post('/api/sendSongs', async (req, res) => {

//     fs.readFile(path.join(__dirname, 'cards.json'), 'utf8', async (err, data) => {
//         if (err) {
//             res.status(500).json({ message: 'Error reading data' });
//         } else {
//             console.log('Data sent');
//             try {
//                 const result = await send(process.env.DBName, process.env.CollectionName, JSON.parse(data));
//                 res.status(200).send({ status: "ok" });
//             } catch (error) {
//                 res.send(error);
//             }
//         }
//     });
// });

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
        client.close();
    }
    console.log(`Server is running on port ${PORT}`);
});