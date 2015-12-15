"use strict";
import { countriesToCentroids } from '../components/worldmap/map.js';

let getCentroid = iso => {
  return countriesToCentroids[iso];
};

let d3 = require('d3');
let data = [{ 124: [0.8, 0.9] }, { 156 : [0.7, 0.8, 0.9] }];
let _= require('lodash');
// data looks like this
// { 124: [0.8, 0.9], 156 : [0.7, 0.8, 0.9] }

// [ { 124: [0.8, 0.9] }, { 156 : [0.7, 0.8, 0.9] } ]

// 20 bar graphs 

let svg = d3.select('.chart')
    .append('svg')
    .attr('width', 1200)
    .attr('height', 800);

let barWidth = 20;

let usa_x = getCentroid(840)[0];
let usa_y = getCentroid(840)[1];

let bars = svg.selectAll('.bar')
    .data(data)
  .enter()
    .append('g')
    .attr('transform', (d, i) => {
      return "translate(" + (barWidth * i + usa_x) + "," + usa_y + ")"; 
    })
    .append('rect')
    .attr('width', barWidth)
    .attr('height', 100)
    .attr('fill', 'blue')




