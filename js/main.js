console.log("Hello world");
let data, visual1, visual2,choloreth;

Promise.all([
  d3.csv('data/homicide_rate.csv'),
  d3.csv('data/access_electric.csv')
]).then(([homicideData, electricData]) => {


  homicideData.forEach(d => {
    d.Year = +d.Year;
    d.rate = +d.rate;
  });

  const homicide2022 = homicideData
    .filter(d => d.Year === 2022 && d.Code && !isNaN(d.rate));

  const homicideTop = homicide2022
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 25);

  renderHomicideBarChart(homicideTop, '#chart1');



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
    .slice(0, 25);

  renderElectricityBarChart(electricTop, '#chart2');
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
