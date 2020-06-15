const User = require('../database/models');

const seedDatabase = async () => {
  await Promise.all([
    User.create({
      username: 'iLoveAnime',
      animeList: [0, 3, 5]
    }),
    User.create({
      username: 'boku',
      animeList: [9, 10, 18, 56, 100]
    })
  ]);
};

module.exports = seedDatabase;
