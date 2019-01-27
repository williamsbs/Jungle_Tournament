var express = require('express');
var router = express.Router();
const db = require("../database/database");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('Home', { title: 'Express' });
});

router.get('/createPools', function(req, res, next) {
	let sql1;
	let sql = "SELECT * FROM FirstPool";
	db.query(sql,function(err, result){
		if(err) console.log(err);
		let i = result.length;
		while (i >= 2){
			sql1 = "CREATE TABLE IF NOT EXISTS pool" + i + " (" +
				"  id int(11) PRIMARY KEY AUTO_INCREMENT not null," +
				"  adv1 varchar(256) not null," +
				"  adv2 varchar(256) not null," +
				"  pnt1 int(11) DEFAULT 0," +
				"  pnt2 int(11) DEFAULT 0" +
				") ENGINE = InnoDB;";
			db.query(sql1,function(err, result1){
				if (err)console.log(err);
			});
			i = i/2;
		}
		let sql = "SHOW TABLES";
		db.query(sql, (err, result) =>{
			if(err) console.log(err);
			console.log(result.length);
			res.render('Home', {
				nbPools: result.length
			});
		});

	});

});
module.exports = router;