var express = require('express');
var router = express.Router();
const { User } = require('../database/models');

// router.get('/:id', async (req, res, next) => {
//   take the id from params
//   const { id } = req.params;
//   // query the database for a user with matching id
//   try {
//     // if successful:
//     res.send(`Hello user ${id}`);
//     const user = await User.findByPk(id); // using profile id from user profiles
//     // send back the user as a response
//     res.status(200).json(user);
//   } catch (err) {
//     // if error:
//     // handle error
//     next(err);
//   }
// });

//MIDDLEWARE

const isUserAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(403).send('You must be logged in!');
    // res.redirect('/auth/google');
  }
};

//ROUTES

router.get('/', (req, res) => {
  res.send('Hello from users router');
});

router.get('/:id', isUserAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  try {
    // if successful:
    // res.send(`Hello user ${id}`);
    const user = await User.findByPk(id); // using profile id from user profiles
    console.log(user);
    // // send back the user as a response
    res.status(200).json(user);
  } catch (err) {
    // if error:
    // handle error
    next(err);
  }
  // res.send('hello from get :id after authentication');
});

router.post('/:id', isUserAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { animeId } = req.body;
    let results = {};

    // Add the anime id to the user's animeList array
    console.log("Hi i just put something")
    const currentUser = await User.findByPk(userId);
    // await currentUser.addMovie(movie[0]);
    currentUser.animeList.push(animeId);
    // res.json([0]);
    res.json(currentUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
