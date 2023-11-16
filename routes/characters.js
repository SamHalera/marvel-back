const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("INSIDE CHARACTERS");
    //PARAMS ACCEPTED AND OPTIONAL:
    //limit => between 1 and 100
    //skip => number of results to ignore
    //name => search a character by name
    const { name, limit, page } = req.query;
    console.log("name=>", name);
    console.log("limit=>", limit);
    console.log("skip=>", page);
    console.log(req.query);

    let query = "";

    const objForQuery = {};

    if (limit || name || page) {
      if (limit < 1 || limit > 100) {
        return res.status(400).json({ message: "Bad request" });
      }

      if (name) {
        objForQuery.name = name;
      }
      if (limit) {
        objForQuery.limit = limit;
      }
      if (page) {
        objForQuery.skip = limit * page - limit;
      }
      console.log(objForQuery);

      for (const key in objForQuery) {
        query += `&${key}=${objForQuery[key]}`;
        console.log(key, objForQuery[key]);
      }
    }

    console.log("query=>", query);

    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.API_KEY}${query}`
    );

    // console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Page of one character with the comics in relation to him
// TWO REQUESTS AXIOS
router.get("/character/:id", async (req, res) => {
  try {
    console.log("inside try");
    const { id } = req.params;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${id}?apiKey=${process.env.API_KEY}`
    );

    const arrayOfComicsObj = [];
    const array = response.data.comics;
    for (let i = 0; i < array.length; i++) {
      const resComic = await axios.get(
        `https://lereacteur-marvel-api.herokuapp.com/comic/${array[i]}?apiKey=${process.env.API_KEY}`
      );
      arrayOfComicsObj.push(resComic.data);
    }

    response.data.comicsArray = arrayOfComicsObj;
    console.log(arrayOfComicsObj);

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
