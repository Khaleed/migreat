"use strict";

let d3 = require(d3);
let map = require('../components/worldmap/map.js');

// the code that will go into the requestAnimationFrame 
// all countries are going to finish at the same time
// what will be different will be the amount of arrows per second
// const totalArrowTime = 60 
// const migrantsPerArrow = 400;
// const velocityInDegrees = 720; 
// let migrantsPerCountry = 10000; // this is people migrating from a particular country to the USA
// let currentAnimationTime = 1; // this should be the current time - 0 when animation starts and 1 when it ends

let period = migrantsPerArrow / migrantsPerCountry // how time between each arrow launch
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

let condition = arrowLifeSpan * velocityInDegrees < distanceBetweenDestAndSrc
// this will give coordinates of the arrow at any time
while (condition) {
	lat = latSource + unitVectorFromSrcToDestLat * arrowLifeSpan;
	long = longSource + unitVectorFromSrcToDestLong * arrowLifeSpan;
	drawArrowAt(lat, long)
	arrowLifeSpan += period;
}


// how to map from origins to destinations
// [US_ISO_ID]
// so you need a list of destinations


// ƒ = migrantsPerArrow -> destination -> delta -> arrowCoordinatesPerOrigin
// D = arrowCoordinatesPerOrigin -> destination -> canvas

// [destinationISO: {
//      originISO: totalImmigrants 
// }]

let destinations = {}

let getArrowsFromDelta = (migrantsPerArrow, destinationISO, delta) => {
 	let destinationData = destinations[destinationISO];
	Object.keys(destinationData).map((countryISO) => {
		let totalImmigrantsFromCountry = destinationData[countryISO]
		let numberOfArrows = totalImmigrantsFromCountry/migrantsPerArrow;
		// we now need to use the delta
		// we need to return a list of arrows with ratios for each
	});
}

let drawArrowAt = (lat, long) => {
	
}












