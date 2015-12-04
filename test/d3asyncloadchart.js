// let data = [4, 8, 15, 16, 23, 42];
let width = 420;
let barHeight = 20;

// a function that returns scaled display value
// e.g. input of 4 returns 40
let x = d3.scale.linear()		// map from an input domain to an output range
	.range([0, width]);

let chart = d3.select('.chart')
	.attr('width', width);

function coerceDataType(d) {
	d.value = parseInt(d.value, 10); // coerce to number
	return d;
}

d3.tsv("dummydata.tsv", coerceDataType, (error, data) => {
	console.log(data);
	x.domain([0, d3.max(data, d => {
		console.log("d", d);
		return d.value;
	})]); //?

	chart.attr('height', barHeight * data.length);

	let bar = chart.selectAll('g')
		.data(data)
		.enter()
		.append('g')
		.attr('transform', (d, i) => { // d = data   and i = index
			return "translate(0," + i * barHeight + ")"; // position the bars one after the other
		});

    bar.append('rect')
       .attr('width', function (d) {
       	return x(d.value);
       }) // don't understand usage of x and -1  //?
       .attr('height', barHeight-1);

    bar.append('text')
       .attr('x', d => {
       	    x(d.value) - 3;
       })
       .attr('y', barHeight / 2)  //?
       // indicates the off-set in the y-coordinate
       .attr('dy', '.35em')
       .text(d => {
       		return d.name + " " + d.value
       	});
});