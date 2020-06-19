var express = require('express');
var router = express.Router();

// Subrouters;
const usersRouter = require('./users');
// const authRouter = require('../auth/google');
const homeRouter = require('./homePage');

const animesRouter = require('./animes');
// Mount our subrouters to assemble our apiRouter;
router.use('/animes', animesRouter);
router.use('/users', usersRouter);
// router.use('/auth', authRouter);
router.use('/', homeRouter);

// Error handling middleware;
router.use((req, res, next) => {
  const error = new Error('Not Found, Please Check URL!');
  error.status = 404;
  next(error);
});

// Export our apiRouter, so that it can be used by our main app in app.js;
module.exports = router;
