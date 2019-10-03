let path = require('path');
let webpack = require('webpack');
let extractTextWebpackPlugin= require('extract-text-webpack-plugin');
let htmlWebpackPlugin = require('html-webpack-plugin');

let exptractPlugin = new extractTextWebpackPlugin({
    filename: 'minified.css'
});

module.exports = {
    entry: './js/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module:{
        rules:[
            {
                test: /\.css$/,
                // loader: 'css-loader'
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: exptractPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.(jpg|png)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img/'
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                    loader: 'file-loader',
                    options: {
                        name: 'file.html'
                    }
                }
                ],
                exclude: path.resolve(__dirname, 'index.html')
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
           $: 'jquery-3.4.1',
           jQuery: 'jquery-3.4.1',
           'window.$': 'jquery-3.4.1',
           'window.jQuery': 'jquery-3.4.1'
        }),
        exptractPlugin,
        new htmlWebpackPlugin({
            template: 'index.html'
        })
    ]
};