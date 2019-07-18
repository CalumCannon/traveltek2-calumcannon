import React, {Component} from 'react';
import Request from '../helpers/Request';

export default class Flights extends Component {

  constructor(props) {
    super(props);
    this.state ={
      flightArray: [],
      mostStopsFlight : "",
      mostDeparturesFromManchester : "",
      uniqueFlightNumbersPerDay : "",
      proportionOfBusinessClass : ""
    }
    this.handleStats = this.handleStats.bind(this);
  }

  componentDidMount(){

    Request.getFlights()
    .then(result => this.setState({flightArray : result}, () => {
      this.handleStats()
    }))

  }

  handleStats(){
    let flights = this.state.flightArray;

    //Most Stops
    this.calculateMostStops(flights)

    //Busiest dep date from MAN
    let manchesterDepartures = this.getAllDeparturesFromAirport(flights, "MAN");
    let manchesterDeparturesDates = this.mapByDate(manchesterDepartures);
    let busiestManchesterDepartureDate = this.getBusiestDepartureDate(manchesterDeparturesDates);
    this.setState({mostDeparturesFromManchester : busiestManchesterDepartureDate});

    //Different flight numbers per day
    let flightDates = this.differentFlightNumbersPerDay(flights);
    this.setState({uniqueFlightNumbersPerDay : flightDates});

    //Proportion of business class flights
    let businessClassProportion = this.calculateProportionOfBusinessClassFlights(flights);
    this.setState({proportionOfBusinessClass : JSON.stringify(businessClassProportion)});

  }

  calculateMostStops(flights){
    var maxStops = 0;
    var mostStopsFlight;
    for(var i=0; i<flights.length; i++){
    if(flights[i].segments){//if has segements
      if(flights[i].segments.segment.length > maxStops){
        maxStops = flights[i].segments.segment.length;
        mostStopsFlight = flights[i]._attributes;
        }
      }
    }

    let flightString = mostStopsFlight.carrier + " " + mostStopsFlight.depair + " to " + mostStopsFlight.destair + " " + maxStops + " stops ";
    this.setState({mostStopsFlight : flightString })
  }

  getAllDeparturesFromAirport(flights,airport){
    var flightsFromAirport = [];

    for(var i=0; i<flights.length; i++){
      if(flights[i]._attributes.depair == airport){
        console.log("Flight found for ", airport);
        flightsFromAirport.push(flights[i]);
      }
    }

    console.log(flightsFromAirport);
    return flightsFromAirport;
  }

  mapByDate(flightArray){
    var hashMap = new Map();// {}
      for(var i=0; i<flightArray.length; i++){
        var date = flightArray[i]._attributes.indepartdate;
        if(hashMap[date] == null){
          //add one??
          hashMap[date] = 1;
        }else{
          //create new
          hashMap[date] += 1;
        }
      }
      //console.log(hashMap);
      return hashMap;
  }

  differentFlightNumbersPerDay(flights){
    //change to datesMap
    let datesArray = this.mapByDate(flights);
    console.log("date array", datesArray);
    let hashMap = {};

    //FOR EACH DATE
    for(var i in datesArray){
      //GET DATE
      let date = Object.keys(datesArray).find(key => datesArray[key] === datesArray[i]);
      hashMap[date] = 0;
      //Flight numbers for date
      let flightNums = [];
      //LOOP ALL FLIGHTS
      for(var j=0; j<flights.length; j++){
        //IF FLIGHTs DATE == date
        if(flights[j]._attributes.indepartdate == date){

          let flightNumber =  flights[j]._attributes.inflightno;
          //CHECK IF FLIGHTS NUM IS UNIQUE
          if(!flightNums.includes(flightNumber)){
            //add one too date key
            flightNums.push(flightNumber);
            hashMap[date] += 1;

          }
        }
      }
    }
    //console.log(hashMap);
    return this.formatUniqueFlightNumsPerDay(hashMap);
    //return hashMap;
  }

  formatUniqueFlightNumsPerDay(hashMap){

    let uniqueFlightNumbersPerDayArray = [];
      for(var i in hashMap){

        if(Object.keys(hashMap).find(key => hashMap[key] === hashMap[i]).length  > 0){
            uniqueFlightNumbersPerDayArray.push("Date: " + Object.keys(hashMap).find(key => hashMap[key] === hashMap[i]) + " Flight Nums: " +  hashMap[i] + '  ');
        }

      }

      return uniqueFlightNumbersPerDayArray;
  }

  calculateProportionOfBusinessClassFlights(flights){
    //get all flights that have business
    let businessClassFlights = [];
    for(var i=0; i<flights.length; i++){
      if(flights[i]._attributes.inflightclass == "Business"){
        businessClassFlights.push(flights[i]);
      }
    }
   //total / businessClassCount = proportion??? check this
   let proportion = flights.length / businessClassFlights.length;
   //console.log(proportion);
   return Math.round(proportion);
  }

  getBusiestDepartureDate(flights){
    //Find busiest date, return string
    let max = 0;
    let busiestDay = null;

    for (var i in flights){
      if(flights[i] > max){
        max = flights[i]
        busiestDay = flights[i]
        //console.log(flights[i]);
      }
    }
      return Object.keys(flights).find(key => flights[key] === max) + " with " + max + " departures";
  }

  //OTHER STAT!

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
      <p>INTERESTING STAT </p>
      <p> Different flight numbers per day  </p>
        <ul className="list">
          {testArray.map((value, index) => {
            return <li key={index}>{value}</li>
          })}
        </ul>

      </div>
    )
  }
}
