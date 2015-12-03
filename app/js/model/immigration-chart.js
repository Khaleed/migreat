"use strict";
// practice learning d3 charts
let d3 = require('d3');

let data = [4, 8, 15, 16, 23, 42];

// let body = d3.select('body');

// let div = body.append('div');

// div.html('Hello, World!')
//    .style('color', 'black')
//    .style('background-color', 'blue');

// first select the chart container
d3.select('.chart')
	// define selection to which we will join data
	.selectAll('div')
	// join data to above selection
	.data(data)
	.enter().append('div')
	.style('width', d => 
		return d * 10 + 'px'
	)
	.text(d => 
		return d
	);