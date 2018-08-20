// Louisa Katlubeck
// Routes for Boat
// Sources: OSU CS290, OSU CS340, https://expressjs.com/en/guide/routing.html,
// https://stackoverflow.com/questions/19619936/how-to-separate-the-routes-and-models-from-app-js-using-nodejs-and-express,
// http://timjrobinson.com/how-to-structure-your-nodejs-models-2/, http://krakenjs.com/, https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4.
// https://stackoverflow.com/questions/39328295/what-does-mean-in-node-js, https://stackoverflow.com/questions/35864088/how-to-send-error-http-response-in-express-node-js

// Variable setup
const Boat = require('../models/Boat');
const Slip = require('../models/Slip');
const express = require('express');
const router = express.Router();

// POST boat
router.post('/', (req, res) => {
    var newBoat = new Boat(req.body);
    var mysql = req.app.get('mysql');

    // Insert the boat into the db
    var sql = "INSERT INTO boat (name, type, length) VALUES (?,?,?)";
    var inserts = [newBoat.name, newBoat.type, newBoat.length];
    sql = mysql.pool.query(sql,inserts,(error, results, fields) => {
        if(error){
            console.log(error);
            res.json(error);
        }
        else{
            res.json(req.body);
        }
    });
});

// GET a specific boat
router.get('/:id', (req, res) => {
    var myBoat = {};
    var mysql = req.app.get('mysql');

    mysql.pool.query("SELECT boat_id, name, type, length, at_sea FROM boat WHERE boat_id=?", req.params.id, (error, results, fields) => {
        if(error){
            console.log(error);
            res.json(error);
        }
        else{
            for (var i of results){
                myBoat = new Boat(i);
            }
            // check to make sure a valid object was returned
            if(!myBoat.boat_id){
                return res.status(400).send({
                    message: 'Invalid id'
                 });
            }
            res.json(myBoat);
        }
    });
});

// GET all boats
router.get('/', (req, res) => {
    var myBoat = {};
    var allBoats = [];
    var mysql = req.app.get('mysql');

    mysql.pool.query("SELECT boat_id, name, type, length, at_sea FROM boat", req.params.id, (error, results, fields) => {
        if(error){
            console.log(error);
            res.json(error);
        }
        else{
            for (var i of results){
                myBoat = new Boat(i);
                allBoats.push(myBoat);
            }
            res.json(allBoats);
        }
    });
});

// DELETE a boat
router.delete('/:id', (req, res) => {
    var myBoat = {};
    var mySlip = {};
    var mysql = req.app.get('mysql');
    var myID = req.params.id;
    var sql;

    // check to see if the boat is currently in a slip
    mysql.pool.query("SELECT slip_id, arrival_date, current_boat FROM slip WHERE current_boat=?", req.params.id, (error, results, fields) => {
        if(error){
            return res.status(400).send({
                message: 'Error'
            });
        }
        else{
            // there should only be 1 result
            for (var i of results){
                mySlip = new Slip(i);
            }

            // check to see if there is a result
            if(mySlip.current_boat){
                // set that current_boat and arrival_date to null
                mysql = req.app.get('mysql');
                sql = "UPDATE slip SET current_boat=?, arrival_date=? WHERE slip_id=?";
                var inserts = [null, null, mySlip.slip_id];
                sql = mysql.pool.query(sql, inserts, (error, results, fields) => {
                    if(error){
                        return res.status(400).send({
                            message: 'Error'
                        });
                    }
                });
            }
            // delete the boat
            sql = "DELETE FROM boat WHERE boat_id = ?";
            var deletes = [myID];
            sql = mysql.pool.query(sql, deletes, (error, results, fields) => {
                if(error){
                    return res.status(400).send({
                        message: 'Error'
                    });
                }
                else{
                    // check to make sure a row was deleted
                    if(!results.changedRows){
                        return res.status(400).send({
                            message: 'Invalid id'
                        });
                    }
                    else res.status(202).end();
                }
            });
        }
    });
});

// Update a boat - PUT
router.put('/:id', (req, res) =>{
    var mysql = req.app.get('mysql');
    var sql = "UPDATE boat SET name=?, type=?, length=? WHERE boat_id=?";
    var inserts = [req.body.name, req.body.type, req.body.length, req.params.id];
    sql = mysql.pool.query(sql, inserts, (error, results, fields) => {
        if(error){
            console.log(error);
            res.json(error);
        }
        else{
            // check to make sure a row was updated
            if(!results.changedRows){
                return res.status(400).send({
                    message: 'Invalid id'
                 });
            }
            res.status(200);
            res.end();
        }
    });
});

module.exports = router;