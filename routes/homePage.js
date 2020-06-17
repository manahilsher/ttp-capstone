const express = require('express');
const router = express.Router();
const { Home } = require('../database/models');

//router to home page
router.get('/', async (req, res, next) => {
  try {
    res.send('homepage');
  } catch (err) {
    next(err); //catch errors
  }
});

//route to serve a single anime page
// id based on the kitsune api anime id, not db id
router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    // const page = object.find( c => c.id === parseInt(req.params.id))
    res.send(`Anime page: ${id}`);
  } catch (err) {
    //if (!page)res.status(404).send('404 not found')
    //eslse, res.send(page)
    next(err);
  }
});

module.exports = router;
