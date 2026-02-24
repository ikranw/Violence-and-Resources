console.log("Hello world");
let data, visual1, visual2, visual3, choloreth;

const map_year = 2023;
const plot_year = 2023;


Promise.all([
  d3.csv('data/homicide_rate.csv'),
  d3.csv('data/access_electric.csv'),
  d3.json('data/world.geojson'),
  d3.csv('data/homicide_all.csv'),
  d3.csv('data/elecrtric_all.csv'),
 d3.csv('data/refugee_popu.csv'),
  d3.csv('data/deaths_conflict.csv'),
  d3.csv('data/Share_water.csv')
]).then(([homicideData, electricData, worldGeo, homicideAll, electricAll, refugeeAll, deathsAll, waterAll]) => {

   homicideAll.forEach(d => {
    d.Year = +d.Year;
    d.hrate = +d.hrate;
  });

  electricAll.forEach(d => {
    d.Year = +d.Year;
    d.share = +d.share;
  });

  refugeeAll.forEach(d => {
    d.Year = +d.Year;
    d.refugees = +d.refugees;
  });

  deathsAll.forEach(d => {
    d.Year = +d.Year;
    d.deaths = +d.deaths;
  });

  waterAll.forEach(d => {
    d.Year = +d.Year;
    d.water = +d.water;
  });

  homicideData.forEach(d => {
    d.Year = +d.Year;
    d.rate = +d.rate;
  });

  electricData.forEach(d => {
    d.Year = +d.Year;
    d["Share of the population with access to electricity"] =
      +d["Share of the population with access to electricity"];
  });

  function renderAll() {
    const violenceAttr   = document.querySelector('input[name="violence"]:checked').value;
    const resourcesAttr  = document.querySelector('input[name="resources"]:checked').value;
    const vDS  = DATASETS[violenceAttr];
    const rDS  = DATASETS[resourcesAttr];

    function getSrc(key) {
      return {
        homicide:    { arr: homicideAll,  vkey: 'hrate' },
        refugees:    { arr: refugeeAll,   vkey: 'refugees' },
        conflict:    { arr: deathsAll,    vkey: 'deaths' },
        electricity: { arr: electricAll,  vkey: 'share' },
        water:       { arr: waterAll,     vkey: 'water' }
      }[key];
    }

    const { arr: vArr, vkey: vKey } = getSrc(violenceAttr);
    const vAll2023 = vArr.filter(d => d.Year === 2023 && d.Code && !isNaN(d[vKey]) && d[vKey] > 0);
    const totalVCount = vAll2023.length;
    const voilence15 = vAll2023
      .sort((a, b) => b[vKey] - a[vKey])
      .slice(0, 15)
      .map(d => ({ ...d, rate: d[vKey], rateLabel: vDS.label, rateUnit: vDS.unit }));

    d3.select('#chart1').selectAll('*').remove();
    d3.select('#title-chart1').text(`${vDS.label} (2023) | Top 15`);
    d3.select('#sub-chart1').text(`${vDS.subheader}`);
    visual1 = new HomicideBarChart(
      { parentElement: '#chart1', containerHeight: 280, yLabel: vDS.unit, totalCountForYear: totalVCount },
      voilence15
    );


 /** const homicide2022 = homicideData
    .filter(d => d.Year === 2022 && d.Code && !isNaN(d.rate));

  const homicideTop = homicide2022
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 8);
   
  const homicide2019 = homicideAll.filter(d =>
  d.Year === plot_year && !isNaN(d.hrate)
);

  d3.select('#chart1').selectAll('*').remove();
  visual1 = new HomicideBarChart(
  { parentElement: '#chart1', containerHeight: 280 },
  homicideTop
); **/

    const { arr: rArr, vkey: rKey } = getSrc(resourcesAttr);
    const resource15 = rArr
          .filter(d => d.Year === 2023 && d.Code && !isNaN(d[rKey]) && d[rKey] > 0)
          .sort((a, b) => a[rKey] - b[rKey])
          .slice(0, 15)
          .map(d => ({ ...d, [rKey]: d[rKey], resourceLabel: rDS.label, resourceUnit: rDS.unit }));

    d3.select('#chart2').selectAll('*').remove();
    d3.select('#title-chart2').text(`${rDS.label} (2023) | Bottom 15`);
    d3.select('#sub-chart2').text(`${rDS.subheader}`);
    visual2 = new ElectricityBarChart(
          { parentElement: '#chart2', containerHeight: 280, resourceKey: rKey, yLabel: rDS.unit },
          resource15
    );

  /**const electric2023 = electricData
    .filter(d => d.Year === 2023 && d.Code &&
      !isNaN(d["Share of the population with access to electricity"])
    );

  const electricTop = electric2023
    .sort((a, b) =>
      b["Share of the population with access to electricity"] -
      a["Share of the population with access to electricity"]
    )
    .slice(0, 8);
  
  const electric2019 = electricAll.filter(d => d.Year === plot_year && !isNaN(d.share));
  d3.select('#chart2').selectAll('*').remove();
  visual2 = new ElectricityBarChart(
    { parentElement: '#chart2', containerHeight: 280 },
    electricTop
  );**/
    const vScatterMap = new Map(
          vArr.filter(d => d.Year === plot_year && d.Code && !isNaN(d[vKey]))
              .map(d => [d.Code.trim(), { val: d[vKey], entity: d.Entity, region: d['World region according to OWID'] || '' }])
        );
        const rScatterMap = new Map(
          rArr.filter(d => d.Year === plot_year && d.Code && !isNaN(d[rKey]))
              .map(d => [d.Code.trim(), d[rKey]])
        );

        const plotData = [];
        vScatterMap.forEach(({ val: v, entity, region }, code) => {
          const r = rScatterMap.get(code);
          if (r !== undefined) plotData.push({
            Code: code, Entity: entity, region,
            homicide: v, electricity: r,
            vLabel: vDS.label, rLabel: rDS.label,
            vUnit: vDS.unit,   rUnit: rDS.unit
          });
        });

        d3.select('#chart3').selectAll('*').remove();
        d3.select('#title-chart3').text(`${vDS.label} vs. ${rDS.label} (${plot_year})`);
        d3.select('#sub-chart3').text('Each dot is a country in the world and its data');
        new ScatterPlot(
          { parentElement: '#chart3', containerHeight: 280,
            xLabel: rDS.label, yLabel: vDS.label, dotColor: '#8B4513' },
          plotData
        );

 /** const electric2019Map = new Map(
  electricAll
      .filter(d => d.Year === plot_year && d.Code && !isNaN(d.share))
      .map(d => [d.Code.trim(), d.share])
  );

  const plotData = homicideAll
    .filter(d => d.Year === plot_year && d.Code && !isNaN(d.hrate))
    .map(d => {
    const electricity = electric2019Map.get(d.Code.trim());
    if (electricity === undefined) return null;

    return {
      Code: d.Code,
      Entity: d.Entity,
      region: d['World region according to OWID'] || '',
      homicide: d.hrate,
      electricity: electricity
    };
}).filter(d => d !== null);


  d3.select('#chart3').selectAll('*').remove();
  new ScatterPlot({ parentElement: '#chart3', containerHeight: 280 }, plotData);**/


    const homicideMap = new Map(
        //homicideAll
          //.filter(d => d.Year === map_year && d.Code && !isNaN(d.hrate))
          vArr.filter(d => d.Year === map_year && d.Code && !isNaN(d[vKey]))
          //.map(d => [d.Code.trim(), d.hrate])
            .map(d => [d.Code.trim(), d[vKey]])
          
      );

    const electricityMap = new Map(
        //electricAll
          //.filter(d => d.Year === map_year && d.Code && !isNaN(d.share))
          rArr.filter(d => d.Year === map_year && d.Code && !isNaN(d[rKey]))
          //.map(d => [d.Code.trim(), d.share])
            .map(d => [d.Code.trim(), d[rKey]])

      );

    d3.select('#map1').selectAll('*').remove();
    d3.select('#map2').selectAll('*').remove();
    d3.select('#title-map1').text(`${vDS.label} (${map_year})`);
    d3.select('#title-map2').text(`${rDS.label} (${map_year})`);

   new ChoroplethMap(
      /**{ parentElement: '#map1', containerHeight: 380 },
      worldGeo,
      homicideMap,
      d3.interpolateReds,
      'Homicide rate per 100,000 people'**/
       { parentElement: '#map1', containerHeight: 380 },
      worldGeo, homicideMap, vDS.colorScheme, `${vDS.label} (${vDS.unit})`
    );

    new ChoroplethMap(
        /**{ parentElement: '#map2', containerHeight: 380 },
        worldGeo,
        electricityMap,
        d3.interpolatePurples,
        '% of population with access to electricity'**/
        { parentElement: '#map2', containerHeight: 380 },
        worldGeo, electricityMap, rDS.colorScheme, `${rDS.label} (${rDS.unit})`
      );
  }

 d3.selectAll('input[name="violence"], input[name="resources"]')
    .on('change', renderAll);
  
  renderAll();

})

.catch(error => {
    console.error('Error:');
    console.log(error);
});



//class example below, ignore for now
/**
 * Event listener: use color legend as filter
 */
/**d3.selectAll('.legend-btn').on('click', function () {
  console.log("button! ");
  // Toggle 'inactive' class
  d3.select(this).classed('inactive', !d3.select(this).classed('inactive'));

  // Check which categories are active
  let selectedCategory = [];
  d3.selectAll('.legend-btn:not(.inactive)').each(function () {
    selectedCategory.push(d3.select(this).attr('category'));
  });

  // Filter data accordingly and update vis
  timelineCircles.data = data.filter(d => selectedCategory.includes(d.category));
  timelineCircles.updateVis();

});

function computeDays(disasterDate) {
  let tokens = disasterDate.split("-");

  let year = +tokens[0];
  let month = +tokens[1];
  let day = +tokens[2];

  return (Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000;

}**/