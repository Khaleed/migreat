// modules/libs
import { countriesToCentroids } from './map';
let d3 = require("d3");
require("d3-geo-projection/d3.geo.projection");
let _ = require('lodash');
// grab what I need for my life cycles
let screen = document.getElementById('screen');
const totalArrowTime = 60;
const migrantsPerArrow = 40000;
let migrantsPerCountry = 100000;
let destinations = null;

let getCentroid = iso => {
	return countriesToCentroids[iso];
};

// load data
let immigrationData = d3.csv("us2013.csv", (error, data) => {
	if (error) {
		console.error(error);
	} else {
		destinations = {
			840: data
		};
		let duration = 5 * 1000;
		let canvas = new fabric.Canvas('screen');
		_.map(destinations[840], (countryData) => {
			let nOfImmigrants = countryData.value;
			let countryISO = countryData.iso;
			let destinationISO = 840;
			let nOfArrows = nOfImmigrants / migrantsPerArrow;
			let rate = duration / nOfArrows;

			let step = () => {
				const b = getCentroid(destinationISO);
				const a = getCentroid(countryISO);

			let	rect = new fabric.Rect({
					width: 2,
					height: 2,
					left: a[0],
					top: a[1],
					stroke: 'black',
					strokeWidth: 5,
					fill: 'green',
					selectable: false
				});
				canvas.add(rect);
				rect.animate({
					left: b[0],
					top: b[1]
				}, {
					duration: 1000,
					onChange: canvas.renderAll.bind(canvas),
					onComplete: function() {
						// add migrantsPerArrow to the bar
					}
						// easing: fabric.util.ease[document.getElementById('easing').value]
				});
				nOfArrows -= 1;
				if (nOfArrows > 0) {
					setTimeout(step, rate);
				}
			}
			step();
		});
	}
});