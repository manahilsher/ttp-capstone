var express = require("express");
var router = express.Router();
const { User } = require("../database/models");

router.get("/:id", async (req, res, next) => {
  // take the id from params
  const { id } = req.params;
  // query the database for a user with matching id
  try {
    // if successful:
    res.send(`Hello user ${id}`);
    const user = await User.findByPk(id); // using profile id from user profiles
    // send back the user as a response
    res.status(200).json(user);
  } catch (err) {
    // if error:
    // handle error
    next(err);
  }
});

module.exports = router;
