// Louisa Katlubeck
// Route for setting a boat to arrive at a slip
// Sources: OSU CS290, OSU CS340, https://expressjs.com/en/guide/routing.html,
// https://stackoverflow.com/questions/19619936/how-to-separate-the-routes-and-models-from-app-js-using-nodejs-and-express,
// http://timjrobinson.com/how-to-structure-your-nodejs-models-2/, http://krakenjs.com/, https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4,
// https://stackoverflow.com/questions/39328295/what-does-mean-in-node-js, https://stackoverflow.com/questions/35864088/how-to-send-error-http-response-in-express-node-js

// Variable setup

const Slip = require('../models/Slip');
const Boat = require('../models/Boat');
const express = require('express');
const router = express.Router();

// Have a boat arrive - PUT
router.put('/', (req, res) => {
    var mySlip = {};
    var tempSlip = {};
    var myBoat = {};
    var mysql = req.app.get('mysql');

    tempSlip.slip_id = req.body.slip_id;
    tempSlip.arrival_date = req.body.arrival_date;

    mysql.pool.query("SELECT * FROM boat WHERE boat_id = ?", req.body.boat_id, (error, results, fields) => {

        if (error) {
            console.log(error);
            res.json(error);
        }
        else {
            // there should only be 1 result
            for (var i of results) {
                myBoat = new Boat(i);
            }

            // check to make sure a valid object was returned
            if (!myBoat.boat_id) {
                return res.status(400).send({
                    message: 'Invalid id'
                });
            }

            // check to make sure the boat is at_sea
            if (!myBoat.at_sea) {
                return res.status(403).send({
                    message: 'Forbidden - boat not at sea'
                });
            }

            // only continue if the boat is currently at_sea
            else if (myBoat.at_sea) {
                var mysql = req.app.get('mysql');
                // get the requested slip
                mysql.pool.query("SELECT * FROM slip WHERE slip_id = ?", tempSlip.slip_id, (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        res.json(error);
                    }
                    else {
                        // there should only be 1 result
                        for (var i of results) {
                            mySlip = new Slip(i);
                        }
                        // check to make sure a valid object was returned
                        if (!mySlip.slip_id) {
                            return res.status(400).send({
                                message: 'Invalid id'
                            });
                        }
                        // check to make sure the slip is currently empty
                        if (mySlip.current_boat){
                            return res.status(403).send({
                                message: 'Forbidden - slip is not currently empty'
                            });
                        }
                        // only continue if the requested slip is currently empty
                        else if (!mySlip.current_boat) {
                            // set the boat to not be to sea
                            var mysql = req.app.get('mysql');
                            var sql = "UPDATE boat SET at_sea=? WHERE boat_id=?";
                            var inserts = [false, myBoat.boat_id];
                            sql = mysql.pool.query(sql, inserts, (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                    res.json(error);
                                }
                                else {
                                    res.status(200);
                                    res.end();
                                }
                            });
                            // update the slip
                            sql = "UPDATE slip SET current_boat=?, arrival_date=? WHERE slip_id=?";
                            inserts = [myBoat.boat_id, tempSlip.arrival_date, tempSlip.slip_id];
                            console.log(tempSlip.boat);
                            sql = mysql.pool.query(sql, inserts, (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                    res.json(error);
                                }
                                else {
                                    res.status(200);
                                    res.end();
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

module.exports = router;