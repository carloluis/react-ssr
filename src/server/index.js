const express = require('express');
const path = require('path');
const serialize = require('serialize-javascript');
require('isomorphic-fetch');

const { createPageWith, createHeadWith } = require('./utils/create-page-with');
const getAssets = require('./utils/webpack-assets');
const {
	configureBodyParser,
	configureCompression,
	configureCors,
	configureErrorHandler,
	configureRequestLogger
} = require('./utils/configure');

const React = require('react');
const ReactDOM = require('react-dom/server');
const { StaticRouter, matchPath } = require('react-router-dom');
const { default: App, routes } = require('../shared/shared');

const DIST_DIR = path.join(__dirname, '../../dist');
const PORT = process.env.PORT || 3001;

const [appjs, vendorjs, appcss] = getAssets();

const app = express();

initServer(app);

app.use(express.static(DIST_DIR));

app.get('/stream', (req, res) => {
	const currentRoute = routes.find(route => matchPath('/', route));
	const { requestInitialData } = currentRoute.component;
	const dataRequested = requestInitialData && requestInitialData();

	Promise.resolve(dataRequested).then(data => {
		res.write(
			createHeadWith({
				appcss,
				appjs,
				vendorjs,
				data
			})
		);
		res.write('<body><div id="app">');
		const context = { initialData: data };
		const stream = ReactDOM.renderToNodeStream(
			React.createElement(StaticRouter, { location: req.url, context }, React.createElement(App))
		);
		stream.pipe(res, { end: false });
		stream.on('end', () => {
			res.write(`</div></body></html>`);
			res.end();
		});
	});
});

app.get('*', (req, res) => {
	const currentRoute = routes.find(route => matchPath(req.url, route));
	const { requestInitialData } = currentRoute.component;
	const dataRequested = requestInitialData && requestInitialData();

	Promise.resolve(dataRequested).then(data => {
		const context = { initialData: data };
		const markup = ReactDOM.renderToString(
			React.createElement(StaticRouter, { location: req.url, context }, React.createElement(App))
		);
		res.set('content-type', 'text/html');
		res.send(
			createPageWith({
				appcss,
				appjs,
				vendorjs,
				data,
				markup
			})
		);
		res.end();
	});
});

app.listen(PORT, () => {
	console.info(`server is running on http://localhost:${PORT}`);
});

function initServer(app) {
	configureCors(app);
	configureBodyParser(app);
	configureErrorHandler(app);
	configureCompression(app);
	configureRequestLogger(app);

	require('./routes')(app);
}
