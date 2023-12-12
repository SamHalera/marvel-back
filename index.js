require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const isAuthenticated = require("./middlewares/IsAuthenticated");

//Use routers
const characterRoutes = require("./routes/characters");
const comicsRoutes = require("./routes/comics");
const userRoutes = require("./routes/user");
const favoritesRoutes = require("./routes/favorites");
app.use(characterRoutes);
app.use(comicsRoutes);
app.use(userRoutes);
app.use(favoritesRoutes);

//connect to DB
mongoose.connect(process.env.MONGODB_URI);

//connect to my cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//Deal with not found page (404)
app.all("*", (req, res) => {
  res.status(404).json({ message: "MARVEL :This page does not exist" });
});

//Start the server
// port 3000 just for local dev... we let the prod server to listent to its own port

app.listen(process.env.PORT, () => {
  console.log("Serverd started...");
});
