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
  // initiate  data by defining the selection we will join data
  .selectAll('div')
  // join data to the above selection
  .data(data)
  // represents data for missing divs
  .enter()
  // 
  .append('div')
  // each bar chart is now bound to the data
  .style('width', d => {
  	// set dimensions of each bar based on its data
  	// to complete width of each bar
  	return d * 10 + "px";
  })
  // produce a label
  .text(d => {
  	return d;
  });