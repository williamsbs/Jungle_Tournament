var express = require('express');
var router = express.Router();
let nodemailer = require ('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('Home', { title: 'Express' });
});

module.exports = router;