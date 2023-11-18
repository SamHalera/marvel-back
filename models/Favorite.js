const mongoose = require("mongoose");

const Favorite = mongoose.model("Favorites", {
  label: String,
  itemId: String,
});

module.exports = Favorite;
