"use strict";
let d3 = require('d3');
let _ = require('lodash');
import { countriesToCentroids } from "./../components/worldmap/map.js";

let svg = d3.select('.chart')
  .select('svg');

let barWidth = 2;

let getCentroid = iso => {
  return countriesToCentroids[iso];
};

let usa_x = getCentroid(840)[0];
let usa_y = getCentroid(840)[1];

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

// data looks like this
// { 124: [0.8, 0.9], 156 : [0.7, 0.8, 0.9] }
// [ { 124: [0.8, 0.9] }, { 156 : [0.7, 0.8, 0.9] } ]
// 20 bar graphs 

export default function updateD3Chart(data) {
  
  let bars = svg.selectAll('.bar')
    // solve the problem of binding data to the correct svg element
    .data(data, d => {
      return Object.keys(d)[0];
    });

  bars
    .attr('height', d => { // change the height for everything that being updated
      let key = Object.keys(d)[0]
      return d[key][0] * totals[key] / 100000;
    })
    .attr('y', d => { // change the y for everything that being updated
      let key = Object.keys(d)[0]
      return -1 * d[key][0] * totals[key] / 100000;
    })

  bars.enter()
    .append('g')
    .attr('transform', (d, i) => {
      return "translate(" + (barWidth * i + usa_x) + "," + usa_y + ")";
    })
    .append('rect')
    .attr('width', barWidth)
    .attr('height', d => { // change the height for everything that being updated
      let key = Object.keys(d)[0]
      return d[key][0] * totals[key] / 100000;
    })
    .attr('y', d => { // change the y for everything that being updated
      let key = Object.keys(d)[0]
      return -1 * d[key][0] * totals[key] / 100000;
    })
    .attr('fill', 'blue');
}