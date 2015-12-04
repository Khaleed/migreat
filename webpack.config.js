var path = require('path')

module.exports = {

    devtool: 'source-map',

    entry: './app/js/app.js',

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
                loader: 'babel'
            },

            {
                test: /\.s?css$/,
                loaders: ["style", "css", "sass"]
            },

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