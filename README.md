# Migreat

## Motivation

Immigration has been an important phenomena over the past few centuries and has recently come to the forefront with the recent refugee crisis in Europe. This is an experiment to visualise the most recent global immmigration wave from 1990 to 2013 using [d3](https://d3js.org/) and [react](https://facebook.github.io/react/).

## Methodology

- The data is consumed using a Python script with [pandas](http://pandas.pydata.org/) and [NumPy](http://www.numpy.org/) data analysis libraries. 
- The map of the world is drawn using d3 and [topoJSON](https://github.com/topojson/topojson) data. 
- The centre of each country is identified on the map using d3 centroid function. 
- Migration flow animation using HTML5 canvas complete the data visualisation. 
- The code is written following some functional programming principles using the [lodash](https://lodash.com/) utility library. 
- The first part of this project is to visualise U.S. immigration data for the top 20 country of origins. 
- The project is a work in progress.

## Installation

### Dependencies

To get dependencies

`npm install`

Install [Webpack](https://webpack.js.org/) globally 

`npm install webpack-devserver webpack -g`

### Server

To serve at http://localhost:8080/webpack-dev-server/

`npm run watch`

### Build

To build when NODE_ENV environmental variable is set to production

`npm run deploy`

## Contributors

 - Jesse Tasse Gonzalez
 - Giorgio Leveroni
 - Andrew Deshernais
 - Darius Bacon
 
## License

Migreat is released under the The [MIT](https://opensource.org/licenses/MIT) License.

<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png' height='20px'/></a>
