var express = require('express');
var router = express.Router();
const User = require('../database/models');
// const isUserAuthenticated = require('../middleware');
const passport = require('passport');

//MIDDLEWARE

const isUserAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/auth/google');
  }
};

// ROUTES

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      res.status(401).send('Wrong username and/or password');
    } else if (!user.correctPassword(req.body.password)) {
      res.status(401).send('Wrong username and/or password');
    } else {
      req.login(user, err => (err ? next(err) : res.json(user)));
    }
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    req.login(user, err => (err ? next(err) : res.json(user)));
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists');
    } else {
      next(err);
    }
  }
});

// router.delete('/logout', (req, res, next) => {
//   req.logout();
//   req.session.destroy(err => {
//     if (err) {
//       return next(err);
//     } else {
//       res.status(204).end();
//     }
//   });
// });

router.get('/me', (req, res) => {
  res.json(req.user);
});

//ROUTES

router.get('/', (req, res) => {
  // res.render('index.ejs');
  res.send('Hello from auth router');
});

// passport.authenticate middleware is used here to authenticate the request
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile'] // Used to specify the required data
  })
);

// The middleware receives the data from Google and runs the function on Strategy config
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/api');
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// router.get('/:id', isUserAuthenticated, (req, res, next) => {
//   res.send('Secret route');
// });

router.get('/:id', isUserAuthenticated, async (req, res, next) => {
  // take the id from params
  const { id } = req.params;
  console.log(id);
  // query the database for a user with matching id
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

module.exports = router;
