var path = require('path');
var webpack = require('webpack');

module.exports = {

    devtool: 'source-map',

    entry: ['babel-polyfill', './app/js/app.jsx'],

    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/',
        filename: 'bundle.js'
    },

    devServer: {
        contentBase: "public/"
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
                    presets: ['es2015', 'stage-0', 'react'],
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
    }
}