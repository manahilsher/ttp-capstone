var express = require('express');
var router = express.Router();
const { User, Anime } = require('../database/models');

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

// const isUserAuthenticated = (req, res, next) => {
//   if (req.user) {
//     next();
//   } else {
//     res.status(403).send('You must be logged in!');
//     // res.redirect('/auth/google');
//   }
// };

//ROUTES

router.get('/', async (req, res) => {
  // res.send('Hello from users router');
    // try to get campuses object from database
    try {
      // campuses will be the result of the Campus.findAll promise
      const users = await User.findAll({ include: Anime });
      // if campuses is valid, it will be sent as a json response
      console.log(users);
      res.status(200).json(users);
    } catch (err) {
      // if there is an error, it'll passed via the next parameter to the error handler middleware
      next(err);
    }
  });

  router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
    let user;
    try {
      user = await User.findByPk(id, { include: Anime });
    } catch (err) {
      next(err);
    }
    // try {
    //   const userAnimes = await user.getAnimes();
    //   const userAndAnimes = {
    //     user: user,
    //     animes: userAnimes
    //   }
    //   res.status(200).json(userAndAnimes);
    // } catch (err) {
    //   next(err);
    // }
  });

  // router.put("/:id", async (req, res, next) => {
  //   // get the id from request params
  //   const { id } = req.params;
  //   // get form data from the request body
  //   const { email, password } = req.body;
  //   const updatedObj = {
  //     name: name,
  //     address: address,
  //     description: description,
  //     imageUrl: imageUrl,
  //   };
  //   try {
  //     // if successfull:
  //     // Find a campus with a matching id from the database
  //     const campus = await Campus.findByPk(id, { include: Student });
  //     // database would return a valid campus object or an error
  //     console.log(updatedObj);
  //     // modify the campus object with new form data
  //     await campus.set(updatedObj);
  //     // save the new campus object to the data
  //     // database would return a new campus object
  //     const updatedCampus = await campus.save();
  //     console.log(updatedCampus);
  //     // send the newCampus as a response from the API
  //     res.status(201).send(updatedCampus);
  //   } catch (err) {
  //     // if error:
  //     // handle the error
  //     next(err);
  //   }
  // });
// router.get('/:id', isUserAuthenticated, async (req, res, next) => {
//   const { id } = req.params;
//   console.log(id);

//   try {
//     // if successful:
//     // res.send(`Hello user ${id}`);
//     const user = await User.findByPk(id); // using profile id from user profiles
//     console.log(user);
//     // // send back the user as a response
//     res.status(200).json(user);
//   } catch (err) {
//     // if error:
//     // handle error
//     next(err);
//   }
//   // res.send('hello from get :id after authentication');
// });

// router.post('/:id', isUserAuthenticated, async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const { animeId } = req.body;
//     let results = {};

//     // Add the anime id to the user's animeList array
//     console.log("Hi i just put something")
//     const currentUser = await User.findByPk(userId);
//     // await currentUser.addMovie(movie[0]);
//     currentUser.animeList.push(animeId);
//     // res.json([0]);
//     res.json(currentUser);
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
