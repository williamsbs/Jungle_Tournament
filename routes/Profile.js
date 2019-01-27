const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', authenticationMiddleware(), function (req, res, next) {
	res.render('profile');
});

function authenticationMiddleware() {
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

		if (req.isAuthenticated()) return next();
		res.redirect('/login')
	}
}

module.exports = router;