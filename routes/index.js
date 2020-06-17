var express = require('express');
var router = express.Router();

// Subrouters;
const usersRouter = require('./users');
const authRouter = require('./google');
const homeRouter = require('./homePage');

// Mount our subrouters to assemble our apiRouter;

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/', homeRouter);

// Error handling middleware;
router.use((req, res, next) => {
  const error = new Error('User Not Found!');
  error.status = 404;
  next(error);
});

// Export our apiRouter, so that it can be used by our main app in app.js;
module.exports = router;
