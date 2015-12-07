"use strict";

let d3 = require("d3");
// turn GeoJSON into screen coordinates
// the result is not tied down to a particular tiled map
require("d3-geo-projection/d3.geo.projection.js"); // d3.geo will contain all extended pieces
let worldMap = require("../../../../data/test-world-map.json");
let topojson = require("topojson");
let isoCountries = require("i18n-iso-countries");
let immigrationTotals = require("../../model/immigration-chart.js");
let mockChart = require("../../../../public/d3asyncloadchart.js");

// define the size of the map
let width = 960,
	height = 580;

let color = d3.scale.category20();

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

// create root SVG element and append to body
let countries = d3.select("body")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

// create and append new elements
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
	.attr("xlink:href", "#sphere"); // refer to href attr to the xlink namespace

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
	// 
	.style("fill", (d, i) => {
		return color(d.color = d3.max(neighbors[i], n => {
			return countriesJSON[n].color;
		}) + 1 | 0);
	});
// append name of countries in the centroid of each country
cdata.append("text")
	.text((d, i) => {
		return isoCountries.getName(countriesJSON[i].id, "en");
	})
	.attr("x", d => {
		return path.centroid(d)[0]
	})
	.attr("y", d => {
		return path.centroid(d)[1]
	})
	.attr("class", "country-lbl");
// insert a new element
countries.insert("path", ".graticule")
	.datum(topojson.mesh(worldMap, worldMap.objects.countries, (a, b) => { // datums sets and gets bound data for each selected element
		return a !== b;
	}))
	.attr("class", "boundary")
	.attr("d", path);


let svgCentroids = countries.selectAll("circle")
	.data(countriesJSON)
	.enter()
	.append("circle")
	.attr("cx", d => path.centroid(d)[0])
	.attr("cy", d => path.centroid(d)[1])
	.attr("r", 1);

// zooming and panning a map
// behaviour acts as event listeners
let zoom = d3.behavior.zoom()
	.on("zoom", () => {
		countries.attr("transform", "translate(" +
			d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
		countries.selectAll("path")
			.attr("d", path.projection(projection));
	});

countries.call(zoom);