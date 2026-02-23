class ScatterPlot {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerHeight: _config.containerHeight || 320,
      margin: _config.margin || { top: 20, right: 50, bottom: 60, left: 60 }
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

    
    vis.xLabel = vis.chart.append('text')
      .attr('x', vis.width / 2)
      .attr('y', vis.height + 45)
      .attr('text-anchor', 'middle')
      .text('Access to Electricity (%)');

    vis.yLabel = vis.chart.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -vis.height / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .text('Homicide Rate');

    vis.updateVis();
  }

  updateVis() {
    const vis = this;

    
    vis.xScale = d3.scaleLinear()
      .domain([0, 102])
      .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
      .domain([0, d3.max(vis.data, d => d.homicide) * 1.05])
      .nice()
      .range([vis.height, 0]);

    vis.renderVis();
  }

  renderVis() {
    const vis = this;

    // Axes
    vis.xAxis = d3.axisBottom(vis.xScale);
    vis.yAxis = d3.axisLeft(vis.yScale);

    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);

    
    const dots = vis.chart.selectAll('.dot')
      .data(vis.data, d => d.Code);

    dots.enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 6)
      .attr('fill', 'steelblue')
      .attr('opacity', 0.8)
      .merge(dots)
      .attr('cx', d => vis.xScale(d.electricity))
      .attr('cy', d => vis.yScale(d.homicide));

    dots.exit().remove();

    
    const labels = vis.chart.selectAll('.label')
      .data(vis.data, d => d.Code);

    labels.enter()
      .append('text')
      .attr('class', 'label')
      .attr('font-size', '10px')
      .merge(labels)
      .attr('x', d => vis.xScale(d.electricity) + 8)
      .attr('y', d => vis.yScale(d.homicide) + 4)
      .text(d => d.Code);

    labels.exit().remove();
  }
}

