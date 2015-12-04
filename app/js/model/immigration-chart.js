"use strict";
// practice learning d3 charts
let d3 = require('d3');

let data = [4, 8, 15, 16, 23, 42];

let width = 420;
let barHeight = 20;

// a function that returns scaled display value
// e.g. input of 4 returns 40
let x = d3.scale.linear()		// map from an input domain to an output range
	.domain([0, d3.max(data)]) 
	.range([0, width]);

let chart = d3.select('.chart')
	.attr('width', width)
	.attr('height', barHeight * data.length);

let bar = chart.selectAll('g')
	.data(data)
	.enter()
	.append('g')
	.attr('transform', function(d, i) { // d = data   and i = index
		console.log(d, i);
		return "translate(0," + i * barHeight + ")"; // position the bars one after the other
	});

    bar.append('rect')
    .attr('width', x) // don't understand usage of x and -1
    .attr('height', barHeight-1);

    bar.append('text')
       .attr('x', function(d) {
       	    x(d) - 3;
       })
       .attr('y', function(d) {
       	   barHeight / 2
       })
       // indicates the off-set in the y-coordinate
       .attr('dy', '.35em')
       .text(function(d) {
       	    return d;
       })
// // first select the chart container
// d3.select('.chart')
// 	// initiate  data by defining the selection we will join data
// 	.selectAll('div')
// 	// join data to the above selection
// 	.data(data)
// 	// represents data for missing divs
// 	.enter()
// 	.append('div')
// 	// each bar chart is now bound to the data
// 	.style('width', function(d) {
// 		// set dimensions of each bar based on its data
// 		// to complete width of each bar
// 		return x(d) + "px";
// 	})
// 	// produce a label
// 	.text(d => {
// 		return d;
// 	});