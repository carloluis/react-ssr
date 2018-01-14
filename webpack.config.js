const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const fs = require('fs');

const PATHS = {
	client: path.join(__dirname, 'src/client'),
	server: path.join(__dirname, 'src/server'),
	shared: path.join(__dirname, 'src/shared'),
	dist: path.join(__dirname, 'dist')
};

const clientConfig = {
	context: __dirname,
	entry: {
		app: [PATHS.client],
		vendor: ['react', 'react-dom']
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	output: {
		path: PATHS.dist,
		filename: '[name].js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.(jpg|png|gif|svg|woff|woff2|mp4|eot|ttf)$/,
				use: 'file-loader'
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								modules: true,
								camelCase: 'dashes',
								localIdentName: '[path][name]__[local]',
								minimize: false
							}
						}
					]
				})
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: [
						[
							'env',
							{
								targets: {
									browsers: ['last 2 versions'],
									uglify: true
								}
							}
						],
						'react'
					]
				}
			}
		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: '[name].css'
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'vendor.js'
		}),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new webpack.NamedModulesPlugin(),
		function() {
			this.plugin('done', stats => {
				fs.writeFileSync(
					path.join(PATHS.dist, 'webpack-stats.json'),
					JSON.stringify(
						stats.toJson({
							all: false,
							assets: true,
							excludeAssets: /.map$/,
							hash: true,
							timings: true
						})
					)
				);
			});
		}
	],
	devtool: 'source-map',
	stats: {
		all: false,
		assets: true,
		children: true,
		timings: true,
		chunks: false,
		entrypoints: false,
		env: true,
		hash: true,
		version: true
	},
	watchOptions: {
		aggregateTimeout: 500,
		ignored: /node_modules/
	}
	// watch: true
};

const serverConfig = {
	context: __dirname,
	entry: {
		server: [PATHS.server]
	},
	target: 'node',
	node: {
		__dirname: true,
		__filename: true
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	output: {
		path: __dirname,
		filename: '[name].js',
		libraryTarget: 'commonjs2'
	},
	// devtool: 'cheap-module-source-map',
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: [
						[
							'env',
							{
								targets: {
									browsers: ['last 2 versions'],
									node: 'current',
									uglify: true
								},
								modules: 'commonjs'
							}
						],
						'react'
					]
				}
			},
			{
				test: /\.(jpg|png|gif|svg|woff|woff2|mp4|eot|ttf)$/,
				loader: 'file-loader',
				options: {
					emit: false
				}
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'css-loader/locals',
						options: {
							modules: true,
							camelCase: 'dashes',
							localIdentName: '[path][name]__[local]'
						}
					}
				]
			}
		]
	},
	stats: {
		all: false,
		assets: true,
		chunks: true,
		excludeAssets: /.map$/,
		timings: true,
		env: true,
		hash: true
	}
};

module.exports = [clientConfig, serverConfig];
