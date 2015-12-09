// "use strict";

let d3 = require('d3');

d3.select("body")
  .style("color", "red")

// animate using change over time

d3.select("body")
  .transition()
  .style("color", "red");

// let height = 100;
// let barWidth = 20;
// // a function that returns scaled display value
// // e.g. input of 4 returns 40
// let x = d3.scale.linear()		// map from an input domain to an output range
// 	.range([0, height]);

// let chart = d3.select('.chart')
// 	.attr('height', height);

// function coerceDataType(d) {
// 	d.value = parseInt(d.value, 10); // coerce to number
// 	return d;
// }

// d3.tsv("dummydata.tsv", coerceDataType, (error, data) => {
// 	x.domain([0, d3.max(data, d => {
// 		return d.value;
// 	})]);

// 	chart.attr('width', barWidth * data.length);

// 	let bar = chart.selectAll('g')
// 		.data(data)
// 		.enter()
// 		.append('g')
// 		.attr('transform', (d, i) => { // d = data   and i = index
// 			return "translate(" + i * barWidth + ", 0)";
// 		});

//     bar.append('rect')
//        .attr('height', function (d) {
//        	return x(d.value);
//        }) // don't understand usage of x and -1  //?
//        .attr('width', barWidth-1);

//     bar.append('text')
//        .attr('x', d => {
//        	    x(d.value) - 3;
//        })
//        .attr('y', barWidth / 2)  //?
//        // indicates the off-set in the y-coordinate
//        .attr('dy', '.35em')
//        .text(d => {
//        		return d.year + " " + d.value
//        	});
// });