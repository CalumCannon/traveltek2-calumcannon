import React, {Component} from 'react';
import Request from '../helpers/Request';
import FlightNumbersGraph from '../components/flightNumbersGraph.js'

export default class Flights extends Component {

  constructor(props) {
    super(props);
    this.state = {
      flightArray: [],
      mostStopsFlight: "",
      mostDeparturesFromManchester: "",
      uniqueFlightNumbersPerDay: "",
      proportionOfBusinessClass: "",
      longestFlight: ""
    }
    this.handleStats = this.handleStats.bind(this);
  }

  componentDidMount() {
    //Get all flights
    Request.getFlights()
      .then(result => this.setState({flightArray: result}, () => {
        this.handleStats()
      }))
  }

  handleStats() {
    let flights = this.state.flightArray;

    //Most Stops
    this.calculateMostStops(flights)

    //Busiest dep date from MAN
    let manchesterDepartures = this.getAllDeparturesFromAirport(flights, "MAN");
    let manchesterDeparturesDates = this.mapByDate(manchesterDepartures);
    let busiestManchesterDepartureDate = this.getBusiestDepartureDate(manchesterDeparturesDates);
    this.setState({
      mostDeparturesFromManchester: busiestManchesterDepartureDate
    });

    //Different flight numbers per day
    let flightDates = this.differentFlightNumbersPerDay(flights);
    this.setState({
      uniqueFlightNumbersPerDay: flightDates
    });

    //Proportion of business class flights
    let businessClassProportion = this.calculateProportionOfBusinessClassFlights(flights);
    this.setState({
      proportionOfBusinessClass: JSON.stringify(businessClassProportion)
    });

    //Longest Flight
    this.setState({
      longestFlight: this.calculateLongestFlight(flights)
    });

  }

  convertTimeToHours(time) {
    var hours;
    hours = parseFloat(time[0]) + parseFloat((time[1] / 60));
    return parseFloat(hours).toFixed(2);
  }

  calculateLongestFlight(flights) {

    var maxTime = 0;
    var longestFlight;

    for (var i = 0; i < flights.length; i++) {
      var flight = flights[i]._attributes;

      var departureTime = flight.outdeparttime;
      var arrivalTime = flight.outarrivaltime;

      if (departureTime) {
        var t1 = this.convertTimeToHours(departureTime.split(':'));
        var t2 = this.convertTimeToHours(arrivalTime.split(':'));
        var timeDelta = t2 - t1;

        if (timeDelta > maxTime) {
          maxTime = timeDelta;
          longestFlight = flights[i]._attributes;
        }
      }
    }

    var longestFlightString = longestFlight.carrier + " " + longestFlight.depair + " to " + longestFlight.destair + " " + maxTime + " Hours long ";

    return longestFlightString;
  }

  calculateMostStops(flights) {
    var maxStops = 0;
    var mostStopsFlight;

    //Loop all flights
    for (var i = 0; i < flights.length; i++) {
      if (flights[i].segments) { //if has segements

        //If current flight has more stops than previous max
        if (flights[i].segments.segment.length > maxStops) {
          maxStops = flights[i].segments.segment.length;
          mostStopsFlight = flights[i]._attributes;
        }
      }
    }

    //Generate string
    let flightString = mostStopsFlight.carrier + " " + mostStopsFlight.depair + " to " + mostStopsFlight.destair + " " + maxStops + " stops ";

    this.setState({
      mostStopsFlight: flightString
    })
  }

  getAllDeparturesFromAirport(flights, airport) {
    var flightsFromAirport = [];

    for (var i = 0; i < flights.length; i++) {
      if (flights[i]._attributes.depair == airport) {
        flightsFromAirport.push(flights[i]);
      }
    }

    return flightsFromAirport;
  }

  mapByDate(flightArray) {
    var hashMap = new Map();
    for (var i = 0; i < flightArray.length; i++) {
      var date = flightArray[i]._attributes.outdepartdate;
      if (hashMap[date] == null) {
        hashMap[date] = 1;
      } else {
        hashMap[date] += 1;
      }
    }
    return hashMap;
  }

  differentFlightNumbersPerDay(flights) {
    //change to datesMap
    let datesArray = this.mapByDate(flights);

    let hashMap = {};

    //FOR EACH DATE
    for (var i in datesArray) {
      //GET DATE
      let date = Object.keys(datesArray).find(key => datesArray[key] === datesArray[i]);
      hashMap[date] = 0;
      //Flight numbers for date
      let flightNums = [];
      //LOOP ALL FLIGHTS
      for (var j = 0; j < flights.length; j++) {
        //IF FLIGHTs DATE == date
        if (flights[j]._attributes.indepartdate == date) {

          let flightNumber = flights[j]._attributes.inflightno;
          //CHECK IF FLIGHTS NUM IS UNIQUE
          if (!flightNums.includes(flightNumber)) {
            //add one too date key
            flightNums.push(flightNumber);
            hashMap[date] += 1;

          }
        }
      }
    }
    return hashMap;
    //return this.formatUniqueFlightNumsPerDay(hashMap);

  }

  formatUniqueFlightNumsPerDay(hashMap) {

    let uniqueFlightNumbersPerDayArray = [];
    for (var i in hashMap) {
      if (Object.keys(hashMap).find(key => hashMap[key] === hashMap[i]).length > 0) {
        uniqueFlightNumbersPerDayArray.push("Date: " + Object.keys(hashMap).find(key => hashMap[key] === hashMap[i]) + " Flight Nums: " + hashMap[i] + '  ');
      }
    }

    return uniqueFlightNumbersPerDayArray;
  }

  calculateProportionOfBusinessClassFlights(flights) {
    //get all flights that have business
    let businessClassFlights = [];
    for (var i = 0; i < flights.length; i++) {
      if (flights[i]._attributes.inflightclass == "Business") {
        businessClassFlights.push(flights[i]);
      }
    }

    let proportion = flights.length / businessClassFlights.length;

    return Math.round(proportion);
  }

  getBusiestDepartureDate(flights) {
    //Find busiest date, return string
    let max = 0;
    let busiestDay = null;

    for (var i in flights) {
      if (flights[i] > max) {
        max = flights[i]
        busiestDay = flights[i]
      }
    }
    return Object.keys(flights).find(key => flights[key] === max) + " with " + max + " departures";
  }

  render(){
    var testArray =["Loading"];
    if(this.state.uniqueFlightNumbersPerDay.length != 0){
      testArray = this.state.uniqueFlightNumbersPerDay
    }


    return(
      <div>
      <div className="topBar">
      <h1>TravelTek</h1>
      </div>
      <p>Flight with the most stops {this.state.mostStopsFlight} </p>
      <p>Most departures from Manchester on the {this.state.mostDeparturesFromManchester} </p>
      <p>Proportion of business class flights {this.state.proportionOfBusinessClass} </p>
      <p>Longest flight is {this.state.longestFlight} </p>
      <h2> Different flight numbers per day  </h2>

      <div className="graphContainer">
      <FlightNumbersGraph dataIn={this.state.uniqueFlightNumbersPerDay}/>
      </div>


      </div>
    )
  }
}
