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
        let styles = {
            wrapper: {
                width: "90%",
                margin: "0 auto",
                marginLeft: "1em",
                marginRight: "1em",
                marginTop: "1em",
                marginBottom: "4em"
            },
            button: {
                color: "green",
                width: "25%",
                height: "100px"
            }
        };
        return (
            <div style={styles.wrapper}>
                <input style={styles.button} value="Play" type="button" onClick={this.onPlay} ></input>
                <input style={styles.button} value="Pause" type="button" onClick={this.onPause} ></input>
                <input style={styles.button} value="Forward" type="button" onClick={this.onForward} ></input>
				        <input style={styles.button} value="Rewind" type="button" onClick={this.onRewind} ></input>
			      </div>);
		    ;
	  }
});
