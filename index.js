const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// cwpP9DGjvSobfBno

const uri =
  "mongodb+srv://eco-track-db:cwpP9DGjvSobfBno@cluster0.su41mbr.mongodb.net/?appName=Cluster0";
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
    const db = client.db("eco-track-db");
    const modelCollection = db.collection("challenges");
    const tipsCollection = db.collection("tips");
    const eventsCollection = db.collection("events");
    // get method
    // find
    // find one
    // only 4 challenges(home)
    app.get("/challenges/home", async (req, res) => {
      const result = await modelCollection.find().limit(4).toArray();

      res.send(result);
    });
    // challenges all data
    app.get("/challenges", async (req, res) => {
      const result = await modelCollection.find().toArray();

      res.send(result);
    });

    // findOne view details
    app.get("/challenges/:id", async (req, res) => {
      const id = req.params.id;
      const challenge = await modelCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!challenge) return res.status(404).send({ message: "Not found" });
      res.send(challenge);
    });

    // post
    // insertone
    // insertmany
    app.post("/challenges", async (req, res) => {
      const data = req.body;
      console.log(data);

      const result = await modelCollection.insertOne(data);

      res.send({ success: true, result });
    });

    // PUT;
    // updateOne;
    // Updatemany;

    app.put("/challenges/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;

      const ObjectId = new ObjectId(id);
      const filter = { _id: ObjectId };

      const updateDoc = {
        $set: data,
      };

      const result = await modelCollection.updateOne(filter, updateDoc);

      res.send({
        success: true,
        result,
      });
    });

    // delete
    // deleteOne
    const { ObjectId } = require("mongodb");

    app.delete("/challenges/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };

        const result = await modelCollection.deleteOne(filter);

        if (result.deletedCount === 0) {
          return res
            .status(404)
            .send({ success: false, message: "Challenge not found" });
        }

        res.send({ success: true, message: "Challenge deleted successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server error" });
      }
    });

    // my-activities
    app.get("/my-activities", async (req, res) => {
      const email = req.query.email;
      const result = await modelCollection.find({ createdBy: email }).toArray();

      res.send(result);
    });
    // count
    app.patch("/challenges/:id", async (req, res) => {
      const id = req.params.id;

      const result = await modelCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { participants: 1 } },
      );

      res.send(result);
    });

    // GET all tips

    //all Recent Tips: section

    app.get("/tips", async (req, res) => {
      const result = await tipsCollection.find().toArray();

      res.send(result);
    });

    // all Upcoming Events: section:
    app.get("/events", async (req, res) => {
      const result = await eventsCollection.find().toArray();

      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
