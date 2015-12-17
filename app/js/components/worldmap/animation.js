import { countriesToCentroids } from './map';                                                   
import updateD3Chart from './../../model/dynamic_chart.js';

let d3 = require("d3");
let _ = require('lodash');
let screen = document.getElementById('screen');
let ctx = screen.getContext('2d');

const migrantsPerArrow = 20000;
let destinations = null;
let firstTime = true;

let duration = () => {
	return 5 * 1000;
};

let loadImmigrationData = d3.csv("us2013.csv", (error, data) => {
	if (error) {
		console.error(error);
	} else {
		destinations = {
			840: data
		};
		startAnimation(render);
	}
});

// generate arrows and pass that to a draw function
let countryId = null;

let render = (fractionThroughTime) => {
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
		migrantsData = destinations[840].filter(current => {
			return current.iso === countryId.toString();
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

	let arrowsForChart = Object.keys(arrows).map(iso => {
		let ret = {};
		ret[iso] = arrows[iso];
		return ret;
	});
	drawArrows(arrows, 840, screen);
	let bars = updateD3Chart(arrowsForChart);

};
// takes ISO and returns it's centroid
let getCentroid = iso => {
	return countriesToCentroids[iso];
};
// distance between a and b
let bMinusA = (a, b) => {
	return [b[0] - a[0], b[1] - a[1]];
};

let clearCanvas = () => {
	ctx.clearRect(0, 0, screen.width, screen.height);
};

let canvasArrow = (x, y, angles) => {
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 20;
	ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
	ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
	// choose random coordinate
	ctx.translate(x, y);
	ctx.scale(0.05, 0.05)
	ctx.rotate(angles);
	ctx.moveTo(0, 0);
	// choose X AND Y is same
	ctx.lineTo(-100, 0); // arrow line
	// delta 25
	ctx.lineTo(-80, -25); // bottom edge
	ctx.lineTo(-80, 25);
	ctx.lineTo(-100, 0); // top edge
	ctx.fill();
	ctx.stroke();
	ctx.restore();
};

// {iso: [0.1, 0.5]}
let drawArrows = (arrows, destination) => {
	const b = getCentroid(destination);
	// we need a final object that looks like this:
	// {iso: ratios} -> [{c, a, ratios}]
	clearCanvas();
	ctx.fillStyle = "brown";
	// going through all the countries
	_.forEach(arrows, (fractionsAlongPath, iso) => {
		// going through all the arrows of a country
		let a = getCentroid(iso);
		let c = bMinusA(a, b);
		fractionsAlongPath.forEach(fraction => {
			let destinationPath = [a[0] + fraction * c[0], a[1] + fraction * c[1]];
			canvasArrow(destinationPath[0], destinationPath[1], Math.atan(c[1] / c[0]));
		});
	});
};
// this will be called for the life cycles
let startAnimation = (callback, ...params) => { // callback -> higher order function
	// the callback decouples ticks from time
	let startTime = null;
	// called every time animation continues going
	let animationStep = timestamp => {
		let currentTime = timestamp;
		// when to continue animation
		if (currentTime - startTime <= duration()) {
			let fraction = (currentTime - startTime) / duration();
			callback.apply(null, [fraction].concat(params));
			window.requestAnimationFrame(animationStep);
		}
	}
	window.requestAnimationFrame(timestamp => {
		startTime = timestamp;
		window.requestAnimationFrame(animationStep);
	});
};

// create a function -> get a reference of the svg event and listen to it
document.addEventListener("hoveringCountry", e => {
	countryId = e.detail;
});

document.addEventListener("unhoveringCountry", e => {
	countryId = null;
});

let slider = document.getElementById("slider");

// change the slider logic
slider.addEventListener("change", e => {
	let value = e.target.max - e.target.value;
	// console.log("slider: ", value);
	// console.log("slider.value: ", e.target.value);
	// duration = () => { return e.target.value * 60 * 1000 };
	// updateAnimation
	// startAnimation(duration, render);
});
