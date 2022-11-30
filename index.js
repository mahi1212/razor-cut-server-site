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
        const testsCollection = database.collection('test');

        console.log('Connected correctly to server');
        
        // get all catagories
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // app.get('/test', async(req, res) => {
        //     const cursor = testsCollection.find({});
        //     const services = await cursor.toArray();
        //     res.send(services)
        // })
        
        // // add catagories
        // app.post('/services', async(req, res) => {
        //     const service = req.body;
        //     const result = await catagoriesCollection.insertOne(service);
        //     res.json(result)
        // })
        
        // // get single service
        // app.get('/services/:id', async(req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const service = await servicesCollection.findOne(query);
        //     res.send(service)
        // })
        
        // // delete service by id
        // app.delete("/services/:id", async (req, res) => {
        //     const id = req.params.id
        //     const query = { _id: ObjectId(id) }
        //     const singleService = await servicesCollection.deleteOne(query)
        //     res.json(singleService)
        // });

        // get all shops
        app.get('/shops', async(req, res) => {
            const cursor = shopsCollection.find({});
            const shops = await cursor.toArray();
            res.send(shops)
        })

        // get single service
        app.get('/shops/:id', async(req, res) => {
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
        app.get('/catagoryShops/:catagory', async(req, res) => {
            const catagory = req.params.catagory;
            console.log(catagory, 'from server')
            const query = { status: catagory };
            const singleShop = await shopsCollection.find(query).toArray();
            res.json(singleShop)
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
