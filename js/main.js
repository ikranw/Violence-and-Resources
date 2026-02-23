console.log("Hello world");
let data, visual1, visual2,choloreth;

d3.csv('data/homicide_rate.csv')
  .then(_data => {
  	console.log('Data loading complete. Work with dataset.');
  	data = _data;
    console.log(data);

  
    data.forEach(d => { 
      	d.year = "2022";
        d.rate = +d.rate;

  	});

  	// Create an instance (for example in main.js)
		timelineCircles = new TimelineCircles({
			'parentElement': '#timeline',
			'containerHeight': 1100,
			'containerWidth': 1000
		}, data);

})
.catch(error => {
    console.error('Error:');
    console.log(error);
});


/**
 * Event listener: use color legend as filter
 */
d3.selectAll('.legend-btn').on('click', function() {
  console.log("button! ");
  // Toggle 'inactive' class
  d3.select(this).classed('inactive', !d3.select(this).classed('inactive'));
  
  // Check which categories are active
  let selectedCategory = [];
  d3.selectAll('.legend-btn:not(.inactive)').each(function() {
    selectedCategory.push(d3.select(this).attr('category'));
  });

  // Filter data accordingly and update vis
  timelineCircles.data = data.filter(d => selectedCategory.includes(d.category)) ;
  timelineCircles.updateVis();

});

function computeDays(disasterDate){
  	let tokens = disasterDate.split("-");

  	let year = +tokens[0];
  	let month = +tokens[1];
  	let day = +tokens[2];

    return (Date.UTC(year, month-1, day) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000 ;

  }
