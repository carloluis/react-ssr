const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const fs = require('fs');

const PATHS = {
	client: path.join(__dirname, 'src/client'),
	server: path.join(__dirname, 'src/server'),
	shared: path.join(__dirname, 'src/shared'),
	dist: path.join(__dirname, 'dist'),
	src: path.join(__dirname, 'src')
};

const clientConfig = {
	context: __dirname,
	entry: {
		app: [PATHS.client],
		vendor: ['react', 'react-dom', 'react-router-dom', 'react-helmet', 'isomorphic-fetch']
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
				test: /\.scss$/,
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
						},
						{
							loader: 'sass-loader'
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
			},
			{
				test: /\.jsx?$/,
				use: ['eslint-loader'],
				include: PATHS.src,
				exclude: /node_modules/,
				enforce: 'pre'
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
							cachedAssets: true,
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
		excludeAssets: /.map$/,
		errors: true,
		warnings: true,
		env: true,
		hash: true,
		version: true
	},
	performance: {
		hints: 'warning',
		maxAssetSize: 512000,
		maxEntrypointSize: 5120000
	},
	watchOptions: {
		aggregateTimeout: 500,
		ignored: /node_modules/
	}
	// watch: true
};

const sharedConfig = {
	context: __dirname,
	entry: {
		shared: [path.join(PATHS.shared, 'server.js')]
	},
	target: 'node',
	node: {
		__dirname: true,
		__filename: true
	},
	externals: [/^[a-z\-0-9]/, 'react', 'react-dom', 'react-router-dom', 'react-helmet', 'isomorphic-fetch'],
	resolve: {
		extensions: ['.js', '.jsx']
	},
	output: {
		path: PATHS.shared,
		filename: '[name].js',
		libraryTarget: 'commonjs2'
	},
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
									node: 'current'
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
				test: /\.scss$/,
				use: [
					{
						loader: 'css-loader/locals',
						options: {
							modules: true,
							camelCase: 'dashes',
							localIdentName: '[path][name]__[local]'
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			}
		]
	},
	devtool: 'cheap-module-source-map',
	stats: {
		all: false,
		assets: true,
		chunks: true,
		timings: true,
		env: true,
		hash: true
	}
};

module.exports = [clientConfig, sharedConfig];
