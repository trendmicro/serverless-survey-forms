var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var folder = process.env.NODE_FOLDER ? process.env.NODE_FOLDER : 'portal';

// Postcss plugins
var postcssImport = require('postcss-import');
var postcssNested = require('postcss-nested');
var postcssVars = require('postcss-simple-vars');
var postcssMixins = require('postcss-mixins');
var postcssAssets = require('postcss-assets');
var postcssGradientfixer = require('postcss-gradientfixer');
var autoprefixer = require('autoprefixer');

// eslint folder path
var eslintFolder;
if (folder === 'feedback') {
    eslintFolder = [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'feedback')];
} else {
    eslintFolder = path.resolve(__dirname, 'portal');
}

var webpackConfig = {
    entry: [
        "html5shiv",
        "es5-shim/es5-shim",
        "es5-shim/es5-sham",
        "babel-polyfill",
        path.resolve(__dirname, folder + '/src/entry.js')
    ],
    output: {
        filename: `index.js?v=${Date.now()}`,
        path: path.resolve(__dirname, '../client/dist/' + folder)
    },
    module: {
        preLoaders: [
            {
                test: /\.js?$/,
                loader: 'eslint-loader',
                include: eslintFolder,
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', "css-loader?modules!postcss-loader"),
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'stage-0', 'react']
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=65000&mimetype=application/font-woff" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=65000&mimetype=application/octet-stream]" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=65000&mimetype=application/vnd.ms-fontobject" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=65000&mimetype=image/svg+xml" },
            { test: require.resolve("react"), loader: "imports?shim=es5-shim/es5-shim&sham=es5-shim/es5-sham" }
        ]
    },
    resolve: {
        alias: {
            JSON: path.resolve(__dirname, 'json')
        }
    },
    postcss: function plugins(bundler) {
        return [
            postcssImport({
                addDependencyTo: bundler
            }),
            postcssAssets({ loadPaths: ['assets/images/', 'assets/images/component/ruby/'] }),
            postcssMixins,
            postcssVars,
            postcssNested,
            postcssGradientfixer,
            autoprefixer({ browsers: 'last 2 version' })
        ];
    }
};

// Plugins for different environment
if (process.env.NODE_ENV === 'production') {
    webpackConfig.plugins = [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new ExtractTextPlugin(`styles.css?v=${Date.now()}`, { allChunks: true }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                unused: true,
                dead_code: true,
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({
            title: 'Qustom',
            template: path.resolve(__dirname, 'assets/html/index.html'),
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),
        new CopyWebpackPlugin(
            [{ from: 'assets/', to: '../assets/' }],
            { ignore: ['**/html/*', '**/fakedata/*'] }
        )
    ];
} else {
    webpackConfig.devtool = "source-map";
    webpackConfig.plugins = [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("styles.css", { allChunks: true }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"development"',
                'NODE_URL': JSON.stringify(process.env.NODE_URL)
            }
        })
    ];
}

module.exports = webpackConfig;
