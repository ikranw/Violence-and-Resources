console.log("Hello world");
let data, visual1, visual2, visual3, choloreth;

const map_year = 2020;
const plot_year = 2019;


Promise.all([
  d3.csv('data/homicide_rate.csv'),
  d3.csv('data/access_electric.csv'),
  d3.json('data/world.geojson'),
  d3.csv('data/homicide_all.csv'),
  d3.csv('data/elecrtric_all.csv')
]).then(([homicideData, electricData, worldGeo, homicideAll, electricAll]) => {

   homicideAll.forEach(d => {
    d.Year = +d.Year;
    d.hrate = +d.hrate;
  });

  electricAll.forEach(d => {
    d.Year = +d.Year;
    d.share = +d.share;
  });

  homicideData.forEach(d => {
    d.Year = +d.Year;
    d.rate = +d.rate;
  });

  const homicide2022 = homicideData
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
);



  electricData.forEach(d => {
    d.Year = +d.Year;
    d["Share of the population with access to electricity"] =
      +d["Share of the population with access to electricity"];
  });

  const electric2023 = electricData
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
  );

  const electric2019Map = new Map(
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
  new ScatterPlot({ parentElement: '#chart3', containerHeight: 280 }, plotData);

  const homicideMap = new Map(
      homicideAll
        .filter(d => d.Year === map_year && d.Code && !isNaN(d.hrate))
        .map(d => [d.Code.trim(), d.hrate])
    );

  const electricityMap = new Map(
      electricAll
        .filter(d => d.Year === map_year && d.Code && !isNaN(d.share))
        .map(d => [d.Code.trim(), d.share])
    );

  d3.select('#map1').selectAll('*').remove();
  d3.select('#map2').selectAll('*').remove();

   new ChoroplethMap(
      { parentElement: '#map1', containerHeight: 380 },
      worldGeo,
      homicideMap,
      d3.interpolateReds,
      'Homicide rate per 100,000 people'
    );

  new ChoroplethMap(
      { parentElement: '#map2', containerHeight: 380 },
      worldGeo,
      electricityMap,
      d3.interpolatePurples,
      '% of population with access to electricity'
    );
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
