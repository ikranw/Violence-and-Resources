
class ChoroplethMap {
  constructor(_config, _geoData, _valueByCode, _colorInterpolator) {
    this.config = {
      parentElement: _config.parentElement,
      containerHeight: _config.containerHeight || 380,
      margin: _config.margin || { top: 10, right: 10, bottom: 45, left: 10 }
    };

    this.geoData = _geoData;              
    this.valueByCode = _valueByCode;     
    this.colorInterpolator = _colorInterpolator;

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

    vis.projection = d3.geoMercator();
    vis.geoPath = d3.geoPath().projection(vis.projection);

    vis.projection.fitSize([vis.width, vis.height - 30], vis.geoData);

    vis.colorScale = d3.scaleSequential(vis.colorInterpolator)
      .domain([0, 100]);

    vis.updateVis();
  }

  updateVis() {
    this.renderVis();
  }

  renderVis() {
    const vis = this;
    const tooltip = d3.select('#tooltip');

    
    vis.chart.selectAll('.country')
      .data(vis.geoData.features)
      .join('path')
      .attr('class', 'country')
      .attr('d', vis.geoPath)
      .attr('fill', d => {
        const code = d.id;

        const v = vis.valueByCode.get(code);

        return (v === undefined || v === null || isNaN(v)) ? '#eee' : vis.colorScale(v);
      })
      .attr('stroke', '#999')
      .attr('stroke-width', 0.3)
      .on('mousemove', (event, d) => {
       const name = d.properties?.name || 'Unknown';
        const code = d.id;
        const v = vis.valueByCode.get(code);
        const isElectricity = vis.colorInterpolator === d3.interpolatePurples;
        const label = isElectricity ? 'Electricity Access' : 'Homicide Rate';
        const unit = isElectricity ? '%' : ' per 100k';
        const formattedVal = (v === undefined || v === null || isNaN(v))
          ? 'No data'
          : `${(+v).toFixed(1)}${unit}`;

        tooltip
          .style('display', 'block')
          .style('left', (event.clientX + window.scrollX + 12) + 'px')
          .style('top', (event.clientY + window.scrollY + 12) + 'px')
          .html(`
            <div><strong>${name}</strong> (${code})</div>
            <div>${label}: <strong>${formattedVal}</strong></div>
            <div style="font-size:10px; color:#888; margin-top:4px;">Year: ${vis.config.year || 2020}</div>
          `);
      })
      .on('mouseleave', () => tooltip.style('display', 'none'));

    vis.drawLegend();
  }

  drawLegend() {
    const vis = this;

    vis.svg.selectAll('.legend').remove();
    vis.svg.selectAll('defs').remove();

    const legendWidth = 220;
    const legendHeight = 12;

    const legendX = (vis.config.containerWidth - legendWidth) / 2;
    const legendY = vis.config.containerHeight - 28;

    const defs = vis.svg.append('defs');
    const gradientId = `legend-gradient-${vis.config.parentElement.replace('#', '')}`;

    const linearGradient = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%').attr('x2', '100%')
      .attr('y1', '0%').attr('y2', '0%');

    const stops = d3.range(0, 101, 5);
    linearGradient.selectAll('stop')
      .data(stops)
      .join('stop')
      .attr('offset', d => `${d}%`)
      .attr('stop-color', d => vis.colorScale(d));

    const legendG = vis.svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${legendX}, ${legendY})`);

    legendG.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .attr('fill', `url(#${gradientId})`)
      .attr('stroke', '#999')
      .attr('stroke-width', 0.5);

    legendG.append('text')
      .attr('x', 0)
      .attr('y', legendHeight + 14)
      .attr('font-size', 11)
      .text('0');

    legendG.append('text')
      .attr('x', legendWidth)
      .attr('y', legendHeight + 14)
      .attr('text-anchor', 'end')
      .attr('font-size', 11)
      .text('100');
  }
}