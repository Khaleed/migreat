"use strict";

let d3 = require("d3");
// turn GeoJSON into screen coordinates
// the result is not tied down to a particular tiled map
require("d3-geo-projection/d3.geo.projection.js"); // d3.geo will contain all extended pieces
let worldMap = require("../../../../data/test-world-map.json");
let topojson = require("topojson");
let isoCountries = require("i18n-iso-countries");

// define the size of the map
let width = 960,
	height = 580;

let color = d3.scale.category10();

//set up the view of the map
let projection = d3.geo.kavrayskiy7()
	.scale(170)
	.translate([width / 2, height / 2])
	.precision(0.1)

// path generator to identify a project type
let path = d3.geo.path()
	.projection(projection);

// MultiLineString geometry object representing all meridians and parallels for this graticule.
let graticule = d3.geo.graticule();

// create root SVG element
let countries = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

countries.append("defs")
	.append("path")
	.datum({
		type: "Sphere"
	})
	.attr("id", "sphere")
	.attr("id", path);

countries.append("use")
	.attr("class", "stroke")
	.attr("xlink:href", "#sphere");

countries.append("use")
	.attr("class", "fill")
	.attr("xlink:href", "#sphere");

countries.append("path")
	.datum(graticule)
	.attr("class", "graticule")
	.attr("d", path);

let countriesJSON = topojson.feature(worldMap, worldMap.objects.countries).features;
let neighbors = topojson.neighbors(worldMap.objects.countries.geometries);

let cdata = countries.selectAll(".country")
	.data(countriesJSON)
	.enter()
	.append("g");

	cdata.append("path", ".graticule")
	.attr("d", path)
	.attr("class", "country")
	.style("fill", (d, i) => {
		return color(d.color = d3.max(neighbors[i], n => {
			return countriesJSON[n].color;
		}) + 1 | 0);
	});

	cdata.append("text")
		.text( (d, i) => {
			return isoCountries.getName(countriesJSON[i].id, "en");
		})
		.attr("x", d => {return path.centroid(d)[0]})
		.attr("y", d => {return path.centroid(d)[1]})
		.attr("class", "country-lbl");

countries.insert("path", ".graticule")
	.datum(topojson.mesh(worldMap, worldMap.objects.countries, (a, b) => {
		return a !== b;
	}))
	.attr("class", "boundary")
	.attr("d", path);


// let svgCentroids = svg.selectAll("circle")
// 	.data(countriesJSON)
// 	.enter()
// 	.append("circle")
// 	.attr("cx", d => path.centroid(d)[0])
// 	.attr("cy", d => path.centroid(d)[1])
// 	.attr("r", 1);
// Returns a MultiLineString geometry object 
// representing all meridians and parallels for this graticule.

// 	title.text(isoCountries.getName(countriesJSON[i].id, "en"));