//Name: Louisa Katlubeck
//Description: Create the model for the slip
// Sources: OSU CS290, OSU CS340, https://expressjs.com/en/guide/routing.html,
// https://stackoverflow.com/questions/19619936/how-to-separate-the-routes-and-models-from-app-js-using-nodejs-and-express,
// http://timjrobinson.com/how-to-structure-your-nodejs-models-2/, http://krakenjs.com/,
// http://fredkschott.com/post/2014/01/node-js-cookbook---constructors-and-custom-types/,
// https://stackoverflow.com/questions/2559318/how-to-check-for-an-undefined-or-null-variable-in-javascript/2559513#2559513

class Slip {
    constructor(newSlip) {
        this.slip_id = newSlip.slip_id || null;
        this.number = newSlip.number || null;
        this.current_boat = newSlip.current_boat || null;
        this.arrival_date = newSlip.arrival_date || null;
    }
}

module.exports = Slip;