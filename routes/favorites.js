const express = require("express");
// const mongoose = require("mongoose");
const axios = require("axios");
const Favorite = require("../models/Favorite");

const router = express.Router();

router.get("/favorites", async (req, res) => {
  try {
    const favorites = await Favorite.find();

    console.log(favorites);

    const responseComics = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}`
    );

    const responseCharacters = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}`
    );
    const comics = responseComics.data.results;
    const characters = responseCharacters.data.results;

    const arrayOfFavorites = [];

    for (let i = 0; i < favorites.length; i++) {
      for (let j = 0; j < characters.length; j++) {
        if (favorites[i].itemId === characters[j]._id) {
          arrayOfFavorites.push(characters[j]);
        }
      }
    }

    for (let i = 0; i < favorites.length; i++) {
      for (let j = 0; j < comics.length; j++) {
        if (favorites[i].itemId === comics[j]._id) {
          arrayOfFavorites.push(comics[j]);
        }
      }
    }
    console.log(arrayOfFavorites);
    res.status(200).json(arrayOfFavorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/favorites", async (req, res) => {
  try {
    const { itemId, label } = req.body;
    const favorite = new Favorite({
      itemId,
      label,
    });

    await favorite.save();
    console.log(favorite);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/favorites/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await Favorite.find({ itemId: id });
    //si pas de favorite ==> envoi d'erreur
    if (!favorite) {
      return res.status(400).json({ error: "favorite doesn't exist!" });
    }

    await Favorite.deleteOne({ itemId: id });

    res.status(200).json(favorite);

    console.log(favorite);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
