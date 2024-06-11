const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const mongoose = require("mongoose");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

const url =
  "mongodb+srv://bdshilli:ZEpqGCmtrtQNz1ZW@data.hw2cdx0.mongodb.net/?retryWrites=true&w=majority&appName=Data";

mongoose
  .connect(url)
  .then(() => console.log("Connected to mongodb"))
  .catch((error) => console.log("Couldnt connect to mongodb", error));

const albumSchema = new mongoose.Schema({
  title: String,
  artist: String,
  genre: String,
  advisory: String,
  image: String,
});

const Album = mongoose.model("Album", albumSchema);

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

app.get("/api/albums", async (req, res) => {
  const albums = await Album.find();
  res.send(albums);
});

app.post("/api/albums", upload.single("image"), async (req, res) => {
  const result = validateAlbum(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  const album = new Album({
    title: req.body.title,
    genre: req.body.genre,
    advisory: req.body.advisory,
    artist: req.body.artist,
  });

  if (req.file) {
    album.image = req.file.filename;
  }

  const newAlbum = await album.save();
  res.send(newAlbum);
});

app.put("/api/albums/:id", upload.single("img"), async (req, res) => {
  const result = validateAlbum(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  let fieldsToUpdate = {
    title: req.body.title,
    genre: req.body.genre,
    advisory: req.body.advisory,
    artist: req.body.artist,
  };

  if (req.file) {
    fieldsToUpdate.image = req.file.filename;
  }

  const wentThrough = await Album.updateOne(
    { _id: req.params.id },
    fieldsToUpdate
  );

  const updatedAlbum = await Album.findOne({ _id: req.params.id });

  res.send(updatedAlbum);
});

app.delete("/api/albums/:id", async (req, res) => {
  const album = await Album.findByIdAndDelete(req.params.id);
  res.send(album);
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
