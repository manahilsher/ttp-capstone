require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

//Database
const createLocalDatabase = require('./utils/createLocalDatabase');
const seedDatabase = require('./utils/seedDatabase');
const db = require('./database');

//Auth
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
// const cookieSession = require('cookie-session');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sessionStore = new SequelizeStore({ db });

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

const configureApp = () => {
  app.use(helmet());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(compression());
  app.use(cookieParser());
  app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

  //Error Handling
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });

  // AUTH

  app.use(
    session({
      secret: 'random string here',
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  );

  app.use(passport.initialize()); // Used to initialize passport
  app.use(passport.session()); // Used to persist login sessions

  const apiRouter = require('./routes/index');
  const authRouter = require('./auth');
  app.use('/api', apiRouter);
  app.use('/auth', authRouter);

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
  // passport.deserializeUser(async (id, done) => {
  //   try {
  //     const user = await db.models.user.findByPk(id);
  //     done(null, user);
  //   } catch (err) {
  //     done(err);
  //   }
  // });
};

app.listen(3000, () => console.log('listening on port 3000...'));

// Main function declaration;
const bootApp = async () => {
  await sessionStore.sync();
  await syncDatabase();
  await configureApp();
};

// Main function invocation;
bootApp();

// Export our app, so that it can be imported in the www file;
module.exports = app;
