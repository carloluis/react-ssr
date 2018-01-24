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
		vendor: ['react', 'react-dom', 'react-router-dom', 'isomorphic-fetch']
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	output: {
		path: PATHS.dist,
		filename: '[name].[chunkhash].js',
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
								camelCase: 'dashes',
								minimize: true,
								modules: true
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
			filename: '[name].[chunkhash].css'
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			filename: 'vendor.[chunkhash].js'
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		}),
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	}
		// }),
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
	devtool: 'hidden-source-map',
	stats: {
		all: false,
		assets: true,
		children: true,
		timings: true,
		chunks: false,
		entrypoints: false,
		excludeAssets: /.map$/,
		env: true,
		hash: true,
		version: true
	},
	performance: {
		hints: 'error',
		maxAssetSize: 1000000
	}
};

const sharedConfig = {
	context: __dirname,
	entry: {
		shared: [PATHS.shared]
	},
	target: 'node',
	node: {
		__dirname: true,
		__filename: true
	},
	externals: [/^[a-z\-0-9]/, 'react', 'react-dom', 'react-router-dom', 'isomorphic-fetch'],
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
				test: /\.css$/,
				use: [
					{
						loader: 'css-loader/locals',
						options: {
							modules: true,
							camelCase: 'dashes'
						}
					}
				]
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		})
	],
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
