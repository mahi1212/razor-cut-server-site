const express = require("express")
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhrco8v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const database = client.db('QuikTrim');
        const shopsCollection = database.collection('shops');
        const usersCollection = database.collection('users');
        const appointmentCollection = database.collection('appointments'); // appointment collection name changed
        console.log('Connected correctly to server');

        // get all shops
        app.get('/shops', async (req, res) => {
            const cursor = shopsCollection.find({});
            const shops = await cursor.toArray();
            res.send(shops)
        })
        // create single shop
        app.post('/shop', async (req, res) => {
            const shop = req.body;
            const result = await shopsCollection.insertOne(shop);
            res.json(result)
        })
        // get single shop by id
        app.get('/shop/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleShop = await shopsCollection.findOne(query);
            res.json(singleShop)
        })
        // update shop by id
        app.put('/shop/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const shop = req.body;
            const result = await shopsCollection.updateOne(query, { $set: shop }, { upsert: true });
            res.json(result)
        })
        // delete shop by id
        app.delete("/shop/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const singleShop = await shopsCollection.deleteOne(query)
            res.json(singleShop)
        });
        // post review object in shop review array find shop by id
        app.post('/shops/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = req.body;
            const result = await shopsCollection.updateOne(query, { $push: { review: review } });
            res.json(result)
        })
        // get all appointment
        app.get('/appointments', async (req, res) => {
            const cursor = appointmentCollection.find({});
            const appointments = await cursor.toArray();
            res.send(appointments)
        })
        // post appoinment
        app.post('/appointment', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentCollection.insertOne(appointment)
            res.json(result)
        })
        // get all appointment by id for berber
        app.get('/appointment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { shop_id: id };
            const appointments = await appointmentCollection.find(query).toArray();
            res.send(appointments);
        })
        // update status of appointment by id
        app.put('/appointment/status/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const status = req.body.appointment_status;
            const result = await appointmentCollection.updateOne(query, { $set: { appointment_status: status } });
            res.json(result)
        })
        // for customer to get his/her appointment history by id
        app.get('/history/:id', async (req, res) => {
            const id = req.params.id;
            const query = { user_id: id };
            const appointments = await appointmentCollection.find(query).toArray();
            res.send(appointments);
        })

        // get multiple shops by catagory
        app.get('/catagoryShops/:catagory', async (req, res) => {
            const catagory = req.params.catagory;
            const query = { status: catagory };
            const singleShop = await shopsCollection.find(query).toArray();
            res.json(singleShop)
        })
        // get all users 
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })
        // save user info
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })
        // get user by id
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            res.send(user)
        })
        // update user info by id
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = req.body;
            const result = await usersCollection.updateOne(query, { $set: user }, { upsert: true });
            res.json(result)
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Razor cut app listening at http://localhost:${port}`)
})
