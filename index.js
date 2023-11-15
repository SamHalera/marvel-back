require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

//Use routers
const characterRoutes = require("./routes/characters");
const comicsRoutes = require("./routes/comics");
app.use(characterRoutes);
app.use(comicsRoutes);

//Deal with not found page (404)
app.all("*", (req, res) => {
  res.status(404).json({ message: "MARVEL :This page does not exist" });
});

//Start the server
// port 3000 just for local dev... we let the prod server to listent to its own port

app.listen(process.env.PORT, () => {
  console.log("Serverd started...");
});
