//------IMPORT EXTERNE---------------------------------------------------------------------------------------
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');

//-----IMPORT LOCAL------------------------------------------------------------------------------------------
const index = require('./routes/index');

//------VARIABLE GLOBALE-------------------------------------------------------------------------------------
const app = express();
const port = 8080;
var server = http.createServer(app);
//----VIEW ENGINE--------------------------------------------------------------------------------------------
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');

//-----MIDDLE WARE-------------------------------------------------------------------------------------------
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/assets", express.static('public/assets'));
app.use(bodyParser.urlencoded({ extended: false }));


server.listen(port, function (err) {
	if (err) throw err;
	console.log("Jungle is running at http://%s:%s !", port);
});
//-----ROUTE-------------------------------------------------------------------------------------------------

app.use('/', index);
//
// app.use(function (req, res) {
// 	res.render("404");
// });

module.exports = app;