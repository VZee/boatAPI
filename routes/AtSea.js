// Route for setting a boat to be at sea
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
router.put('/:id', (req, res) =>{
    var mySlip = {};
    var myBoat = {};
    var mysql = req.app.get('mysql');

    // get the boat's current at_sea value
    mysql.pool.query("SELECT * FROM boat WHERE boat_id = ?", req.params.id, (error, results, fields) => {
        if(error){
            console.log(error);
            res.json(error);
        }
        else{
            // there should only be 1 result
            for (var i of results){
                myBoat = new Boat(i);
            }  
            
            // check to make sure a valid object was returned
            if(!myBoat.boat_id){
                return res.status(400).send({
                    message: 'Invalid id'
                 });
            }

            // if the boat is currently at sea
            else if(myBoat.at_sea){
                return res.status(200).send({
                    message: 'Boat already at sea'
                 });
            }

            else if (!myBoat.at_sea){
                // if the boat is currently not at sea, set it to sea and update the slip that it used to be in
                var mysql = req.app.get('mysql');
                var sql = "UPDATE boat SET at_sea=? WHERE boat_id=?";
                var inserts = [true, myBoat.boat_id];
                sql = mysql.pool.query(sql, inserts, (error, results, fields) => {
                    if(error){
                        console.log(error);
                        res.json(error);
                    }
                    else{
                        res.status(200);
                        res.end();
                    }
                });
                // then update the slip that the boat used to be in
                sql = "UPDATE slip SET current_boat=?, arrival_date=? WHERE current_boat=?";
                inserts = [null, null, myBoat.boat_id];
                sql = mysql.pool.query(sql, inserts, (error, results, fields) => {
                    if(error){
                        console.log(error);
                        res.json(error);
                    }
                    else{
                        res.status(200);
                        res.end();
                    }
                });
            }
        }
        res.json(myBoat);
    });
});

module.exports = router;