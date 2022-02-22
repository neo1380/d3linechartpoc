function fetchData() {
   fetch("./assets/data.json")
  .then(response => response.json())
  .then(json => {
      console.log('building charts..');
      buildChart(json);
  });
}

function buildChart(chartData) {
  var peaks = chartData.peaks;
  const width = 800;
  const height = 600;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const intensityArr = peaks.map((item) => item.intensity);
  const maxIntensity = Math.max.apply(null, intensityArr);
  const mxArr = peaks.map((item) => item.mz);
  const maxMx = Math.max.apply(null, mxArr);
  const minMx = Math.min.apply(null, mxArr);
  const mx_domain = [minMx, maxMx];


  const svg = d3
    .select("#app")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  //prepare x-axis with mx
  const xScale = d3
    .scaleLinear()
    .domain([chartData.mzStart, chartData.mzStop])
    .range([0, width - margin.right]);
  const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format(".4n"));
  const xAxisTranslate = height - margin.top - margin.bottom;

  svg
    .append("g")
    .attr("transform", "translate(150, " + xAxisTranslate + ")")
    .call(xAxis);

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" +
        (width / 2 + margin.left) +
        " ," +
        (height - margin.bottom + margin.top) +
        ")"
    )
    .style("text-anchor", "middle")
    .text("Mass-to-Charge");

  //prepare y axisd
  const yScale = d3
    .scaleLinear()
    .domain([0, maxIntensity])
    .range([height - margin.bottom - margin.top, 0]);
  const yAxis = d3.axisLeft().scale(yScale).tickFormat(d3.format(".1e"));

  svg.append("g").attr("transform", "translate(100,0)").call(yAxis);

  svg
    .append("text")
    .attr(
      "transform",
      "translate(" +
        margin.left +
        " ," +
        (height / 2 + margin.left + margin.top) +
        ") rotate(270)"
    )
    .style("text-anchor", "middle")
    .text("Intensity");
    
  svg
    .append("path")
    .datum(peaks)
    .attr("fill", "none")
    .attr("stroke", "#f781bf")
    .attr("stroke-width", 1.5)
    .attr("transform", "translate(150,0)")
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return xScale(d.mz);
        })
        .y(function (d) {
          return yScale(d.intensity);
        })
    );
}

fetchData();
