// import * as d3 from "d3";
/* global d3 */

async function drawLineChart() {
  const data = await d3.json("./my_weather_data.json")
  console.log(data[0])
  
//   const xAccessor = d => d.dewPoint
//   const yAccessor = d => d.humidity

}

drawLineChart()