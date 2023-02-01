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
        const database = client.db('razor-cut-app');
        const servicesCollection = database.collection('catagories');
        const shopsCollection = database.collection('shops');
        const usersCollection = database.collection('users');
        const appointmentCollection = database.collection('appointment');
        console.log('Connected correctly to server');

        // get all catagories
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // get all shops
        app.get('/shops', async (req, res) => {
            const cursor = shopsCollection.find({});
            const shops = await cursor.toArray();
            res.send(shops)
        })
        // get shop by email
        app.get('/shops/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const shop = await shopsCollection.findOne(query);
            res.send(shop)
        })
        // update shop by email
        app.put('/shops/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const shop = req.body;
            const result = await shopsCollection.updateOne(query, { $set: shop }, { upsert: true } );
            res.json(result)
        })
        // create single shop
        app.post('/shops', async (req, res) => {
            const shop = req.body;
            const result = await shopsCollection.insertOne(shop);
            res.json(result)
        })
        // delete shop by id
        app.delete("/shops/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const singleShop = await shopsCollection.deleteOne(query)
            res.json(singleShop)
        });
        // get single service
        app.get('/shops/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleShop = await shopsCollection.findOne(query);
            res.send(singleShop)
            // console.log(singleShop, 'from server')
        })
        // get shop by catagory
        // app.get('/catagoryShop/:catagory', async(req, res) => {
        //     const catagory = req.params.catagory;
        //     console.log(catagory, 'from server')
        //     const query = { status: catagory };
        //     const singleShop = await shopsCollection.find(query);
        //     res.send(singleShop)
        // })
        // get multiple shops by catagory
        app.get('/catagoryShops/:catagory', async (req, res) => {
            const catagory = req.params.catagory;
            console.log(catagory, 'from server')
            const query = { status: catagory };
            const singleShop = await shopsCollection.find(query).toArray();
            res.json(singleShop)
        })

        // save user - jenny
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
        })
        // get user by email - jenny 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            res.send(user)
        })
        // update user info - juhi
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = req.body;
            const result = await usersCollection.updateOne(query, { $set: user }, { upsert: true });
            res.json(result)
        })

        // post appoinment - juhi
        app.post('/appointment', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentCollection.insertOne(appointment)
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
