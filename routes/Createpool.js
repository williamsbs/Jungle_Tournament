const express = require('express');
const router = express.Router();
const db = require("../database/database");
const empty = require('is-empty');

router.get('/', function (req, res, next) {
	let sql1;
	let sql = "SELECT * FROM FirstPool";
	db.query(sql, function (err, result) {
		if (err) console.log(err);
		let i = result.length;
		let j = 0;
		while (i > 1) {
			sql1 = "CREATE TABLE IF NOT EXISTS pool" + j + " (" +
				"  id int(11) PRIMARY KEY AUTO_INCREMENT not null," +
				"  adv1 varchar(256) not null," +
				"  adv2 varchar(256) not null," +
				"  pnt1 int(3) DEFAULT 0," +
				"  pnt2 int(3) DEFAULT 0," +
				"  finished int(1) DEFAULT 0" +
				") ENGINE = InnoDB;";
			db.query(sql1, (err) => {
				if (err) console.log(err)
			});
			j = j + 1;
			i = i / 2;
		}
		i = result.length;
		j = 0;
		let sql2 = "SELECT * FROM pool0";
		db.query(sql2, (err, result1) => {
			if (err) console.log(err);
			if (empty(result1)) {
				while (i > 1) {
					let sql = "INSERT INTO pool" + j + "(adv1, adv2, pnt1, pnt2,finished) VALUES(?,?,?,?,?);";
					for (let x = 0; x < (i / 2); x++) {
						db.query(sql, ['?', '?', 0, 0, 0]);
					}
					j++;
					i = i / 2;
				}
			}
		});

		let pool = [];

		let sql = "SHOW TABLES";
		db.query(sql, (err, result) => {
			if (err) console.log(err);
			let str = "";
			for (let i = 0; i < result.length - 2; i++) {
				str += "SELECT * FROM " + result[i].Tables_in_jungledb + ";"
			}
			db.query(str, (err, result) =>{
				console.log(result)
				res.render('Home', {
					result
				});
			})
		})
	});
});

module.exports = router;


