import webpackStats from '../../../dist/webpack-stats.json';

function pageAssets() {
	return webpackStats.assets.map(asset => asset.name);
}

export default pageAssets;
