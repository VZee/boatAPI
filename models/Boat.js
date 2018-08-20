//Name: Louisa Katlubeck
//Description: Create the model for the boat
// Sources: OSU CS290, OSU CS340, https://expressjs.com/en/guide/routing.html,
// https://stackoverflow.com/questions/19619936/how-to-separate-the-routes-and-models-from-app-js-using-nodejs-and-express,
// http://timjrobinson.com/how-to-structure-your-nodejs-models-2/, http://krakenjs.com/,
// http://fredkschott.com/post/2014/01/node-js-cookbook---constructors-and-custom-types/,
// https://stackoverflow.com/questions/2559318/how-to-check-for-an-undefined-or-null-variable-in-javascript/2559513#2559513,

class Boat {
    constructor(newBoat) {
        this.boat_id = newBoat.boat_id || null;
        this.name = newBoat.name || null;
        this.type = newBoat.type || null;
        this.length = newBoat.length || null;
        this.at_sea = newBoat.at_sea || null;
    }
}

module.exports = Boat;