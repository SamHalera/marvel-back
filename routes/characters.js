const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/characters", async (req, res) => {
  try {
    //PARAMS ACCEPTED AND OPTIONAL:
    //limit => between 1 and 100
    //skip => number of results to ignore
    //name => search a character by name
    const { name, limit, skip } = req.query;
    console.log("name=>", name);
    console.log("limit=>", limit);
    console.log("skip=>", skip);
    console.log(req.query);

    let query = "";

    if (limit || name || skip) {
      if (limit < 1 || limit > 100) {
        return res.status(400).json({ message: "Bad request" });
      }

      for (const key in req.query) {
        query += `&${key}=${req.query[key]}`;
        console.log(key, req.query[key]);
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

module.exports = router;
