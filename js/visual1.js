class HomicideBarChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerHeight: _config.containerHeight || 280,
      margin: _config.margin || { top: 20, right: 15, bottom: 90, left: 55 }
    };
    this.data = _data;
    this.initVis();
  }

  initVis() {
    const vis = this;

    vis.config.containerWidth =
      d3.select(vis.config.parentElement).node().getBoundingClientRect().width;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.svg = d3.select(vis.config.parentElement)
      .append('svg')
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.xAxisG = vis.chart.append('g')
      .attr('transform', `translate(0,${vis.height})`);

    vis.yAxisG = vis.chart.append('g');

    vis.updateVis();
  }

  updateVis() {
    const vis = this;

    vis.xScale = d3.scaleBand()
      .domain(vis.data.map(d => d.Code))
      .range([0, vis.width])
      .padding(0.2);

    vis.yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom(vis.xScale);
    vis.yAxis = d3.axisLeft(vis.yScale).ticks(5);

    vis.renderVis();
  }

  renderVis() {
    const vis = this;

    vis.xAxisG.call(vis.xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-45)")
      .attr("dx", "-0.6em")
      .attr("dy", "0.2em");

    vis.yAxisG.call(vis.yAxis);

    const bars = vis.chart.selectAll('.bar')
      .data(vis.data, d => d.Code);

    bars.enter()
      .append('rect')
      .attr('class', 'bar')
      .merge(bars)
      .attr('x', d => vis.xScale(d.Code))
      .attr('width', vis.xScale.bandwidth())
      .attr('y', d => vis.yScale(d.rate))
      .attr('height', d => vis.height - vis.yScale(d.rate));

    bars.exit().remove();
  }
}