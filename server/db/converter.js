var convert = require('xml-js');
var xml = require('fs').readFileSync(__dirname +'/flighdata_A.xml', 'utf8');

var result = convert.xml2json(xml,{compact: true, spaces: 4});

//console.log(result);

const MongoClient = require('mongodb').MongoClient;
var json = JSON.parse(result);

//console.log(json.flights.flight);

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true } )
  .then((client) => {
    const db = client.db('flights_db');
    db.dropDatabase();
    const flightsCollection = db.collection('flights');

    flightsCollection.insertMany(json.flights.flight);
   //MongoClient.close();
  })
  .catch(console.error);

module.exports = result;


//use flights_db;
//db.dropDatabase();

//insert many? or insert one? reformat json?
//db.flights.insertMany([{xml}])
