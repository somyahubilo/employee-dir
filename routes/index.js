const express = require('express');
const router = express.Router();

const { User } = require("./../models/users");

/* GET home page. */
router.get('/', async function(req, res, next) {
  const data = User.find({});
  res.render('index', { title: data[0].emailAddress });
});

module.exports = router;
