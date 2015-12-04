'use strict';

let d3 = require('d3');
// turn GeoJSON into screen coordinates
// the result is not tied down to a particular tiled map
require('d3-geo-projection/d3.geo.projection.js'); // d3.geo will contain all extended pieces
let worldMap = require('../../../../data/test-world-map.json');
let topojson = require('topojson');
// let isoCountries = require('npm i i18n-iso-countries');
// define size of the map
let width = 1000,
	height = 600;
// set svg window
let svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

// let boundary = svg.append("g")  // don't why this is here
// 	.attr("id", "boundary");
let countries = svg.append("g")
	.attr("id", "countries");

//set up the view of the map
let projection = d3.geo.orthographic()
	.scale(248)
	.clipAngle(90)
// path generator to identify a project type
let path = d3.geo.path()
	.projection(projection);
// }
let countriesJSON = topojson.feature(worldMap, worldMap.objects.countries).features;
// draw the map by loading world map coordinates in the form of topoJSON
	// act on the all path elems in the graphic
	countries.selectAll("path")
		.data(countriesJSON)
		// add it to data that is being displayed
		.enter()
		// then append that data as paths
		.append("path")
		.attr("d", path);

// alternative for finding centroids
// let getCentroid = selection => {
//     get the DOM element from a D3 selection
//     you could also use "this" inside .each()
//     let element = selection.node(),
//         use the native SVG interface to get the bounding box
//         bbox = element.getBBox();
//     return the center of the bounding box
//     return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
// }
// problems with getting centroids from
// projections
let svgCentroids = svg.selectAll('circle')
	.data(countriesJSON)
  	.enter()
	.append('circle')
	.attr('cx', d => path.centroid(d)[0])
	.attr('cy', d => path.centroid(d)[1])
	.attr('r', 1);

