class ElectricityBarChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerHeight: _config.containerHeight || 280,
      margin: _config.margin || { top: 20, right: 15, bottom: 90, left: 55 }
    };
    this.data = _data;
    this.percent = _config.resourceKey || "Share of the population with access to electricity";
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
        .text(vis.config.yLabel || '% of population');

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
    

    vis.brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on('end', (event) => {
                if (!event.selection) {
                window.selectedCodes = null;
                } else {
                const [x0, x1] = event.selection;
        
                window.selectedCodes = new Set(
                    vis.data
                    .filter(d => {
                        const cx = vis.xScale(d.Code) + vis.xScale.bandwidth() / 2;
                        return cx >= x0 && cx <= x1;
                    })
                    .map(d => d.Code)
                );
                }
                
                document.dispatchEvent(new CustomEvent('brushed', { detail: window.selectedCodes }));
            });
    
    vis.brushG = vis.chart.append('g').attr('class', 'brush').call(vis.brush);

    document.addEventListener('mapBrushed', (e) => {
            const selected = e.detail;
            vis.chart.selectAll('.bar')
                .attr('opacity', d => !selected || selected.has(d.Code) ? 1 : 0.25);
        });
       
    vis.updateVis();
  }

  updateVis() {
    const vis = this;

    vis.xScale = d3.scaleBand()
      .domain(vis.data.map(d => d.Code))
      .range([0, vis.width])
      .padding(0.2);

    vis.yScale = d3.scaleLinear()
      .domain([0, d3.max(vis.data, d => d[vis.percent]) * 1.1 || 100])
      .nice()
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

    
    const tooltip = d3.select('#tooltip');

	const bars = vis.chart.selectAll('.bar')
		.data(vis.data, d => d.Code);

	const barsEnter = bars.enter()
		.append('rect')
		.attr('class', 'bar');

	barsEnter.merge(bars)
		.attr('x', d => vis.xScale(d.Code))
		.attr('width', vis.xScale.bandwidth())
		.attr('y', d => vis.yScale(d[vis.percent]))
		.attr('height', d => vis.height - vis.yScale(d[vis.percent]))
		.style('cursor', 'pointer')
		.on('mousemove', (event, d) => {
			event.preventDefault();
			event.stopPropagation();

			tooltip
				.style('display', 'block')
				.html(`
					<div><strong>${d.Entity}</strong> (${d.Code})</div>
			
                    <div>${d.resourceLabel || 'Value'}: <strong>${(+d[vis.percent]) >= 1000 ? d3.format(',.0f')(+d[vis.percent]) : (+d[vis.percent]).toFixed(2)}</strong> ${d.resourceUnit || ''}</div>
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