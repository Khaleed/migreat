'use strict';

let d3 = require('d3');
// turn GeoJSON into screen coordinates
// the result is not tied down to a particular tiled map
require('d3-geo-projection/d3.geo.projection.js'); // d3.geo will contain all extended pieces
let worldMap = require('../../../../data/test-world-map.json');
let topojson = require('topojson');
let isoCountries = require("i18n-iso-countries");

// let isoCountries = require('npm i i18n-iso-countries');
// define size of the map
let width = 960,
	height = 580;

// set svg window
let svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

let color = d3.scale.category10();

//set up the view of the map
let projection = d3.geo.kavrayskiy7()
	.scale(170)
	.translate([width /2, height / 2])
	.precision(0.1)

// path generator to identify a project type
let path = d3.geo.path()
	.projection(projection);

let graticule = d3.geo.graticule();

let countriesJSON = topojson.feature(worldMap, worldMap.objects.countries).features;



// draw the map by loading world map coordinates in the form of topoJSON
// act on the all path elems in the graphic
// countries.selectAll("path")
// 	.data(countriesJSON)
// 	// add it to data that is being displayed
// 	.enter()
// 	// then append that data as paths
// 	.append("path")
// 	.attr("d", path);

// let svgCentroids = svg.selectAll('circle')
// 	.data(countriesJSON)
// 	.enter()
// 	.append('circle')
// 	.attr('cx', d => path.centroid(d)[0])
// 	.attr('cy', d => path.centroid(d)[1])
// 	.attr('r', 1);
// Returns a MultiLineString geometry object 
// representing all meridians and parallels for this graticule.

// line
let line = svg.append('path')
	.datum(graticule)
	.attr('class', 'graticule')
	.attr('d', path)

let title = svg.append("text")
	.attr("x", width / 2)
	.attr("y", height * 3 / 5);

let country = svg.selectAll(".destination-country")
	.data(countriesJSON)
	.enter()
	.insert('path', ".graticule")
	.attr('class', 'destination-country')
	.attr('d', path);




// 	title.text(isoCountries.getName(countriesJSON[i].id, 'en'));

