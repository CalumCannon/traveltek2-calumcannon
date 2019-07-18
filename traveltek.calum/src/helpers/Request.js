const baseURL = 'http://localhost:3001/api/flights/'

export default {
  getFlights(){
    return fetch(baseURL)
    .then(res => res.json())
  },

  getFlightsFromCity(city){
    return fetch(baseURL + city)
    .then(res => res.json())
  }
}
