// Louisa Katlubeck
// Routes for slip
// Sources: OSU CS290, OSU CS340, https://expressjs.com/en/guide/routing.html,
// https://stackoverflow.com/questions/19619936/how-to-separate-the-routes-and-models-from-app-js-using-nodejs-and-express,
// http://timjrobinson.com/how-to-structure-your-nodejs-models-2/, http://krakenjs.com/, https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4,
// https://stackoverflow.com/questions/39328295/what-does-mean-in-node-js, https://stackoverflow.com/questions/34835940/chain-multiple-node-http-request,
// https://stackoverflow.com/questions/35864088/how-to-send-error-http-response-in-express-node-js

// Variable setup

const Slip = require('../models/Slip');
const Boat = require('../models/Boat');
const express = require('express');
const router = express.Router();

// GET details of the boat in a given slip
router.get('/:id', (req, res) => {
    var mySlip = {};
    var myBoat = {};
    var mysql = req.app.get('mysql');

    // get the slip
    mysql.pool.query("SELECT slip_id, current_boat FROM slip WHERE slip_id = ?", req.params.id, (error, results, fields) => {
        if(error){
            console.log(error);
            res.json(error);
        }
        else{
            // there should only be 1 result
            for (var i of results){
                mySlip = new Slip(i);
            }   
            // check to make sure a valid object was returned
            if(!mySlip.slip_id){
                return res.status(400).send({
                    message: 'Invalid id'
                 });
            }

            // make sure there is a boat in the slip
            if(!mySlip.current_boat){
                return res.status(400).send({
                    message: 'No boat in the specified slip'
                 });
            }
            // now that we know we have a boat in the slip, get the boat details
            else{ 
                mysql.pool.query("SELECT * FROM boat WHERE boat_id = ?", mySlip.current_boat, (error, results, fields) => {
                    if(error){
                        console.log(error);
                        res.json(error);
                    }
                    else{
                        // there should only be 1 result
                        for (var i of results){
                            myBoat = new Boat(i);
                        }  
                        res.json(myBoat);
                    }
                });
            }
        }
    });
});

module.exports = router;