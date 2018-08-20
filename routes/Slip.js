// Louisa Katlubeck
// Routes for slip
// Sources: OSU CS290, OSU CS340, https://expressjs.com/en/guide/routing.html,
// https://stackoverflow.com/questions/19619936/how-to-separate-the-routes-and-models-from-app-js-using-nodejs-and-express,
// http://timjrobinson.com/how-to-structure-your-nodejs-models-2/, http://krakenjs.com/, https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4,
// https://stackoverflow.com/questions/39328295/what-does-mean-in-node-js, https://stackoverflow.com/questions/35864088/how-to-send-error-http-response-in-express-node-js

// Variable setup

const Slip = require('../models/Slip');
const express = require('express');
const router = express.Router();

// POST slip
router.post('/', (req, res) => {
    var newSlip = new Slip(req.body);
    var mysql = req.app.get('mysql');

    // Insert the slip into the db
    var sql = "INSERT INTO slip (number) VALUES (?)";
    var inserts = [newSlip.number];
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

// GET a slip
router.get('/:id', (req, res) => {
    var mySlip = {};
    var mysql = req.app.get('mysql');

    // get the slip
    mysql.pool.query("SELECT slip_id, number, current_boat, arrival_date FROM slip WHERE slip_id=?", req.params.id, (error, results, fields) => {
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
            res.json(mySlip);
        }
    });
});

// GET all slips
router.get('/', (req, res) => {
    var mySlip = {};
    var allSlips = [];
    var mysql = req.app.get('mysql');

    mysql.pool.query("SELECT slip_id, number, current_boat, arrival_date FROM slip", req.params.id, (error, results, fields) => {
        if(error){
            console.log(error);
            res.json(error);
        }
        else{
            for (var i of results){
                mySlip = new Slip(i);
                allSlips.push(mySlip);
            }
            res.json(allSlips);
        }
    });
});

// DELETE a slip
router.delete('/:id', (req, res) => {
    var mySlip = {};
    var mysql = req.app.get('mysql');
    var sql;

    // get the boat in the slip
    mysql.pool.query("SELECT current_boat FROM slip WHERE slip_id=?", req.params.id, (error, results, fields) => {
        if(error){
            console.log(error);
            res.json(error);
        }
        else{
            // there should only be 1 result
            for (var i of results){
                mySlip = new Slip(i);
            }
            console.log(mySlip.currentBoat);
            // check to see if there is any result
            if(mySlip.current_boat){
                // set that boat to be at sea
                mysql = req.app.get('mysql');
                sql = "UPDATE boat SET at_sea=? WHERE boat_id=?";
                var inserts = [1, mySlip.current_boat];
                sql = mysql.pool.query(sql, inserts, (error, results, fields) => {
                    if(error){
                        return res.status(400).send({
                            message: 'Error'
                         });
                    }
                });
            }
        }

        // delete the slip
        sql = "DELETE FROM slip WHERE slip_id = ?";
        var deletes = [req.params.id];
        console.log(deletes);
        
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
        })
    });
});

// Update a slip - PUT
router.put('/:id', (req, res) =>{
    var mysql = req.app.get('mysql');
    var sql = "UPDATE slip SET number=? WHERE slip_id=?";
    var inserts = [req.body.number, req.params.id];
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