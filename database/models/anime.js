const Sequelize = require('sequelize');
const db = require('../db');

const Anime = db.define('anime', {
    kitsuId: { type: Sequelize.INTEGER, allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false},
    poster: { type: Sequelize.STRING}
  // username: { type: Sequelize.STRING, allowNull: false },
//   animeList: { type: Sequelize.ARRAY(Sequelize.OBJECT) },
//   email: {
})
    
module.exports = Anime;
