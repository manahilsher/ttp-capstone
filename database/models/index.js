// Here, we can prepare to register our models, set up associations between tables, and generate a barrel file for the models;

const User = require('./user');
const Anime = require('./anime')

User.hasMany(Anime);
Anime.belongsTo(User);

module.exports = {User,Anime};
