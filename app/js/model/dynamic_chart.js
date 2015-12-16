"use strict";

let d3 = require('d3');
let _ = require('lodash');
import {
  countriesToCentroids
}
from "./../components/worldmap/map.js";

let svg = d3.select('.chart')
  .select('svg');

let barWidth = 4;

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

export default function updateD3Chart(data, firstTime) {
  // { 124: [0.8, 0.9], 156 : [0.7, 0.8, 0.9] }
  let bars = svg.selectAll('.bar')
    // solve the problem of binding data to the correct svg element
    .data(data, d => {
      //console.log(Object.keys(d)[0]);
      return Object.keys(d)[0]; // // [ { 124: [0.8, 0.9] }, { 156 : [0.7, 0.8, 0.9] } ]
    });

  bars
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
    .attr('fill', 'blue')
    return bars;
}













