const {User} = require('../database/models');
const {Anime} = require('../database/models');

const seedDatabase = async () => {
  await Promise.all([
    User.create({
      email: 'love.anime@gmail.com',
      password: 'ZENvZGU=',
      // username: 'iLoveAnime',
      //animeList: [1, 3, 5,22]
    }),
    User.create({
      email: 'boku.anime@gmail.com',
      password: 'ZENvZGU=',
      // username: 'boku',
      //animeList: [9, 10, 18, 56, 100]
    }),
    Anime.create({
      kitsuId: 11,
      name: 'Naruto'
    })
  ]); 
 };

module.exports = seedDatabase;
