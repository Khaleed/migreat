// grab modules
import { countriesToCentroids } from './map';
let d3 = require("d3");
let _ = require('lodash');

// grab variables for life cycles
let screen = document.getElementById('screen');
const totalArrowTime = 60;
const migrantsPerArrow = 400;
let migrantsPerCountry = 10000; 

// // let distanceBetweenDestAndSrc = Math.sqrt(Math.pow(latSource - latDest, 2) + Math.pow(longSource - longDest, 2));
// let getDistance = (latSource, longSource, latDest, longDest) => {
// 	return Math.sqrt(Math.pow(latSource - latDest, 2) + Math.pow(longSource - longDest, 2));
// };

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
		startAnimation(20 * 1000, render);
	}
});

// let currentArrowsBeingAnimated = {
//  	iso: [0.1, 0.2]
// };

// let getArrowsFromRatio = (migrantsPerArrow, destinationISO, ratio) => {
// 	let migrantsData = destinations[destinationISO];
// 	const b = getCentroid(destinationISO);
// 	Object.keys(migrantsData).map((countryISO) => {
// 		let totalImmigrantsFromACountry = migrantsData[countryISO];
// 		let a = getCentroid(countryISO);
// 		let distance = getDistance(a[0], a[1], b[0], b[1]);
// 		// how to add the speed???????
// 		// for that you need a list of generated arrows...


// 		let numberOfArrows = totalImmigrantsFromACountry / migrantsPerArrow;
// 		// the time between arrows
// 		let T = 1 / numberOfArrows;
// 		let period = migrantsPerArrow / totalImmigrantsFromACountry; // how much time between each arrow launch
// 		let arrowLifeSpan = ratio - Math.floor(ratio / T) * T;


// 		// we need to return a list of arrows with ratios for each
// 		getDistance();
// 	});
// };

// generate arrows and pass that to a draw function
let render = (ratio) => {
//	console.log(ratio);
	// we need information about US and origins and ratio
	let arrows = {
		192: [ratio]
//		192: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1] // -> this data is mock/dummy -> instead of this I need to use
	};
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
		ctx.fillRect(c[0], c[1], 10, 10);
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