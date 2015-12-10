"use strict";

let d3 = require("d3");
// turn GeoJSON into screen coordinates
// the result is not tied down to a particular tiled map
require("d3-geo-projection/d3.geo.projection.js"); // d3.geo will contain all extended pieces
let worldMap = require("../../../../data/test-world-map.json");
let topojson = require("topojson");
let isoCountries = require("i18n-iso-countries");
//let mockChart = require("../../../../public/d3asyncloadchart.js");

// define the size of the map
let width = 960,
	height = 500;
// set color of the map
let color = d3.scale.category20();
//set up the view of the map
let projection = d3.geo.naturalEarth()
	.scale(170)
	.translate([width / 2, height / 2])
	.precision(0.1)
// path generator to identify a project type
let path = d3.geo.path()
	.projection(projection);

// MultiLineString geometry object representing all meridians and parallels for this graticule.
let graticule = d3.geo.graticule();

let tooltip = d3.select("body").append("div").attr("class", "tooltip hidden");
// create root SVG element and append to body
let countries = d3.select("body")
	.append("svg")
	.attr("id", "d3-stuff")
	.attr("width", width)
	.attr("height", height);

let offsetL = document.body.offsetLeft+40;
let offsetT = document.body.offsetTop+20;

// create and append new elements
// SVG allows graphical objects to be defined for later reuse.
countries.append("defs")
	.append("path")
	.datum({
		type: "Sphere"
	})
	.attr("id", "sphere")
	.attr("id", path);


// The use element takes nodes from within the SVG document, and duplicates them somewhere else. 
countries.append("use")
	.attr("class", "stroke")
	.attr("xlink:href", "#sphere");

countries.append("use")
	.attr("class", "fill")
	.attr("xlink:href", "#sphere"); // refer to href attr to the xlink namespace

countries.append("path")
	.datum(graticule)
	.attr("class", "graticule")
	.attr("d", path);

// load the TopoJSON file with the coordinates for the world map
let countriesJSON = topojson.feature(worldMap, worldMap.objects.countries).features;
let neighbors = topojson.neighbors(worldMap.objects.countries.geometries);
// 
let cdata = countries.selectAll(".country")
	.data(countriesJSON)
	.enter()
	.append("g");

// tooltips
cdata.on("mousemove", function(d, i) {
		let mouse = d3.mouse(countries.node()).map(function(d) {
			return parseInt(d);
		});
		tooltip.classed("hidden", false)
			   .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
			   .html(isoCountries.getName(countriesJSON[i].id, "en"))
	})
	.on("mouseout", function(d, i) {
		tooltip.classed("hidden", true)
	});

cdata.append("path", ".graticule")
	.attr("d", path)
	.attr("class", "country")
	// 
	.style("fill", (d, i) => {
		return color(d.color = d3.max(neighbors[i], n => {
			return countriesJSON[n].color;
		}) + 1 | 0);
	});

countries.insert("path", ".graticule")
	.datum(topojson.mesh(worldMap, worldMap.objects.countries, (a, b) => { // datums set and get bound data for each selected element
		return a !== b;
	}))
	.attr("class", "boundary")
	.attr("d", path);

let svgCentroids = countries.selectAll("bar")
	.data(countriesJSON)
	.enter()
	.append('rect')
	.attr('width', 10)
	.attr('height', d => {
		//console.log(isoCountries.getName(d.id, 'en'), d.id);
		console.log(path.centroid(d));
		return 25;
	})
	.attr("x", d => path.centroid(d)[0])
	.attr("y", d => path.centroid(d)[1])
	.style("visibility", d => true ? 'visible' : 'hidden');

// for(centroid in svgCentroids){

// 	d3.geo.centroid()

// }

// 	console.log(svgCentroids);
	
// zooming and panning a map
// behaviour acts as event listeners
let zoom = d3.behavior.zoom()
    .on("zoom",function() {
        countries.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        countries.selectAll("path")  
            .attr("d", path.projection(projection)); 
});
countries.call(zoom);



// then you map that list to a function



// the code that will go into the requestAnimationFrame 
// all countries are going to finish at the same time
// what will be different will be the amount of arrows per second
// const totalArrowTime = 60 
// const migrantsPerArrow = 400;
// const velocityInDegrees = 720; 
// let migrantsPerCountry = 10000; // this is people migrating from a particular country to the USA
// let currentAnimationTime = 1; // this should be the current time - 0 when animation starts and 1 when it ends

let period = migrantsPerArrow / migrantsPerCountry // how time between each arrow launch
let arrowLifeSpan = currentAnimationTime - Math.floor(currentAnimationTime / period) * period // how long the arrow has been alive

let latSource = 45; 
let latDest = 0;
let longSource = 90;
let longDest = 0;
// pythagoras theorem
let distanceBetweenDestAndSrc = Math.sqrt(Math.pow(latSource - latDest, 2) + Math.pow(longSource - longDest, 2))
// physics vector - something pointing from one direction to another for the lat
let unitVectorFromSrcToDestLat = Math.pow(latDest - latSource, 2) / distanceBetweenDestAndSrc;
// physics vector - something pointing from one direction to another for the long
let unitVectorFromSrcToDestLong = Math.pow(longDest - longSource, 2) / distanceBetweenDestAndSrc;

let condition = arrowLifeSpan * velocityInDegrees < distanceBetweenDestAndSrc
// this will give coordinates of the arrow at any time
while (condition) {
	lat = latSource + unitVectorFromSrcToDestLat * arrowLifeSpan;
	long = longSource + unitVectorFromSrcToDestLong * arrowLifeSpan;
	drawArrowAt(lat, long)
	arrowLifeSpan += period;
}


// how to map from origins to destinations
// [US_ISO_ID]
// so you need a list of destinations


// ƒ = migrantsPerArrow -> destination -> delta -> arrowCoordinatesPerOrigin
// D = arrowCoordinatesPerOrigin -> destination -> canvas

// [destinationISO: {
//      originISO: totalImmigrants 
// }]

let destinations = {}

let getArrowsFromDelta = (migrantsPerArrow, destinationISO, delta) => {
 	let destinationData = destinations[destinationISO];
	Object.keys(destinationData).map((countryISO) => {
		let totalImmigrantsFromCountry = destinationData[countryISO]
		let numberOfArrows = totalImmigrantsFromCountry/migrantsPerArrow;
		// we now need to use the delta
		// we need to return a list of arrows with ratios for each
	});
}

let drawArrowAt = (lat, long) => {
	
}












