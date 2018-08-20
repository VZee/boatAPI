// Name: Louisa Katlubeck
// Description: Javascript file for the Boat Slip API

// Variable set up
var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();

app.set('mysql', mysql);
app.set('port', process.argv[2] || 8080);

// Use bodyParser as middleware for post
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create JSON parser
var jsonParse = bodyParser.json();

'use strict';

// Create the models
var Boat = require('./models/Boat');
var Slip = require('./models/Slip');

// Create the routes
var boatRoute = require('./routes/Boat');
var slipRoute = require('./routes/Slip');
var boatDetailsRoute = require('./routes/BoatDetails');
var arrivalRoute = require('./routes/Arrival');
var atSeaRoute = require('./routes/AtSea');

// Set up routes
app.use('/boat', boatRoute);
app.use('/boatdetails', boatDetailsRoute);
app.use('/slip', slipRoute);
app.use('/arrival', arrivalRoute);
app.use('/atsea', atSeaRoute);

// Set up 404, 403, and 500 errors
app.use(function (req, res) {
    res.status(404);
});

app.use(function (err, req, res) {
    console.error(err.stack);
    res.status(403);
});

app.use(function (err, req, res) {
    console.error(err.stack);
    res.status(500);
});

process.on('uncaughtException', function (err) {
    console.log(err);
}); 

// Run
app.listen(app.get('port'), function () {
    console.log('Express started on port ' + app.get('port') + '; press Ctrl-C to terminate.');
});
