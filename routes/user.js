const express = require("express");
// const mongoose = require("mongoose");
const axios = require("axios");
const User = require("../models/User");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const router = express.Router();

//Sign Up creat new User
router.post("/user/signup", async (req, res) => {
  console.log(req.header);
  try {
    const { email, password, username } = req.body;

    console.log("body=>", req.body);

    //If username or email are not filler send an error message
    //sanitize all data sent by user ==> package `dompurify` ?
    if (!email || !password || !username) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    //verify if email already exists in DB
    const existingUser = await User.findOne({ email: email });
    //If user exists we send an error message
    if (existingUser !== null) {
      return res.status(409).json({ message: "This email already exists!" });
    }

    //create a salt of 16 characters
    const salt = uid2(16);

    // Create a hash with password string and sall string
    const hash = SHA256(password + salt).toString(encBase64);

    //create a token
    const token = uid2(64);

    // console.log(req.body);
    // console.log("salt => ", salt);
    // console.log("hash => ", hash);

    //create an User instance
    const newUser = new User({
      email,
      username,
      token,
      hash,
      salt,
    });

    //persist new user in DB
    await newUser.save();

    console.log("new user:", newUser);
    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      token: newUser.token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//LOGIN
router.post("/user/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }
    const user = await User.findOne({ email: email });

    if (user.email !== email) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    //Je compare le hash du user en BD avec le hash du req.body.password + user.salt
    const newHash = SHA256(password + user.salt).toString(encBase64);
    if (newHash !== user.hash) {
      //   console.log("hash =>", user.salt);
      //statyus 401 unauthorized
      return res.status(401).json({ message: "Unauthorized!" });
    }

    //if User is OK
    console.log("User is OK");
    res.status(200).json({
      _id: user._id,
      token: user.token,
      email: user.email,
      username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//This route is not used any more
//Use post("/favorites") insted
router.put("/favorites/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    //si pas de user ==> e,nvoi d'erreur
    if (!user) {
      return res.status(400).json({ error: "User doesn't exist!" });
    }

    const { addCharacter, addComic, removeCharacter, removeComic } = req.query;

    if (addCharacter) {
      user.favorites.characters.push(addCharacter);
    }
    if (addComic) {
      user.favorites.comics.push(addComic);
    }
    if (removeCharacter) {
      const index = user.favorites.characters.indexOf(removeCharacter);
      user.favorites.characters.splice(index, 1);
    }
    if (removeComic) {
      const index = user.favorites.comics.indexOf(removeComic);
      console.log(index);
      user.favorites.comics.splice(index, 1);
    }
    await user.save();
    res.status(201).json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
