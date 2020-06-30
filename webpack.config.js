let path = require('path')

module.exports = {
    entry:  './game.ts',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname),
        filename: 'game.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    plugins: [

    ],
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    watch: true,
    mode: 'development'
}