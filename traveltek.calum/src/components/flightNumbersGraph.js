import React, {Component} from 'react';
import Request from '../helpers/Request';

import CanvasJSReact from './canvasjs-2.3.2/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


var dataPoints = [];
class FlightNumbersGraph extends Component {

  render() {
		const options = {
			theme: "light2",
			title: {
				text: "Flight numbers per day"
			},
			axisY: {
				title: "Flight Numbers",
				prefix: "",
				includeZero: false
			},
			data: [{
				type: "line",
				xValueFormatString: "MMM YYYY",
				yValueFormatString: "$#,##0.00",
				dataPoints: dataPoints
			}]
		}
		return (
		<div>
			<CanvasJSChart options = {options}
				 onRef={ref => this.chart = ref}
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}

	componentDidUpdate(){
		var chart = this.chart;
    var data = this.props.dataIn;
    console.dir(this.props.dataIn);

    //"Date: 2018-01-08 Flight Nums: 45  "

    for (var i in data) {
      let date = Object.keys(this.props.dataIn).find(key => this.props.dataIn[key] === this.props.dataIn[i]);
      console.log(date);
			dataPoints.push({
				x: new Date(date),
				y: data[date]
			});
	}
  chart.render();
}
}



export default FlightNumbersGraph;
