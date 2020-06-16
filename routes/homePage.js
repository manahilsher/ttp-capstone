const express = require("express");
const router = express.Router();
const { Home } = require("../database/models");

//router to home page
router.get("/", async (req, res, next) => {
  try {
    res.send("homepage");
  } catch (err) {
    next(err); //catch errors
  }
});

//route to serve a single anime page
router.get("/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    res.send(`Anime page: ${id}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
