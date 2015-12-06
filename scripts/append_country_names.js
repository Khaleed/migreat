'use strict'

var countries = require('i18n-iso-countries');
var data = require('../data/test-world-map.json');

let start = (data) => {
 	let newGeometries = data.objects.countries.geometries.map(e => {
		let id = e.id;
		let countryName = countries.getName(id, 'en');
		return Object.assign({countryName: countryName}, e);
	});

	data.objects.countries.geometries = newGeometries;
	console.log(JSON.stringify(data));
};

start(data);
