const { User } = require('../database/models');

const seedDatabase = async () => {
  await Promise.all([
    // User.create({
    //   username: '',
    //   animeList: []
    // })
  ]);
};

module.exports = seedDatabase;
