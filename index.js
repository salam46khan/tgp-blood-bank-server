const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wueeg5w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const faqCollection = client.db('tgpBloodBankDB').collection('faq')
    const userCollection = client.db('tgpBloodBankDB').collection('user')
    const bloodGroupCollection = client.db('tgpBloodBankDB').collection('bloodGroup')
    const reviewCollection = client.db('tgpBloodBankDB').collection('review')
    const donorCollection = client.db('tgpBloodBankDB').collection('donor')
    const blogCollection = client.db('tgpBloodBankDB').collection('blog')
    const storyCollection = client.db('tgpBloodBankDB').collection('story')
    const requestCollection = client.db('tgpBloodBankDB').collection('request')
    const interesCollection = client.db('tgpBloodBankDB').collection('interes')


    app.get('/faq', async (req, res) => {
      const result = await faqCollection.find().sort({ _id: -1 }).toArray()
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const user = req.body;

      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: 'user exists', insertedId: null })
      }
      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    app.get('/users', async (req, res) => {
      const result = await userCollection.find().sort({ _id: -1 }).toArray()
      res.send(result)
    })

    app.get('/user', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await userCollection.findOne(query)
      res.send(result)
    })
    app.get('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.findOne(query);
      res.send(result)
    })

    app.put('/user/:id', async (req, res) => {
      const id = req.params.id;
      const updatePro = req.body;
      console.log(updatePro);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const update = {
        $set: {
          distic: updatePro.distic,
          upozila: updatePro.upozila,
          bloodGroup: updatePro.bloodGroup,
          phone: updatePro.phone,
          gender: updatePro.gender,
          birthday: updatePro.birthday
        }
      }
      const result = await userCollection.updateOne(filter, update, options)
      res.send(result)
    })

    app.put('/manage-user/:id', async (req, res) => {
      const id = req.params.id;
      const updatePost = req.body;
      console.log(updatePost);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const update = {
        $set: {
          position: updatePost.position
        }
      }
      const result = await userCollection.updateOne(filter, update, options)
      res.send(result)
    })


    app.get('/blood-group', async (req, res) => {
      const result = await bloodGroupCollection.find().toArray()
      res.send(result)
    })

    app.get('/review', async (req, res) => {
      const result = await reviewCollection.find().sort({ _id: -1 }).toArray()
      res.send(result)
    })
    app.post('/review', async (req, res) => {
      const review = req.body;
      // console.log(review);
      const result = await reviewCollection.insertOne(review)
      res.send(result)
    })
    app.delete('/review/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await reviewCollection.deleteOne(query)
      res.send(result)
    })




    app.post('/donor', async (req, res) => {
      const donor = req.body;

      const query = { email: donor.email }
      const existingDonor = await donorCollection.findOne(query)
      if (existingDonor) {
        return res.send({ message: 'donor exists', insertedId: null })
      }
      const result = await donorCollection.insertOne(donor);
      res.send(result)
    })
    app.get('/donor', async (req, res) => {
      const result = await donorCollection.find().sort({ _id: -1 }).toArray()
      res.send(result)
    })

    app.get('/my-donation', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await donorCollection.findOne(query)
      res.send(result)
    })
    app.put('/my-donation/:id', async (req, res) => {
      const id = req.params.id;
      const updateDonar = req.body;
      // console.log(updateDonar);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const update = {
        $set: {
          avatar: updateDonar.avatar,
          avatarId: updateDonar.avatarId,
          distic: updateDonar.distic,
          upozila: updateDonar.upozila,
          bloodGroup: updateDonar.bloodGroup,
          phone: updateDonar.phone,
          birthday: updateDonar.birthday,
          lastDonate: updateDonar.lastDonate,
          avalability: updateDonar.avalability
        }
      }
      const result = await donorCollection.updateOne(filter, update, options)
      res.send(result)
    })

    app.put('/donor-state/:id', async (req, res) => {
      const id = req.params.id;
      const updateState = req.body;
      // console.log(updateState);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const update = {
        $set: {
          status: updateState.status
        }
      }
      const result = await donorCollection.updateOne(filter, update, options)
      res.send(result)
    })


    app.get('/ready-donor', async (req, res) => {
      const query = { avalability: true, status: 'confirm' }
      const result = await donorCollection.find(query).sort({ _id: -1 }).toArray()
      res.send(result)
    })

    app.post('/blog', async (req, res) => {
      const blog = req.body;
      // console.log(blog);
      const result = await blogCollection.insertOne(blog)
      res.send(result)
    })
    app.get('/blog', async (req, res) => {
      const result = await blogCollection.find().sort({ _id: -1 }).toArray()
      res.send(result)
    })
    app.delete('/blog/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await blogCollection.deleteOne(query)
      res.send(result)
    })
    app.get('/blog-details/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await blogCollection.findOne(query)
      res.send(result)
    })


    app.post('/story', async (req, res) => {
      const story = req.body;
      // console.log(story);
      const result = await storyCollection.insertOne(story)
      res.send(result)
    })
    app.get('/story', async (req, res) => {
      const result = await storyCollection.find().sort({ _id: -1 }).toArray()
      res.send(result)
    })
    app.delete('/story/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await storyCollection.deleteOne(query)
      res.send(result)
    })
    app.get('/story/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await storyCollection.findOne(query)
      res.send(result)
    })


    app.post('/request', async (req, res) => {
      const donoteRequest = req.body;
      // console.log(donoteRequest);
      const result = await requestCollection.insertOne(donoteRequest)
      res.send(result)
    })
    app.get('/request', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { reqEmail: req.query.email }
      }
      const result = await requestCollection.find(query).toArray()
      res.send(result)
    })
    app.put('/request-state/:id', async (req, res) => {
      const id = req.params.id;
      const updatePost = req.body;
      console.log(updatePost);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const update = {
        $set: {
          status: updatePost.status
        }
      }
      const result = await requestCollection.updateOne(filter, update, options)
      res.send(result)
    })
    app.get('/all-request', async (req, res) => {
      const result = await requestCollection.find().sort({ _id: -1 }).toArray()
      res.send(result)
    })

    app.get('/valid-request', async (req, res) => {
      const query = {
        $or: [
          { status: 'Pending' },
          { status: 'Inprogress' }
        ]
      }
      const result = await requestCollection.find(query).sort({_id: -1}).toArray()
      res.send(result)
    })
    app.delete('/request/:id', async (req, res)=> {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await requestCollection.deleteOne(query)
      res.send(result)
    })

    app.post('/interested', async (req, res) => {
      const interesInfo = req.body;
      const result = await interesCollection.insertOne(interesInfo)
      res.send(result);
    })
    app.get('/interested', async (req, res) => {
      const result = await interesCollection.find().sort({_id: -1}).toArray()
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('server is running')
})
app.listen(port, () => {
  console.log(`server is runing from ${port}`)
})