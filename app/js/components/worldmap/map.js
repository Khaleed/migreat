'use strict';

let d3 = require('d3');
// turn GeoJSON into screen coordinates
// the result is not tied down to a particular tiled map
require('d3-geo-projection')(d3); // d3.geo will contain all extended pieces
let worldMap = require('../../../../data/world_map.json')
let topojson = require('topojson');
// define size of the map
let width = 1000,
	height = 600;
// set svg window
let svg = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

let boundary = svg.append("g")
	.attr("id", "boundary");
// 
let countries = svg.append("g")
	.attr("id", "countries");

//set up the view of the map
let projection = d3.geo.robinson()
	.scale(150)
	// center(longitude, latitude)
	.center([0, 27])
	.rotate([-100, 0])
	.translate([width / 2, height / 2]);
// path generator to identify a project type
let path = d3.geo.path()
	.projection(projection);
// add boundaries
let boundaryFeature = {
	type: "Feature",
	geometry: {
		type: "Polygon",
		coordinates: [
			[
				[-180, 89.99],
				[180, 89.99],
				[180, -89.99],
				[-180, -89.99],
				[-180, 89.99]
			]
		]
	}
}
// draw the map by loading world map coordinates in the form of JSON
d3.json(worldMap, json => {
	boundary
		.append("path")
		.datum(boundaryFeature)
		.attr("d", path);
	// act on the all path elems in the graphic
	countries.selectAll("path")
		.data(json.features)
		// add it to data that is being displayed
		.enter()
		// then append that data as paths
		.append("path")
		.attr("d", path);
});

// zooming and panning a map
// behaviour acts as event listeners
let zoom = d3.behavior.zoom()
    .on("zoom", () => {
    	countries.attr("transform","translate("+
    		d3.event.translate.join(",")+")scale("+d3.event.scale+")");
    	countries.selectAll("path")
    	    .attr("d", path.projection(projection));
    });

    svg.call(zoom);

