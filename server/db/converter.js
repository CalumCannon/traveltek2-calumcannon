var convert = require('xml-js');
var xml = require('fs').readFileSync(__dirname +'/flighdata_A.xml', 'utf8');

var result = convert.xml2json(xml,{compact: true, spaces: 4});

const MongoClient = require('mongodb').MongoClient;
var json = JSON.parse(result);

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true } )
  .then((client) => {
    const db = client.db('flights_db');
    db.dropDatabase();
    const flightsCollection = db.collection('flights');
    flightsCollection.insertMany(json.flights.flight);
  })
  .catch(console.error);

module.exports = result;
