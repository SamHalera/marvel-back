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
    const { name, limit, skip } = req.query;
    console.log("name=>", name);

    console.log("skip for skip=>", skip);
    console.log(req.query);

    let query = "";

    let limitForQuery = 100;
    if (name || limit || skip) {
      if (limit < 1 || limit > 100) {
        return res.status(400).json({ message: "Bad request" });
      }

      if (name) {
        query += `&name=${name}`;
      }
      if (skip) {
        let skipForQuery = skip * limitForQuery - limitForQuery;

        console.log(skipForQuery);
        query += `&skip=${skipForQuery}`;
      }

      console.log("limit typeof: ", typeof skip);
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

router.get("/character/:id", async (req, res) => {
  try {
    console.log("inside try");
    const { id } = req.params;
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${id}?apiKey=${process.env.API_KEY}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
