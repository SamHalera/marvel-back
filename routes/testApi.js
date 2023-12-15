const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/test/comics", async (req, res) => {
  try {
    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/comics`
    );
    console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
