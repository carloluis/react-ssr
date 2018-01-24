const webpackStats = require('../../../dist/webpack-stats.json');

function getAssets() {
	return webpackStats.assets.map(asset => asset.name);
}

module.exports = getAssets;
