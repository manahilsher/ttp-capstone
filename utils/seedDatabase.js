const User = require('../database/models');

const seedDatabase = async () => {
  await Promise.all([
    // User.create({
    //   email: 'love.anime@gmail.com',
    //   username: 'iLoveAnime',
    //   animeList: [0, 3, 5]
    // }),
    // User.create({
    //   email: 'boku.anime@gmail.com',
    //   username: 'boku',
    //   animeList: [9, 10, 18, 56, 100]
    // })
  ]);
};

module.exports = seedDatabase;
