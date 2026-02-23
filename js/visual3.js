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
      .domain([0, 105])
      .range([0, vis.width]);

    vis.yScale = d3.scaleLinear()
      .domain([0, d3.max(vis.data, d => d.homicide) * 1.05])
      .nice()
      .range([vis.height, 0]);

    vis.renderVis();
  }

  renderVis() {
    const vis = this;

    
    vis.xAxis = d3.axisBottom(vis.xScale).ticks(5);
    vis.yAxis = d3.axisLeft(vis.yScale).ticks(5);

    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);

    const tooltip = d3.select('#tooltip');

  
    const dots = vis.chart.selectAll('.dot')
      .data(vis.data, d => d.Code);

  
    const dotsEnter = dots.enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 6)
      .attr('fill', 'steelblue')
      .attr('opacity', 0.8);

    
    dotsEnter.merge(dots)
      .attr('cx', d => vis.xScale(d.electricity))
      .attr('cy', d => vis.yScale(d.homicide))
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.preventDefault();
        event.stopPropagation();

        
        tooltip
          .style('display', 'block')
          .html(`
            <div><strong>${d.Entity}</strong> (${d.Code})</div>
            <div>Electricity: ${(+d.electricity).toFixed(1)}%</div>
            <div>Homicide rate: ${(+d.homicide).toFixed(2)}</div>
          `)
          .style('left', (event.clientX + window.scrollX + 12) + 'px')
          .style('top', (event.clientY + window.scrollY + 12) + 'px');
      });

 
    dots.exit().remove();


    d3.select('body').on('click.tooltip-hide', () => {
      tooltip.style('display', 'none');
    });
  }
}