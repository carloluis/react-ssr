const headConfig = {
	'/': {
		title: 'Home | SSR'
	},
	'/about': {
		title: 'About | SSR'
	},
	'': {
		title: '404 | SSR'
	}
};

function getSEO({ path }) {
	return headConfig[path] || headConfig[''];
}

module.exports = getSEO;
