// import * as d3 from "d3";

/*global d3*/

async function drawScatter() {

    // 1. Access Data
    let dataset = await d3.json('./data/my_weather_data.json');

    const xAccessor = d => d.dewPoint
    const yAccessor = d => d.humidity
    const colorAccessor = d => d.cloudCover

    // 2. create chart dims

    const width = d3.min([
        window.innerWidth * 0.9,
        window.innerHeight * 0.9,
    ])

    let dims = {
        width: width,
        height: width,
        margin: {
            top: 10,
            right: 10,
            bottom: 50,
            left: 50,
        }
    }

    dims.boundedWidth = dims.width -
        dims.margin.right - dims.margin.left
    dims.boundedHeight = dims.height -
        dims.margin.top - dims.margin.bottom



    // 3. draw canvas

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dims.width)
        .attr("height", dims.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${
            dims.margin.left
        }px, ${
            dims.margin.top
        }px)`)


    //4. create scales

    const xScale = d3.scaleLinear()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dims.boundedWidth])
        .nice()

    const yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yAccessor))
        .range([dims.boundedHeight, 0])
        .nice()

    const colorScale = d3.scaleLinear()
        .domain(d3.extent(dataset, colorAccessor))
        .range(["skyblue", "darkslategrey"])
        .nice()


    // 5. Draw Data
 
        const dots = bounds.selectAll("circle")
            .data(dataset)
            
        dots.join("circle")
            .attr("cx", d => xScale(xAccessor(d)))
            .attr("cy", d => yScale(yAccessor(d)))
            .attr("r", 4)
            // .attr("fill", "cornflowerblue")
            .attr("fill", d => colorScale(colorAccessor(d)))
    
    
    // drawDots(dataset.slice(0, 100), "gray")
    // setTimeout(() => {
    //     drawDots(dataset, "cornflowerblue")
    //     }, 1000)
    
    //Draw our Peripherals
    
    const xAxisGenerator = d3.axisBottom()
        .scale(xScale)
        
    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${
            dims.boundedHeight
        
        }px)`)
        
    const xAxisLabel = xAxis.append("text")
        .attr("x", dims.boundedWidth / 2)
        .attr("y", dims.margin.bottom - 10)
        .html("Dew Point (&deg;F)")
        .style("font-size", "1.4em")
        .attr("fill", "black")
        
        
    const yAxisGenerator = d3.axisLeft()
        .scale(yScale)
        .ticks(6)
        
    const yAxis = bounds.append("g")
        .call(yAxisGenerator)
        
        
        
    const yAxisLabel = yAxis.append("text")
        .attr("x", -dims.boundedHeight / 2)
        .attr("y", -dims.margin.left + 10)
        .style("transform", "rotate(-90deg")
        .style("text-anchor", "middle")
        .html("Relative Humidity")
        .style("font-size", "1.4em")
        .attr("fill", "black")
        
    
        
        
}

drawScatter()
