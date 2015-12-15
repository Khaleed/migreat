var React = require('react');
var {zoomMap} = require('./worldmap/map'); 

export const MapController = React.createClass({

	onPlay() {
		zoomMap();
	},

	onPause() {

	},

	onForward() {

	},

	onRewind() {

	},

	render() {
		return (
			<div>
				<input type="button" onClick={this.onPlay} >Play</input>
				<input type="button" onClick={this.onPause} >Pause</input>
				<input type="button" onClick={this.onForward} >Forward</input>
				<input type="button" onClick={this.onRewind} >Rewind</input>
			</div>);
		;
	}
});