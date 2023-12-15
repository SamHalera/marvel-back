const express = require("express");
const axios = require("axios");
const MD5 = require("crypto-js/md5");
const encBase64 = require("crypto-js/enc-base64");

const router = express.Router();

router.get("/test/comics", async (req, res) => {
  try {
    // const response = await axios.get(
    //   `http://gateway.marvel.com/v1/public/comics`
    // );
    // console.log(response.data);
    // res.status(200).json(response.data);

    const publicKEY = "08f296a8702b4cb50eb25e61bc0e70b1";
    const privateKEY = "99964ef5efaba6d1c5064be4e93caafd32368372";
    const ts = Date.now();
    const hash = MD5(ts + privateKEY + publicKEY).toString(encBase64);
    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publicKEY}&hash=${hash}`
    );
    console.log(hash);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
