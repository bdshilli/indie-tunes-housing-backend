const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://bdshilli:<ZEpqGCmtrtQNz1ZW>@data.hw2cdx0.mongodb.net/?retryWrites=true&w=majority&appName=Data";
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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/albums");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let albums = [
  {
    _id: 1,
    title: "Dog Days",
    image: "benji.jpg",
    genre: "Lofi",
    advisory: "SFW",
    artist: "Benji",
    song_list: ["Wolf Bork", "Bork Bork", "Wolf Wolf Bork"],
  },
  {
    _id: 2,
    title: "Cat Nights",
    image: "pip.jpg",
    genre: "ASMR",
    advisory: "SFW",
    artist: "Pip",
    song_list: ["Shattering Glass", "Jumping in the Dark", "Constant Meowing"],
  },
  {
    _id: 3,
    title: "Redneck Rap",
    image: "nic.jpg",
    genre: "Rap",
    advisory: "Explicit",
    artist: "Nic",
    song_list: ["Rivian Grind", "City Boy", "Uh Oh my Truck Broke Down"],
  },
  {
    _id: 4,
    title: "Stepdad Vibes",
    image: "bradley2.jpg",
    genre: "Hard Rock",
    advisory: "Explicit",
    artist: "Big Brad",
    song_list: ["Deadbeat Dad", "Jobless", "I'm not your real dad"],
  },
  {
    _id: 5,
    title: "Party Night",
    image: "bradley.jpg",
    genre: "House",
    advisory: "Explicit",
    artist: "Big Brad",
    song_list: ["Loud Noises", "Alcohol Poisoning", "Cops are Here"],
  },
  {
    _id: 6,
    title: "In the Dark",
    image: "eye.jpg",
    genre: "Rock",
    advisory: "Explicit",
    artist: "Billy",
    song_list: ["Run", "Hide", "Distant Stalker"],
  },
  {
    _id: 7,
    title: "Bidet",
    image: "bidet.jpg",
    genre: "Commedy",
    advisory: "SFW",
    artist: "Jack",
    song_list: [
      "Toilet Humor",
      "I Don't Know",
      "Something a Kid Would Laugh At",
    ],
  },
  {
    _id: 8,
    title: "Indecisive",
    image: "nic2.png",
    genre: "Rap",
    advisory: "NSFW",
    artist: "Benji",
    song_list: ["What to Do", "I Can't Choose", "Under Pressure"],
  },
];

app.get("/api/albums", (req, res) => {
  res.send(albums);
});

app.post("/api/albums", upload.single("image"), (req, res) => {
  const result = validateAlbum(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  const album = {
    _id: albums.length + 1,
    title: req.body.title,
    genre: req.body.genre,
    advisory: req.body.advisory,
    artist: req.body.artist,
    song_list: [
      {
        title: "WIP",
        views: "WIP",
        length: "WIP",
        audio: "file name",
      },
    ],
  };

  if (req.file) {
    album.image = req.file.filename;
  }

  albums.push(album);
  res.status(200).send(album);
});

const validateAlbum = (album) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    title: Joi.allow(""),
    genre: Joi.allow(""),
    advisory: Joi.allow(""),
    artist: Joi.allow(""),
  });
  return schema.validate(album);
};

app.listen(3001, () => {
  console.log("listening");
});
