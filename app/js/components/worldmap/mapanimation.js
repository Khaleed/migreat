import { countriesToCentroids } from './map';
let d3 = require("d3");
require("d3-geo-projection/d3.geo.projection");
let _ = require('lodash');
// the code that will go into the requestAnimationFrame 
// all countries are going to finish at the same time
// the amount of arrows per second will be different
let screen = document.getElementById('screen');
const totalArrowTime = 60;
const migrantsPerArrow = 400;
const velocityInDegrees = 720;
let migrantsPerCountry = 10000; // this is people migrating from a particular country to the USA
let currentAnimationTime = 1; // this should be the current time - 0 when animation starts and 1 when it ends
// ticks?
let period = migrantsPerArrow / migrantsPerCountry; // how much time between each arrow launch
let arrowLifeSpan = currentAnimationTime - Math.floor(currentAnimationTime / period) * period;
	// some coordinates in pixels
	// let latSource = 45;
	// let latDest = 0;
	// let longSource = 90;
	// let longDest = 0;

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
// load data

let destinations = null;
let immigrationData = d3.csv("us2013.csv", (error, data) => {
	if (error) {
		console.error(error);
	} else {
		destinations = {
			840: data
		};
	}
});

// let getArrowsFromRatio = (migrantsPerArrow, destinationISO, ratio) => {
// 	let destinationData = destinations[destinationISO];
// 	Object.keys(destinationData).map((countryISO) => {
// 		let totalImmigrantsFromCountry = destinationData[countryISO];
// 		let numberOfArrows = totalImmigrantsFromCountry / migrantsPerArrow;
// 		// we now need to use the ratio

// 		// we need to return a list of arrows with ratios for each
// 	});
// }

// generate arrows and pass that to a draw function
let render = (ratio) => {
	// we need information about US and origins and ratio
	let arrows = {
		192: [0.1, 0.2, 0.3, 0.4]
	};
	// let arrows = getArrowsFromRatio(migrantsPerArrow, 840, ratio)
	// destinations[840]
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
			return [a[0] + ratio*c[0] , a[1] + ratio*c[1]]
		});
	}));
	ctx.clearRect(0, 0, screen.width, screen.height);
	ctx.fillStyle = "rgb(200, 0, 0)";
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
	}
	// see how ratio changes from 0 to 1
startAnimation(20 * 1000, render);