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
        filename: 'index.js?[hash]',
        path: path.resolve(__dirname, '../client/dist/' + folder)
    },
    module: {
        rules: [
            // 2019.08.14 Sam_Kuo
            // Temporary skip eslint.
            // In order to solve WS-2018-0592 issue, the eslint need to upgrade to >4.18.2
            // However, the old eslint rule is incompatible with new eslint.
            // {
            //     test: /\.js?$/,
            //     enforce: "pre",
            //     loader: 'eslint-loader',
            //     include: eslintFolder,
            //     exclude: /node_modules/
            // },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        // https://github.com/postcss/postcss-loader/issues/92
                        { loader: 'css-loader', query: { modules: true, sourceMap: true } },
                        {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function() {
                                return [
                                    // https://github.com/postcss/postcss-loader/issues/92
                                    postcssImport(),
                                    postcssAssets({ loadPaths: ['assets/images/', 'assets/images/component/ruby/'] }),
                                    postcssMixins,
                                    postcssVars,
                                    postcssNested,
                                    postcssGradientfixer,
                                    autoprefixer({ browsers: 'last 2 version' })
                                ];
                            }
                        }
                    }]
                })
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['env', { 'module': false }], 'react']
                    }
                }
            },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=10000' },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=65000&mimetype=application/font-woff" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=65000&mimetype=application/octet-stream]" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=65000&mimetype=application/vnd.ms-fontobject" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=65000&mimetype=image/svg+xml" },
            {
                test: require.resolve("react"),
                loader: "imports-loader",
                options: {
                    shim: 'es5-shim/es5-shim',
                    sham: 'es5-shim/es5-sham'
                }
            }
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        console: true
    },
    resolve: {
        mainFields: ['jsnext:main','main'],
        alias: {
            JSON: path.resolve(__dirname, 'json'),
            moment: 'moment/moment.js',
            inherits$: path.resolve(__dirname, 'node_modules/inherits')
        }
    }
};

// Plugins for different environment
if (process.env.NODE_ENV === 'production') {
    webpackConfig.devtool = "cheap-module-source-map";
    webpackConfig.plugins = [
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({filename: 'styles.css?[hash]', allChunks: true }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
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
    webpackConfig.devtool = "cheap-module-eval-source-map";
    webpackConfig.plugins = [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({filename: "styles.css", allChunks: true }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"development"',
                'NODE_URL': JSON.stringify(process.env.NODE_URL)
            }
        })
    ];
}

module.exports = webpackConfig;
