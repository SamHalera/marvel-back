require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
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

//Deal with not found page (404)
app.all("*", (req, res) => {
  res.status(404).json({ message: "MARVEL :This page does not exist" });
});

//Start the server
// port 3000 just for local dev... we let the prod server to listent to its own port

app.listen(process.env.PORT, () => {
  console.log("Serverd started...");
});
