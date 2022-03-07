// import * as d3 from "d3";
/*global d3*/

async function drawBars() {

    const data = await d3.json("./data/my_weather_data.json")

    const drawHistogram = metric => {

        const xAccessor = d => d[metric];
        const yAccessor = d => d.length
        // console.log(xAccessor(data[0]))

        const width = 600
        const dims = {
            width,
            height: width * 0.6,
            margin: {
                top: 30,
                right: 10,
                bottom: 50,
                left: 50,
            },
        }

        dims.boundedWidth = dims.width -
            dims.margin.left - dims.margin.right
        dims.boundedHeight = dims.height -
            dims.margin.top - dims.margin.bottom


        const wrapper = d3.select("#wrapper")
            .append("svg")
            .attr("width", dims.width)
            .attr("height", dims.height)
            .style("padding", "40px")
            

        const bounds = wrapper.append("g")
            .style("transform", `translate(${
            dims.margin.left
        }px, ${
            dims.margin.top
        }px)`)

        //create scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, xAccessor))
            .range([0, dims.boundedWidth])
            .nice()

        const binGenerator = d3.bin()
            .domain(xScale.domain())
            .value(xAccessor)
            .thresholds(12)

        const bins = binGenerator(data)
        // console.log(bins)

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, yAccessor)])
            .range([dims.boundedHeight, 0])
            .nice()


        const binsGroup = bounds.append("g")

        const binGroups = binsGroup.selectAll("g")
            .data(bins)
            .join("g")

        const barPadding = 1
        const barRect = binGroups.append("rect")
            .attr("x", d => xScale(d.x0) + barPadding / 2)
            .attr("y", d => yScale(yAccessor(d)))
            .attr("width", d => d3.max([
                0,
                xScale(d.x1) - xScale(d.x0) - barPadding
            ]))
            .attr("height", d => dims.boundedHeight - yScale(yAccessor(d)))
            .attr("fill", "skyblue")

        const barText = binGroups.filter(yAccessor)
            .append("text")
            .attr("x", d => xScale(d.x0) + (xScale(d.x1) -
                xScale(d.x0)
            ) / 2)
            .attr("y", d => yScale(yAccessor(d)) - 5)
            .text(yAccessor)
            .style("text-anchor", "middle")
            .style("fill", "darkgrey")
            .style("font-size", "12px")
            .style("font-family", "monospace")

        const mean = d3.mean(data, xAccessor)
        console.log(mean)

        const meanLine = bounds.append("line")
            .attr("x1", xScale(mean))
            .attr("x2", xScale(mean))
            .attr("y1", -15)
            .attr("y2", dims.boundedHeight)
            .attr("stroke", "maroon")
            .style("stroke-dasharray", "3px 3px")

        const meanLabel = bounds.append("text")
            .attr("x", xScale(mean))
            .attr("y", -20)
            .text("mean")
            .style("text-anchor", "middle")
            .attr("fill", "maroon")
            .attr("font-size", "12px")
            .style("font-family", "monospace")

        const axisGenerator = d3.axisBottom()
            .scale(xScale)

        const xAxis = bounds.append("g")
            .call(axisGenerator)
            .style("transform", `translateY(${dims.boundedHeight}px)`)

        const xAxisLabel = xAxis.append("text")
            .text(metric)
            .attr("fill", "black")
            .attr("x", dims.boundedWidth / 2)
            .attr("y", dims.margin.bottom - 10)
            .style("font-size", "1.4em")
            .style("font-family", "monospace")


        


        
    }
    
    const metrics = [
            "windSpeed",
            "moonPhase",
            "dewPoint",
            "windGust",
            "humidity",
            "windBearing",
            "uvIndex",
            "visibility",
            "temperatureMin",
            "temperatureMax"
        ]
    
metrics.forEach(drawHistogram)

}

drawBars()
