const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', function (req, res, next) {
	req.logout();
	req.session.destroy();
	res.render('login');
});

module.exports = router;
