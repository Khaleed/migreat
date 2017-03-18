var webpack = require('webpack');
var path = require('path');

module.exports = {

    devtool: 'source-map',

    entry: ['babel-polyfill', './app/js/app.jsx'],

    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: 'bundle.js'
    },

    node: {
        fs: "empty"
    },

    module: {
        loaders: [
            // Babel loader
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'stage-0', 'react']
                }
            },

            // {
            //     test: /\.s?css$/,
            //     loaders: ["style", "css", "sass"]
            // },

            {
                test: /\.json$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'json'
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.json', '.jsx', '']
    },

    plugins: [
        // Avoid duplicated stuff
        new webpack.optimize.DedupePlugin(),
        // Optimise occurence order
        new webpack.optimize.OccurenceOrderPlugin(),
        // only for production
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        // minimise output chunks of scripts/css
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ]
};
