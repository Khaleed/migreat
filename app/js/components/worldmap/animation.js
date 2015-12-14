// grab stuff from modules
import { countriesToCentroids } from './map';
let d3 = require("d3");
let _ = require('lodash');

window.requestAnimationFrames = [];

// grab main variables
let screen = document.getElementById('screen');
let ctx = screen.getContext('2d');

const totalArrowTime = 60;
const migrantsPerArrow = 40000;

// deal with the destinations stuff
let destinations = null;

let immigrationData = d3.csv("us2013.csv", (error, data) => {
	if (error) {
		console.error(error);
	} else {
		destinations = {
			840: data
		};
		startAnimation(20 * 1000, render);
	}
});

// let getArrowsFromRatio = (migrantsPerArrow, destinationISO, ratio) => {
// 	const b = getCentroid(destinationISO);
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


// 		// we need to return a list of arrows with fractionsAlongPath for each
// 		getDistance();
// };

// generate arrows and pass that to a draw function
let render = (fractionThroughTime, countryId) => {
	// loop through countries here
	let migrantsData;
	if (countryId) {
		migrantsData = [];
	} else {
		migrantsData = destinations[840];	
	}
	
	// handle logic for each country
	if (countryId) {
		// migrantsData = {
		// 	countryId: migrantsData[countryId]
		// };
		migrantsData = destinations[840].filter(function(elem){
			return elem.iso === countryId.toString();
		});
	}
	
	let arrows = _.reduce(migrantsData, (arrows, originCountry) => {
		// we need information about US and origins and fractionThroughTime
		let migrantsPerCountry = originCountry.value;
		let countryISO = originCountry.iso;
		let points = migrantsPerCountry / migrantsPerArrow;
		arrows[countryISO] = _.range(points).reduce((list, i) => {
			let fraction = i / points + fractionThroughTime;
			if (fraction < 1) {
				list.push(fraction);
			}
			return list;
		}, []);
		return arrows;
	}, {});
	drawArrows(arrows, 840, screen);
};

// let arrows = {
// 		//		192: [fractionThroughTime]
// 		192: fractionsAlongPath

// 		// 192: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1] // -> this data is mock/dummy -> instead of this I need to use
// 	};

// takes ISO and returns it's centroid
let getCentroid = iso => {
	return countriesToCentroids[iso];
};
// unit vector 
let bMinusA = (a, b) => {
	return [b[0] - a[0], b[1] - a[1]];
};

let clearCanvas = () => {
	ctx.clearRect(0, 0, screen.width, screen.height);
}

// {iso: [0.1, 0.5]}
let drawArrows = (arrows, destination) => {
	const b = getCentroid(destination);
	// we need a final object that looks like this:
	// {iso: ratios} -> [{c, a, ratios}]

	// going through all the countries
	let arrowCoordinates = _.flatten(_.map(arrows, (fractionsAlongPath, iso) => {
		// going through all the arrows of a country
		let a = getCentroid(iso);
		let c = bMinusA(a, b);
		return _.map(fractionsAlongPath, (fraction) => {
			return [a[0] + fraction * c[0], a[1] + fraction * c[1]]
		});
	}));

	clearCanvas();
	ctx.fillStyle = "brown";
	// recursive function instead of forEach
	arrowCoordinates.forEach(c => {
		ctx.fillRect(c[0], c[1], 1, 1);
	});
};

// this will be called for the life cycles
let startAnimation = (duration, callback, ...params) => { // callback -> higher order function
	// the callback decouples ticks from time
	let startTime = null;
	// called every time animation continues going
	let animationStep = timestamp => {
		let currentTime = timestamp;
		// when to continue animation
		if (currentTime - startTime <= duration) {
			let fraction = (currentTime - startTime) / duration;
			callback.apply(null, [fraction].concat(params));
			window.requestAnimationFrames.push(window.requestAnimationFrame(animationStep));
		}
	}
	window.requestAnimationFrames.push(window.requestAnimationFrame(timestamp => {
		startTime = timestamp;
		window.requestAnimationFrames.push(window.requestAnimationFrame(animationStep));
	}));
};

// create a function -> get a reference of the svg event and listen to it
document.addEventListener("hoveringCountry", e => {
	// 
	_.map(window.requestAnimationFrames, (currentFrame) => {
		window.cancelAnimationFrame(currentFrame);
		currentFrame = undefined;
	})
	clearCanvas();
	startAnimation(20*1000, render, e.detail);
});

// stop the current animation function 



// call render passing -> country ID, fractionThroughTime