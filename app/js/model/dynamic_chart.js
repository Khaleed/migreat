"use strict";

let d3 = require('d3');
let _ = require('lodash');
import { countriesToCentroids } from "./../components/worldmap/map";
import { tooltip, countries } from "./../components/worldmap/map";
let isoCountries = require("i18n-iso-countries");

// let svg = d3.select('.chart')
//   .select('svg');

let svg = d3.select('#worldmap');

let barWidth = 4;

let getCentroid = iso => {
  return countriesToCentroids[iso];
};

let usa_x = getCentroid(840)[0];
let usa_y = getCentroid(840)[1];

// offset calculations for the tooltip
let offsetL = document.body.offsetLeft + 40;
let offsetT = document.body.offsetTop + 20;

let totals = {
  484: 12950828,
  156: 2246840,
  356: 2060771,
  608: 1998932,
  630: 1685015,
  704: 1381076,
  222: 1371767,
  192: 1201164,
  410: 1145196,
  214: 967988,
  320: 929961,
  124: 867411,
  388: 765043,
  826: 758919,
  170: 721533,
  276: 680925,
  332: 663860,
  340: 550694,
  616: 498087,
  218: 472855
};

export default function updateD3Chart(data, firstTime) {
  // { 124: [0.8, 0.9], 156 : [0.7, 0.8, 0.9] }
  let bars = svg.selectAll('.bar')
    .data(data, d => {
      return Object.keys(d)[0]; // // [ { 124: [0.8, 0.9] }, { 156 : [0.7, 0.8, 0.9] } ]
    });

  bars.select('rect')
    .attr('height', d => {
      let key = Object.keys(d)[0]
      return d[key][0] * totals[key] / 100000;
    })
    .attr('y', d => {
      let key = Object.keys(d)[0]
      return -1 * d[key][0] * totals[key] / 100000;
    })

  bars.enter()
    .append('g')
    .attr('class', 'bar')
    .attr('id', d => {
      let key = Object.keys(d)[0]
      return totals[key];
    })
    .attr('transform', (d, i) => {
      return "translate(" + (barWidth * i + usa_x - 40) + "," + usa_y + 30 + ")";
    })
    .append('rect')
    .attr('width', barWidth)
    .attr('height', d => {
      let key = Object.keys(d)[0]
      return d[key][0] * totals[key] / 100000;
    })
    .attr('y', d => {
      let key = Object.keys(d)[0]
      return -1 * d[key][0] * totals[key] / 100000;
    })
    .attr('fill', 'blue');

  bars.on("mouseover", function(d, i) {
    let mouse = d3.mouse(countries.node()).map(d => {
      return parseInt(d);
    });
    console.log("hovering", (mouse[0] + offsetL), (mouse[1] + offsetT), isoCountries.getName(Object.keys(d)[0], "en"), tooltip);
    tooltip.classed("hidden", false)
      .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
      .html(isoCountries.getName(Object.keys(d)[0], "en"))
  })

  bars.on("mouseout", function(d, i) {
    tooltip.classed("hidden", true);
  });
}