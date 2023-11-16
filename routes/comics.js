const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/comics", async (req, res) => {
  console.log("INSIDE COMICS");
  try {
    //PARAMS ACCEPTED AND OPTIONAL:
    //limit => between 1 and 100
    //skip => number of results to ignore
    //title => search a character by title
    const { title, limit, page } = req.query;

    console.log("title=>", title);
    console.log("limit=>", limit);
    console.log("page=>", page);

    let query = "";

    const objForQuery = {};

    if (limit || title || page) {
      if (limit < 1 || limit > 100) {
        return res.status(400).json({ message: "Bad request" });
      }

      if (title) {
        objForQuery.title = title;
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

    console.log(query);
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.API_KEY}${query}`
    );
    // console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET COMICS BY CHARACTHER ID
router.get("/comics/:characterId", async (req, res) => {
  try {
    const characterId = req.params.characterId;
    console.log(characterId);
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=${process.env.API_KEY}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
