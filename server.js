const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

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
    song_list: [
      {
        title: "Wolf Bork",
        views: "1000",
        length: "1:20",
        audio: "file name",
      },
      {
        title: "Bork Bork",
        views: "2000",
        length: "4:00",
        audio: "file name",
      },
      {
        title: "Wolf Wolf Bork",
        views: "1000",
        length: "3:30",
        audio: "file name",
      },
    ],
  },
  {
    _id: 2,
    title: "Cat Nights",
    image: "pip.jpg",
    genre: "ASMR",
    advisory: "SFW",
    artist: "Pip",
    song_list: [
      {
        title: "Shattering Glass",
        views: "2000",
        length: "2:15",
        audio: "file name",
      },
      {
        title: "Jumping in the Dark",
        views: "1000",
        length: "3:00",
        audio: "file name",
      },
      {
        title: "Constant Meowing",
        views: "1000",
        length: "3:10",
        audio: "file name",
      },
    ],
  },
  {
    _id: 3,
    title: "Redneck Rap",
    image: "nic.jpg",
    genre: "Rap",
    advisory: "Explicit",
    artist: "Nic",
    song_list: [
      {
        title: "Rivian Grind",
        views: "2000",
        length: "4:23",
        audio: "file name",
      },
      {
        title: "City Boy",
        views: "1000",
        length: "2:16",
        audio: "file name",
      },
      {
        title: "Uh Oh my Truck Broke Down",
        views: "1000",
        length: "2:13",
        audio: "file name",
      },
    ],
  },
  {
    _id: 4,
    title: "Stepdad Vibes",
    image: "bradley2.jpg",
    genre: "Hard Rock",
    advisory: "Explicit",
    artist: "Big Brad",
    song_list: [
      {
        title: "Deadbeat Dad",
        views: "9000",
        length: "3:19",
        audio: "file name",
      },
      {
        title: "Jobless",
        views: "1000",
        length: "1:50",
        audio: "file name",
      },
      {
        title: "I'm not your real dad",
        views: "1000",
        length: "3:00",
        audio: "file name",
      },
    ],
  },
  {
    _id: 5,
    title: "Party Night",
    image: "bradley.jpg",
    genre: "House",
    advisory: "Explicit",
    artist: "Big Brad",
    song_list: [
      {
        title: "Loud Noises",
        views: "1000",
        length: "3:35",
        audio: "file name",
      },
      {
        title: "Alcohol Poisoning",
        views: "1000",
        length: "3:40",
        audio: "file name",
      },
      {
        title: "Cops are Here",
        views: "3000",
        length: "3:23",
        audio: "file name",
      },
    ],
  },
  {
    _id: 6,
    title: "In the Dark",
    image: "eye.jpg",
    genre: "Rock",
    advisory: "Explicit",
    artist: "Billy",
    song_list: [
      {
        title: "Run",
        views: "3000",
        length: "2:18",
        audio: "file name",
      },
      {
        title: "Hide",
        views: "1000",
        length: "2:20",
        audio: "file name",
      },
      {
        title: "Distant Stalker",
        views: "1000",
        length: "1:50",
        audio: "file name",
      },
    ],
  },
  {
    _id: 7,
    title: "Bidet",
    image: "bidet.jpg",
    genre: "Commedy",
    advisory: "SFW",
    artist: "Jack",
    song_list: [
      {
        title: "Toilet Humor",
        views: "1000",
        length: "1:00",
        audio: "file name",
      },
      {
        title: "I Don't Know",
        views: "3000",
        length: "1:50",
        audio: "file name",
      },
      {
        title: "Something a Kid Would Laugh At",
        views: "1000",
        length: "2:16",
        audio: "file name",
      },
    ],
  },
  {
    _id: 8,
    title: "Indecisive",
    image: "nic2.png",
    genre: "Rap",
    advisory: "NSFW",
    artist: "Benji",
    song_list: [
      {
        title: "What to Do",
        views: "1000",
        length: "1:26",
        audio: "file name",
      },
      {
        title: "I Can't Choose",
        views: "2000",
        length: "3:50",
        audio: "file name",
      },
      {
        title: "Under Pressure",
        views: "3000",
        length: "2:16",
        audio: "file name",
      },
    ],
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
    album.image = "images/albums/" + req.file.filename;
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
