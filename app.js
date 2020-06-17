/**
 * Here, we will sync our database, create our application, and export this
 * module so that we can use it in the bin directory, where we will be able to
 * establish a server to listen and handle requests and responses;
 */

// Load environmental variables from .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

// Utilities;
const createLocalDatabase = require('./utils/createLocalDatabase');
const seedDatabase = require('./utils/seedDatabase');

// Our database instance;
const db = require('./database');

// Auth
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

// A helper function to sync our database;
const syncDatabase = () => {
  if (process.env.NODE_ENV === 'production') {
    db.sync();
  } else {
    console.log('As a reminder, the forced synchronization option is on');
    db.sync({ force: true })
      .then(() => seedDatabase())
      .catch(err => {
        if (err.name === 'SequelizeConnectionError') {
          createLocalDatabase();
          seedDatabase();
        } else {
          console.log(err);
        }
      });
  }
};

const app = express();
// A helper function to create our app with configurations and middleware;
const configureApp = () => {
  app.use(helmet());
  app.use(logger('dev'));
  // handle request data:
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(compression());
  app.use(cookieParser());

  // Our apiRouter
  //   const apiRouter = require('./routes/index');

  // Mount our apiRouter
  const apiRouter = require('./routes/index');
  //   app.use('/api', apiRouter);

  app.use('/api', apiRouter);
  // Error handling;
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  // More error handling;
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });

  // AUTH

  // cookieSession config
  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
      keys: ['randomstringhere']
    })
  );

  app.use(passport.initialize()); // Used to initialize passport
  app.use(passport.session()); // Used to persist login sessions

  // Strategy config
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.SERVER_API_URL}/auth/google/callback`
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, profile); // passes the profile data to serializeUser
      }
    )
  );

  // Used to stuff a piece of information into a cookie
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Used to decode the received cookie and persist session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

app.listen(3000, () => console.log('listening on port 3000...'));

// Main function declaration;
const bootApp = async () => {
  await syncDatabase();
  await configureApp();
};

// Main function invocation;
bootApp();

// Export our app, so that it can be imported in the www file;
module.exports = app;
