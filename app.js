require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

// Utilities;
const createLocalDatabase = require('./utils/createLocalDatabase');
const seedDatabase = require('./utils/seedDatabase');

// Our database instance;
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./database');
const sessionStore = new SequelizeStore({ db });

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

// Instantiate our express application;
const app = express();

// Passport and Express sessions
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// A helper function to create our app with configurations and middleware;
const configureApp = () => {
  app.use(helmet());
  app.use(logger('dev'));

  // handle request data:
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ credentials: true, origin: 'http://localhost:3001' }));
  app.use(compression());
  app.use(cookieParser());

  // Routers
  const apiRouter = require('./routes');
  const authRouter = require('./auth');

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
  app.use(
    session({
      secret:
        'a super secretive secret key string to encrypt and sign the cookie',
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // More error handling;
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });

  // Mount routers
  app.use('/api', apiRouter);
  app.use('/auth', authRouter);
};

// Main function declaration;
const bootApp = async () => {
  await sessionStore.sync();
  await syncDatabase();
  await configureApp();
};

app.listen(3001, () => console.log('listening on port 3001...'));

// Main function invocation;
bootApp();

// Export our app, so that it can be imported in the www file;
module.exports = app;
