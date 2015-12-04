// first select the chart container
d3.select('.chart')
	// initiate  data by defining the selection we will join data
	.selectAll('div')
	// join data to the above selection
	.data(data)
	// represents data for missing divs
	.enter()
	.append('div')
	// each bar chart is now bound to the data
	.style('width', function(d) {
		// set dimensions of each bar based on its data
		// to complete width of each bar
		return x(d) + "px";
	})
	// produce a label
	.text(d => {
		return d;
	});