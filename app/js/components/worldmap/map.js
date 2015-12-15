"use strict";

let d3 = require("d3");
// turn GeoJSON into screen coordinates
// the result is not tied down to a particular tiled map
require("d3-geo-projection/d3.geo.projection"); // d3.geo will contain all extended pieces
let worldMap = require("../../../../data/worldmap.json");
let topojson = require("topojson");
let isoCountries = require("i18n-iso-countries");
// define the size of the map
let width = 1200,
	height = 800;
// set color of the map
let color = d3.scale.category20();
//set up the view of the map
let projection = d3.geo.naturalEarth()
	.scale(170)
	.translate([width / 2, height / 2])
	.precision(0.1) // geometric precision over speed and crisp edgess
	// create new geo path generator
let path = d3.geo.path()
	.projection(projection);
// geometry object representing all meridians and parallels for this graticule (basically for the grid lines).
let graticule = d3.geo.graticule();
// append countries svg element
let countries = d3.select('.rel-pos')
	.append("svg")
	.attr("id", "worldmap")
	.attr("width", width)
	.attr("height", height);
// tool tip for hovering countries
let tooltip = d3.select('.rel-pos')
	.append("div")
	.attr("class", "tooltip hidden");
// offset calculations for the tooltip
let offsetL = document.body.offsetLeft + 40;
let offsetT = document.body.offsetTop + 20;
// create and append new elements
// SVG allows graphical objects to be defined for later reuse
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

// display multiple features -> polygons and multi-polygons
countries.append("path")
	.datum(graticule)
	.attr("class", "graticule")
	.attr("d", path);

// load the TopoJSON file with the coordinates for the world map
let countriesJSON = topojson.feature(worldMap, worldMap.objects.countries).features;

// {1: [300, 250], 2: [100, 200], 5: [120, 100]}
export const countriesToCentroids = countriesJSON.reduce((obj, d) => {
	// console.log("object to reduce", obj);
	let centroid = path.centroid(d);
	obj[d.id] = centroid;
	return obj;
}, {});

let neighbors = topojson.neighbors(worldMap.objects.countries.geometries);
// draw the map with the geoJSON data
let countryData = countries.selectAll(".country")
	.data(countriesJSON)
	.enter()
	.append("g");

let lastHoveredCountry = 0;
let svgMap = document.getElementById("worldmap");
// tooltips
countryData.on("mouseover", (d, i) => {
		// create a custome event and dispatch it ->  send only -> d.id
		lastHoveredCountry = new CustomEvent("hoveringCountry", {
			detail: d.id,
			bubbles: true,
			cancelable: true
		});
		svgMap.dispatchEvent(lastHoveredCountry);
	})
	.on("mousemove", function(d, i) {
		let mouse = d3.mouse(countries.node()).map(d => {
			return parseInt(d);
		});
		tooltip.classed("hidden", false)
			.attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
			.html(isoCountries.getName(countriesJSON[i].id, "en"))
	})
	.on("mouseout", function(d, i) {
		let lastUnHoveredCountry = new CustomEvent("unhoveringCountry", {
			detail: d.id,
			bubbles: true,
			cancelable: true
		});
		svgMap.dispatchEvent(lastUnHoveredCountry);
		tooltip.classed("hidden", true);
	});
// append each country and give it a color 
countryData.append("path", ".graticule")
	.attr("d", path)
	.attr("class", "country")
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
// // find centroids of each country
// let svgCentroids = countries.selectAll("bar")
// 	.data(countriesJSON)
// 	.enter()
// 	.append('circle')
// 	// .attr('width', 10)
// 	// .attr('height', d => {
// 	// 	// console.log(path.centroid(d));
// 	// 	return 25;
// 	// })
// 	.attr("cx", d => path.centroid(d)[0])
// 	.attr("cy", d => path.centroid(d)[1])
// 	.attr("")
// 	// .style("visibility", d => (d.id == 840) ? 'visible' : 'hidden');

// zooming and panning a map
// behaviour acts as event listeners
let zoom = d3.behavior.zoom()
	.on("zoom", function() {
		countries.attr("transform", "translate(" +
			d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")"); // currently not working
		// create multiple distinct paths
		countries.selectAll("path")
			.attr("d", path.projection(projection));
	});
countries.call(zoom);