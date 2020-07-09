var svgWidth = 900;
var svgHeight = 600;
var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};
var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    d3.csv("/assets/data/data.csv").then(function(chartData) {
        chartData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(chartData, d=>d.poverty)*0.9, d3.max(chartData, d => d.poverty)*1.2])
            .range([0, width]);
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.healthcare)*1.2])
            .range([height, 0]);
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .style("font-size", "16px")
            .call(bottomAxis);
        chartGroup.append("g")
            .style("font-size", "16px")
            .call(leftAxis);
        chartGroup.selectAll("circle")
            .data(chartData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", 12)
            .attr("fill", "green")
            .attr("opacity", ".5");
        chartGroup.selectAll("text.text-circles")
            .data(chartData)
            .enter()
            .append("text")
            .classed("text-circles",true)
            .text(d => d.abbr)
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .attr("dy",5)
            .attr("text-anchor","middle")
            .attr("font-size","12px")
            .attr("fill", "white");
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 30 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .classed("aText", true)
            .text("Healthcare (%)");
        chartGroup.append("text")
            .attr("y", height + margin.bottom/2 - 10)
            .attr("x", width / 2)
            .attr("dy", "1em")
            .classed("aText", true)
            .text("Poverty Rate (%)");
    });
