const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//name: dbuser1
//password: mcqyXHZJZfQ1a8Qt

const uri =
  "mongodb+srv://dbuser1:mcqyXHZJZfQ1a8Qt@cluster0.bathfkv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const useCollection = client.db("nodeMongoCrud").collection("users");

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = useCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await useCollection.findOne(query);
      res.send(user);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);

      const result = await useCollection.insertOne(user);
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateUser = req.body;
      // console.log(updateUser);
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateUser.name,
          address: updateUser.address,
          email: updateUser.email,
        },
      };
      const result = await useCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await useCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("crud is running");
});

app.listen(port, () => {
  console.log(`crud is running on port ${port}`);
});
