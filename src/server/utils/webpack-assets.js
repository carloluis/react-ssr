const webpackStats = require('../../../dist/webpack-stats.json');

function getAssets() {
	return webpackStats.assets.map(asset => asset.name).filter(asset => /(.js|.css)$/.test(asset));
}

module.exports = getAssets;
