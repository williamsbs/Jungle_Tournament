//------IMPORT EXTERNE---------------------------------------------------------------------------------------
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const expressValidator = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bcrypt = require('bcrypt-nodejs');

//-----IMPORT LOCAL------------------------------------------------------------------------------------------

const index = require('./routes/index');
const register = require('./routes/Register');
const login = require('./routes/Login');
const logout = require('./routes/Logout');
const createpool = require('./routes/Createpool');
const profile = require('./routes/Profile');
const db = require("./database/database");


//------VARIABLE GLOBALE-------------------------------------------------------------------------------------

const app = express();
const port = 8080;
const server = http.createServer(app);

//----VIEW ENGINE--------------------------------------------------------------------------------------------
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

//-----MIDDLE WARE-------------------------------------------------------------------------------------------
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use("/assets", express.static('public/assets'));
app.use(bodyParser.urlencoded({ extended: false }));


const options = {
	host: '127.0.0.1',
	port: 3306,
	user: 'username',
	password: 'password',
	database: 'jungledb'
};
const sessionStore = new MySQLStore(options);

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	store: sessionStore,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());

app.use(function(req, res, next){
	res.locals.isAuthenticated = req.isAuthenticated();
	next()
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		db.query("SELECT id, password FROM users WHERE username = ?", username, (err, result) => {
			if (err) {
				done(err)
			}
			if (result == '') done(null, false);
			else {
				let hash = result[0].password;
				console.log(hash);
				bcrypt.compare(password, hash, (err, response) => {
					if (response === true) {
						return done(null, {user_id: result[0].id});
					} else {
						return done(null, false);
					}
				});
			}
		});
	}
));

server.listen(port, function (err) {
	if (err) throw err;
	console.log("Jungle is running at http://%s:%s !", port);
});
//-----ROUTE-------------------------------------------------------------------------------------------------

app.use('/', index);
app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);
app.use('/profile', profile);
app.use('/createpools', createpool);

app.use(function (req, res) {
	res.render("404");
});

module.exports = app;