"use strict";
// practice learning d3 charts
let d3 = require('d3');

// let data = [4, 8, 15, 16, 23, 42];

let width = 960;
let height = 500;

// a function that returns scaled display value
// e.g. input of 4 returns 40
let y = d3.scale.linear()		// map from an input domain to an output range
	.range([height, 0]);

let chart = d3.select('.chart')
	.attr('width', width)
	.attr('height', height);

function coerceDataType(d) {
	d.value = parseInt(d.value, 10); // coerce to number
	return d;
}

d3.tsv("dummydata.tsv", coerceDataType, (error, data) => {

	let barWidth = width/ data.length;

	y.domain([0, d3.max(data, d => {
		console.log("d", d);
		return d.value;
	})]);

	let bar = chart.selectAll('g')
		.data(data)
		.enter()
		.append('g')
		.attr('transform', (d, i) => { // d = data   and i = index
			return "translate(" + i * barWidth + ",0)"; // position the bars one after the other
		});

    bar.append('rect')
       .attr('y',d => {
       	    return y(d.value);
       })
       .attr('height', function (d) {
      	return height - y(d.value);
       }) // don't understand usage of x and -1  //?
       .attr('width', barWidth-1);

    bar.append('text')
       .attr('y', d => {
       	    return y(d.value) + 3;
       })
       .attr('x', barWidth / 2)  //?
       // indicates the off-set in the y-coordinate
       .attr('dy', '.75em')
       .text(d => {
       		return d.name + " " + d.value
       	});
});
