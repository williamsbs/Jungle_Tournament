const express = require('express');
const router = express.Router();
const db = require('../database/database');
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');

const saltRounds = 10;

router.get('/', function (req, res, next) {
	res.render('register');
});

router.post('/', function (req, res, next) {

	req.checkBody('username', 'Username field cannot be empty.').notEmpty();
	req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
	req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
	req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
	req.checkBody('password', 'Password must be between 6-100 characters long.').len(6, 100);
	req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{6,}$/, "i");
	req.checkBody('password-check', 'Password must be between 6-100 characters long.').len(6, 100);
	req.checkBody('password-check', 'Passwords do not match, please try again.').equals(req.body.password);
	req.checkBody('username', 'Username can only contain letters, numbers, or underscores.').matches(/^[A-Za-z0-9_-]+$/, 'i');

	let errors = req.validationErrors();

	if (errors) {
		res.render('index', {
			errors
		});
	} else {

		// let errors = [];
		const username = req.body.username;
		const email = req.body.email;
		const password = req.body.password;


		const salt = bcrypt.genSaltSync(saltRounds);
		const hash = bcrypt.hashSync(password, salt);

		let sql = "SELECT * FROM users WHERE username = ? AND email = ?";
		db.query(sql, [username, email], (err) => {
			if (err) console.log(err);
			let sql = "INSERT INTO users(username, email, password) VALUES(?,?,?);";
			db.query(sql, [username, email, hash], (err) => {
				if (err) throw err;
				let sql = "SELECT LAST_INSERT_ID() AS user_id;";
				db.query(sql, (err, result) => {

					if (err) console.log(err);
					else {

						const user_id = result[0];

						req.login(user_id, (err) => {
							res.redirect('/');
						});
					}
				});
			});
		});
	}
});
passport.serializeUser(function (user_id, done) {
	done(null, user_id);
});

passport.deserializeUser(function (user_id, done) {
	done(null, user_id);
});

function authenticationMiddleware() {
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

		if (req.isAuthenticated()) return next();
		res.redirect('/login')
	}
}

module.exports = router;
