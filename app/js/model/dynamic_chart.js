"use strict";
let d3 = require('d3');
let data = [];
let _= require('lodash');
// data looks like this
// { 124: [0.8, 0.9], 156 : [0.7, 0.8, 0.9] }

// [ { 124: [0.8, 0.9] }, { 156 : [0.7, 0.8, 0.9] } ]

// 20 bar graphs 

let svg = d3.select('.chart').append('svg');

let bars = svg.selectAll('.bar')
    .data(data)
  .enter()
    .append('rect')
    .attr('x', )


  let obj = {'a': 1, "b": 2, "c": 3}

