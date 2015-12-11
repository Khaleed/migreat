import { countriesToCentroids } from '../worldmap/map.js';
let d3 = require("d3");
require("d3-geo-projection/d3.geo.projection.js"); 
// the code that will go into the requestAnimationFrame 
// all countries are going to finish at the same time
// what will be different will be the amount of arrows per second
const totalArrowTime = 60
const migrantsPerArrow = 400;
const velocityInDegrees = 720;
let migrantsPerCountry = 10000; // this is people migrating from a particular country to the USA
let currentAnimationTime = 1; // this should be the current time - 0 when animation starts and 1 when it ends
// ticks?
let period = migrantsPerArrow / migrantsPerCountry // how much time between each arrow launch
let arrowLifeSpan = currentAnimationTime - Math.floor(currentAnimationTime / period) * period // how long the arrow has been alive

let latSource = 45;
let latDest = 0;
let longSource = 90;
let longDest = 0;

// pythagoras theorem
let distanceBetweenDestAndSrc = Math.sqrt(Math.pow(latSource - latDest, 2) + Math.pow(longSource - longDest, 2))
	// physics vector - something pointing from one direction to another for the lat
let unitVectorFromSrcToDestLat = Math.pow(latDest - latSource, 2) / distanceBetweenDestAndSrc;
// physics vector - something pointing from one direction to another for the long
let unitVectorFromSrcToDestLong = Math.pow(longDest - longSource, 2) / distanceBetweenDestAndSrc;

// let condition = arrowLifeSpan * velocityInDegrees < distanceBetweenDestAndSrc
// 	// this will provide coordinates of any arrow at any time
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
		iso: [0.1, 0.2, 0.3, 0.4]
	};
	// let arrows = getArrowsFromRatio(migrantsPerArrow, 840, ratio)
	destinations[840]
	drawArrows(arrows, 840);
};

let getCentroid = iso => {
	// return centroid
};

let drawArrows = (arrowsPerOrigin, destination) => {
	let destCentroid = getCentroid(destination);
	let originsCentroid = Object.keys(arrowsPerOrigin).map(getCentroid);
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
startAnimation(60 * 1000, render);