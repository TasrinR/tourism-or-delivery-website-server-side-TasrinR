const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2zkrb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    console.log('Mongo connected');
    const database = client.db('tourDB');
    const ordersCollection = database.collection('orders');
    const ticketsCollection = database.collection('Ticket');
    // GET API
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.get('/tickets', async (req, res) => {
      const cursor = ticketsCollection.find({});
      const tickets = await cursor.toArray();
      res.send(tickets);
    });

    app.get('/tickets/:id', async (req, res) => {
      const { id } = req.params;
      const ticket = await ticketsCollection.findOne({ _id: ObjectId(id) })
      console.log(ticket);
      res.send(ticket);
    });

    

    // POST API
    app.post('/orders', async (req, res) => {
      const newOrder = req.body;
      const result = await ordersCollection.insertOne(newOrder);
      console.log('got new order', req.body);
      console.log('added order', result);
      // res.json(result);
      res.json(req.body)
    });

    app.post('/tickets', async (req, res) => {
      const newTicket = req.body;
      const result = await ticketsCollection.insertOne(newTicket);
      console.log('got new ticket', req.body);
      console.log('added service', result);
      res.json(req.body);
    });

    // DELETE API
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);

      console.log('deleting order with id ', result);

      res.json(result);
    })
  }
  finally {
    // await client.close()
  }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})