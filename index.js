const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());



const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.knxp44y.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandCollection = client.db("brandDB").collection("brand")


    app.get("/products", async(req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get("/products/:id", async(req, res) => {
      const id = req.params.id;
      const query ={_id : new ObjectId(id)}; 
      const result = await brandCollection.findOne(query);
      res.send(result);
    })
    app.post("/products", async(req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await brandCollection.insertOne(newProduct);
        res.send(result);

    })
    app.put("/products/:id",async(req, res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const options = {upsert : true};
      const updatedProduct = req.body;
      const product = {
        $set : {
          image :updatedProduct.image, 
          name :updatedProduct.name, 
          brand :updatedProduct.brand, 
          type :updatedProduct.type, 
          price :updatedProduct.price, 
          rating :updatedProduct.rating
        }
      }
      const result = await brandCollection.updateOne(filter, product, options);
      res.send(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Brand shop Server is running");
});
app.listen(port, () => {
  console.log(`Brand shop server is running on port : ${port}`);
});
