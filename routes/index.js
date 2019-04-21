const express = require('express');
const router = express.Router();

const { User } = require("./../models/users");

/* GET home page. */
router.get('/', async function(req, res, next) {
  const data = await User.find({});
  res.send(data)
});

module.exports = router;
