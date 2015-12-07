"use strict";
// practice learning d3 charts
let d3 = require('d3');

// let data = [4, 8, 15, 16, 23, 42];
let margin = {
	top: 20,
	right: 30,
	bottom: 30,
	left: 40
};

let width = 960 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

// a function that returns scaled display value
// e.g. input of 4 returns 40
let x = d3.scale.ordinal()
	.rangeRoundBands([0, width], .1);

let y = d3.scale.linear() // map from an input domain to an output range
	.range([height, 0]);

let xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom');

let yAxis = d3.svg.axis()
	.scale(y)
	.orient('left')
	.ticks(10, "%");

let chart = d3.select('.chart')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function coerceDataType(d) {
	d.frequency = +d.frequency; // coerce to number
	return d;
}

d3.tsv("letterdata.tsv", coerceDataType, (error, data) => {

	x.domain(data.map(d => {
		return d.letter;
	}));

	y.domain([0, d3.max(data, d => {
		console.log("d", d);
		return d.frequency;
	})]);

	chart.append('g')
		.attr('class', "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	chart.append('g')
		.attr('class', "y axis")
		.call(yAxis)
		.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

	chart.selectAll(".bar")
		.data(data)
		.enter()
		.append('rect')
		.attr('class', 'bar')
		.attr('x', d => {
			return x(d.letter);
		})
		.attr('width', x.rangeBand())
		.attr('y', d => {
			return y(d.frequency);
		})
		.attr('height', d => {
			return height - y(d.frequency)
		});

});