import {
	countriesToCentroids
}
from './map';
let d3 = require("d3");
require("d3-geo-projection/d3.geo.projection");
let _ = require('lodash');

// the code that will go into the requestAnimationFrame 
// all countries are going to finish at the same time
// the amount of arrows per second will be different for each country
let screen = document.getElementById('screen');
const totalArrowTime = 60;
const migrantsPerArrow = 40000;

// speed is in pixels per second
let speed = 20;
let migrantsPerCountry = 100000; // this is people migrating from a particular country to the USA
let currentAnimationTime = 1; // this should be the current time - 0 when animation starts and 1 when it ends

// let distanceBetweenDestAndSrc = Math.sqrt(Math.pow(latSource - latDest, 2) + Math.pow(longSource - longDest, 2));
let getDistance = (latSource, longSource, latDest, longDest) => {
	return Math.sqrt(Math.pow(latSource - latDest, 2) + Math.pow(longSource - longDest, 2));
};

// physics vector - something pointing from one direction to another for the lat
// let unitVectorFromSrcToDest = Math.pow(latDest - latSource, 2) / distanceBetweenDestAndSrc;
// let condition = arrowLifeSpan * velocityInDegrees < distanceBetweenDestAndSrc

// // this will provide coordinates of any arrow at any time
// while (condition) {
// 	lat = latSource + unitVectorFromSrcToDestLat * arrowLifeSpan;
// 	long = longSource + unitVectorFromSrcToDestLong * arrowLifeSpan;
// 	drawArrowAt(lat, long)
// 	arrowLifeSpan += period;
// }

// how to map from origins to destinations
// [US_ISO_ID]
// so you need a list of destinations


// ƒ = migrantsPerArrow -> destination -> delta -> arrowCoordinatesPerOrigin
// D = arrowCoordinatesPerOrigin -> destination -> canvas

// [destinationISO: {
//      originISO: totalImmigrants 
// }]

let destinations = null;
// load data
let immigrationData = d3.csv("us2013.csv", (error, data) => {
	if (error) {
		console.error(error);
	} else {
		destinations = {
			840: data
		};
		// see how ratio changes from 0 to 1

		// the problem is that now we need different timeouts for each country since
		// they are going to be producing arrows at different rates
		// 

		let duration = 20 * 1000;
		let canvas = new fabric.Canvas('screen');

		_.map(destinations[840], (countryData) => {
			let nOfImmigrants = countryData.value;
			let countryISO = countryData.iso;

			let destinationISO = 840;
			let nOfArrows = nOfImmigrants / migrantsPerArrow;
			let rate = duration / nOfArrows;

			let step = () => {
				const b = getCentroid(destinationISO);
				let a = getCentroid(countryISO);

				var circle = new fabric.Rect({
					width: 2,
					height: 2,
					left: a[0],
					top: a[1],
					stroke: '#aaf',
					strokeWidth: 1,
					fill: '#faa',
					selectable: false
				});
				canvas.add(circle);
				circle.animate({ left: b[0], top: b[1] }, {
					duration: rate,
					onChange: canvas.renderAll.bind(canvas),
					onComplete: function() {
						// add migrantsPerArrow to the bar
					}
					// easing: fabric.util.ease[document.getElementById('easing').value]
				});

				console.log("number of arrows", nOfArrows, rate);
				nOfArrows -= 1;
				if (nOfArrows > 0) {
					setTimeout(step, rate);
				}
			}

			step();
		});

		// startAnimation(20 * 1000, render);
	}
});

let currentArrowsBeingAnimated = {
	iso: [0]
};

let getArrowsFromRatio = (migrantsPerArrow, destinationISO, ratio) => {
	let migrantsData = destinations[destinationISO];
	const b = getCentroid(destinationISO);
	Object.keys(migrantsData).map((countryISO) => {
		let totalImmigrantsFromACountry = migrantsData[countryISO];
		// console.log(totalImmigrantsFromACountry);
		let a = getCentroid(countryISO);
		let distance = getDistance(a[0], a[1], b[0], b[1]);
		// how to add the speed???????
		// for that you need a list of generated arrows...

		let numberOfArrows = totalImmigrantsFromACountry / migrantsPerArrow;
		// the time between arrows
		let T = 1 / numberOfArrows;
		let period = migrantsPerArrow / totalImmigrantsFromACountry; // how much time between each arrow launch
		let arrowLifeSpan = ratio - Math.floor(ratio / T) * T;


		// we need to return a list of arrows with ratios for each
		getDistance();
	});
};

// generate arrows and pass that to a draw function
let render = (ratio) => {
	// we need information about US and origins and ratio
	// let arrows = {
	// 	192: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1]
	// };
	// let arrows = getArrowsFromRatio(migrantsPerArrow, 840, ratio)
	destinations[840]
	drawArrows(arrows, 840, screen);
};
// takes ISO and returns it's centroid
let getCentroid = iso => {
	return countriesToCentroids[iso];
};

let bMinusA = (a, b) => {
	return [b[0] - a[0], b[1] - a[1]];
};

// {iso: [0.1, 0.5]}
let drawArrows = (arrows, destination, screen) => {
	let ctx = screen.getContext('2d');
	const b = getCentroid(destination);
	// we need a final object that looks like this:
	// {iso: ratios} -> [{c, a, ratios}]

	// going through all the countries
	let arrowCoordinates = _.flatten(_.map(arrows, (ratios, iso) => {
		// going through all the arrows of a country
		let a = getCentroid(iso);
		let c = bMinusA(a, b);
		return _.map(ratios, (ratio) => {
			return [a[0] + ratio * c[0], a[1] + ratio * c[1]]
		});
	}));

	ctx.clearRect(0, 0, screen.width, screen.height);
	ctx.fillStyle = "brown";
	// recursive function instead of forEach
	arrowCoordinates.forEach(c => {
		ctx.fillRect(c[0], c[1], 1, 1);
	});
};

// this will be called for the life cycles
let startAnimation = (duration, callback) => { // callback -> higher order function
	// the callback decouples ticks from time
	let startTime = null;
	// called every time animation continues going
	let animationStep = (timestamp) => {
		let currentTime = timestamp;
		// when to continue animation
		if (currentTime - startTime <= duration) {
			let ratio = (currentTime - startTime) / duration;
			callback(ratio);
			window.requestAnimationFrame(animationStep);
		}
	}
	window.requestAnimationFrame((timestamp) => {
		startTime = timestamp;
		window.requestAnimationFrame(animationStep);
	});
};