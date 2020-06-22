var express = require('express');
var router = express.Router();
const { User, Anime } = require('../database/models');

//ROUTES

router.get('/', async (req, res) => {
	// res.send('Hello from users router');
	// try to get campuses object from database
	try {
		// campuses will be the result of the Campus.findAll promise
		const users = await User.findAll({ include: Anime });
		// if campuses is valid, it will be sent as a json response
		console.log(users);
		res.status(200).json(users);
	} catch (err) {
		// if there is an error, it'll passed via the next parameter to the error handler middleware
		next(err);
	}
});

router.get('/:id', async (req, res, next) => {
	const { id } = req.params;
	let user;
	try {
		user = await User.findByPk(id, { include: Anime });
	} catch (err) {
		next(err);
	}
	// try {
	//   const userAnimes = await user.getAnimes();
	//   const userAndAnimes = {
	//     user: user,
	//     animes: userAnimes
	//   }
	//   res.status(200).json(userAndAnimes);
	// } catch (err) {
	//   next(err);
	// }
});

module.exports = router;
