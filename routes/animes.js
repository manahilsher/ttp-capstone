var express = require("express");
var router = express.Router();
const {Anime } = require("../database/models");


router.get("/", async (req, res, next) => {
    // try to get students object from database
    try {
      // students will be the result of the Campus.findAll promise
      const animes = await Anime.findAll();
      // if students is valid, it will be sent as a json response
      console.log(animes);
      res.status(200).json(animes);
    } catch (err) {
      // if there is an error, it'll passed via the next parameter to the error handler middleware
      next(err);
    }
  });
  router.post('/', async (req, res, next) => {
    try {
      const anime = await Anime.create(req.body);
    //   req.login(anime, err => (err ? next(err) : res.json(user)));
    //   // res.status(201).send(user);
    } catch (err) {
    //   if (err.name === 'SequelizeUniqueConstraintError') {
    //     res.status(401).send('User already exists');
    //   } else {
        next(err);
    //   }
    }
  });
router.put("/:id", async (req, res, next) => {
    const { id } = req.params;
    console.log(req.body);
    const updatedObj = { ...req.body };
    try {
      const anime = await Anime.findByPk(id);
      await anime.set(updatedObj);
      const updatedAnime = await anime.save();
      res.status(201).send(updatedAnime);
    } catch (err) {
      next(err);
    }
  });

  module.exports = router;