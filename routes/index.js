var express = require('express');
var router = express.Router();
const db = require("../database/database");

router.get('/', function(req, res, next) {
	res.render('Home', { title: 'Express' });
});

module.exports = router;