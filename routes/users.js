var express = require('express');
var router = express.Router();
const { User } = require('../database/models');
// const isUserAuthenticated = require('../middleware');
const passport = require('passport');

router.get('/', (req, res) => {
  // res.render('index.ejs');
  res.send('Hello from Users router');
});

const isUserAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send('You must login!');
  }
};

// router.get('/:id', isUserAuthenticated, async (req, res, next) => {
//   // take the id from params
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

router.get('/:id', isUserAuthenticated, (req, res, next) => {
  res.send('Secret route');
});

// passport.authenticate middleware is used here to authenticate the request
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile'] // Used to specify the required data
  })
);

// The middleware receives the data from Google and runs the function on Strategy config
router.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    res.redirect('/:id');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
