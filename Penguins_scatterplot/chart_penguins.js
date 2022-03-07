// import * as d3 from "d3";

/*global d3*/

async function drawScatter() {

    // 1. Access Data
    let dataset = await d3.json('./penguin_data.json');
    console.log(dataset[0])
    const xAccessor = d => d.flipper_length_mm
    const yAccessor = d => d.bill_length_mm
    const colorAccessor = d => d.species_island

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

    // const colorScale = d3.scaleLinear()
    //     .domain(d3.extent(dataset, colorAccessor))
    //     .range(["skyblue", "darkslategrey"])
    //     .nice()

    const colorScale = d3.scaleOrdinal()
        .domain(d3.extent(dataset, colorAccessor))
        .range(["skyblue", "darkslategrey", "yellow", "purple", "red", "green"])


    // 5. Draw Data
var z = d3.scaleLinear()
    .domain([2000, 7000])
    .range([ 1, 6]);


    const dots = bounds.selectAll("circle")
        .data(dataset)

    dots.join("circle")
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        // .attr("r", 4)
        // .attr("fill", "cornflowerblue")
        .attr("fill", d => colorScale(colorAccessor(d)))
        .attr("r", function (d) { return z(d.body_mass_g); } )


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
        .html("Bill Length (mm)")
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
        .html("Bill Depth (mm)")
        .style("font-size", "1.4em")
        .attr("fill", "black")




}

drawScatter()

//https://github.com/ttimbers/palmerpenguins/blob/aef2d7c48466b88dcfe0832a67b0a270607f1737/inst/extdata/penguins.tsv
