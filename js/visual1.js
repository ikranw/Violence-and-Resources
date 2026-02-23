function renderHomicideBarChart(data, parentElement) {

  // Clear anything that was there before
  d3.select(parentElement).selectAll('*').remove();

  const margin = { top: 20, right: 15, bottom: 90, left: 55 };
  const width = 540 - margin.left - margin.right;
  const height = 380 - margin.top - margin.bottom;

  const svg = d3.select(parentElement)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // X: country codes
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.Code))
    .range([0, width])
    .padding(0.2);

  // Y: homicide rate (0 to 100)
  const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);

  // Axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).ticks(5);

  svg.append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-45)")
    .attr("dx", "-0.6em")
    .attr("dy", "0.2em");

  svg.append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis);

  // Bars
  svg.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.Code))
    .attr('width', xScale.bandwidth())
    .attr('y', d => yScale(d.rate))
    .attr('height', d => height - yScale(d.rate));
}