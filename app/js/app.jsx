"use strict";

var React = require("react");
var ReactDOM = require("react-dom");

let map = require("./components/worldmap/map.js");
let animation = require("../../app/js/components/worldmap/animation.js");
let chart = require("./../js/model/dynamic_chart.js");

var { MapController } = require("./components/MapController");

ReactDOM.render(<MapController />, document.getElementById("controller"));
