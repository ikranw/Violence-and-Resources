class HomicideBarChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerHeight: _config.containerHeight || 280,
      margin: _config.margin || { top: 20, right: 15, bottom: 90, left: 55 },
      totalCountForYear: _config.totalCountForYear || 25
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
	vis.chart.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('x', -vis.height / 2)
		.attr('y', -42)
		.attr('text-anchor', 'middle')
		.attr('font-size', 11)
		.attr('fill', '#666')
		.text(vis.config.yLabel || 'Per 100,000 people');
		

    vis.xAxisG = vis.chart.append('g')
      .attr('transform', `translate(0,${vis.height})`);

    vis.yAxisG = vis.chart.append('g');

	vis.chart.append('text')
      .attr('x', vis.width / 2)
      .attr('y', vis.height + 82)
      .attr('text-anchor', 'middle')
      .attr('font-size', 11)
      .attr('fill', '#666')
      .text('Countries');


    vis.updateVis();
  }

  updateVis() {
    const vis = this;
    vis.totalCount = vis.data.length; 

    vis.xScale = d3.scaleBand()
      .domain(vis.data.map(d => d.Code))
      .range([0, vis.width])
      .padding(0.2);

    vis.yScale = d3.scaleLinear()
       .domain([0, d3.max(vis.data, d => d.rate) * 1.1 || 100])
      .nice()
      .range([vis.height, 0]);
	  
    vis.xAxis = d3.axisBottom(vis.xScale);
    vis.yAxis = d3.axisLeft(vis.yScale).ticks(5)
      .tickFormat(d => d >= 1000 ? d3.format('.2s')(d) : d);

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

    const tooltip = d3.select('#tooltip');

	const bars = vis.chart.selectAll('.bar')
		.data(vis.data, d => d.Code);

	const barsEnter = bars.enter()
		.append('rect')
		.attr('class', 'bar');

	barsEnter.merge(bars)
		.attr('x', d => vis.xScale(d.Code))
		.attr('width', vis.xScale.bandwidth())
		.attr('y', d => vis.yScale(d.rate))
		.attr('height', d => vis.height - vis.yScale(d.rate))
		.style('cursor', 'pointer')
		.on('mousemove', (event, d) => {
			event.preventDefault();
			event.stopPropagation();

			tooltip
				.style('display', 'block')
				.html(`
					<div><strong>${d.Entity}</strong> (${d.Code})</div>
				
					<div>${d.rateLabel || 'Value'}: <strong>${(+d.rate) >= 1000 ? d3.format(',.0f')(+d.rate) : (+d.rate).toFixed(2)}</strong> ${d.rateUnit || ''}</div>
					<div style="font-size:12px; color:#8B4513; margin-top:4px;">Year: ${d.Year}</div>
				`)
				.style('left', (event.clientX + window.scrollX + 12) + 'px')
				.style('top', (event.clientY + window.scrollY + 12) + 'px');
		});

	bars.exit().remove();
	d3.select('body').on('click.tooltip-hide', () => {
		tooltip.style('display', 'none');
	});
  }
}