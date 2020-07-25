// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from census 

d3.csv("./data.csv").then(function (healthData) {
    // console.log(healthData);
    // 1. parse data/cast as numbers
    healthData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        // data.abbr = data.abbr;
        console.log(data.poverty, data.healthcare, data.abbr);
    });
    // 2. Create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([6, d3.max(healthData, d => d.poverty)])
        .range([6, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.healthcare)])
        .range([height, 0]);

    // 3. Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // 4. Append axes to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // 5. Create circles
    var circleGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", ".5");

    // 5.5 Create text group for state ABV
    // var bubbletext = chartGroup.selectAll("text")
    //     .data(healthData)
    //     .enter()
    //     .append("text");
    
    // var textLabels = bubbletext
    //     .attr("x", d => xLinearScale(d.poverty))
    //     .attr("y", d => yLinearScale(d.healthcare))
    //     .text( function (d) { return d.abbr; });
    
    chartGroup.append("g")
        .data(healthData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .text( function (d) { return d.abbr;})
        .attr("font-family", "sans-serif")
        .attr("font-size", "40px")
        .attr("fill", "black");

    
    // 6. Initialize tool tip

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.abbr}<br>Poverty %: ${d.poverty}<br>Without Healthcare %: ${d.healthcare}`);
        });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circleGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 1.5))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("% without Healthcare Insurance");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("% in Poverty");
}).catch(function (error) {
    console.log(error);
});
