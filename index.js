const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6kqiq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('traveler')
        const packagesCollection = database.collection('packages');
        const bookingCollection = database.collection('booking')


        // GET all package 
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        // GET single package 

        app.get('/packageDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const package = await packagesCollection.findOne(query)
            res.json(package);
        })

        // add booking api 
        app.post('/booking', async (req, res) => {
            const booked = req.body;
            const result = await bookingCollection.insertOne(booked)
            res.json(result)
        })

        // POST addpackage

        app.post('/addPackage', async (req, res) => {
            const package = req.body;
            const result = await packagesCollection.insertOne(package);
            res.json(result);

        })
    }
    finally {
        // await client.close(); 
    }
}
run().catch(console.dir)

// default route
app.get('/', (req, res) => {
    res.send('running traveler')
})

// listen port 
app.listen(port, () => {
    console.log('port running', port)
})