// import * as d3 from "d3";
/*global d3*/

async function drawScatter() {

  // 1. Access data
  const data = await d3.json("./data/my_weather_data.json")

  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity
  
// create dims

const width = d3.min([
  window.innerWidth * 0.9,
  window.innerHeight * 0.9,
  ])
  
  const dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50
    },
  }
  
  // dimensions.boundedWidth = dimensions.width
  // - dimensions.margin.right - dimensions.margin.left
  // dimensions.boundedHeight = dimensions.height
  // - dimensions.margin.top - dimensions.margin.bottom
  
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom
  
  //draw canvas
  
  const wrapper = d3.select("wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .style("border", "1px solid")
   
  
  
  // console.log(width)

}

drawScatter()