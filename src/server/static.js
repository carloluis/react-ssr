const express = require('express');
const path = require('path');
const serialize = require('serialize-javascript');
const { Helmet } = require('react-helmet');
require('isomorphic-fetch');

const getAssets = require('./utils/webpack-assets');
const template = require('./utils/template');
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
const { App, routes } = require('../shared/shared');

const DIST_DIR = path.join(__dirname, '../../dist');
const PORT = process.env.PORT || 3001;

const [appjs, vendorjs, appcss] = getAssets();

const app = express();

initServer(app);

app.use(express.static(DIST_DIR));

app.get('*', (req, res) => {
	const currentRoute = routes.find(route => matchPath(req.url, route));
	const { requestInitialData } = currentRoute.component;
	const dataRequested = requestInitialData && requestInitialData();

	Promise.resolve(dataRequested).then(data => {
		const context = { initialData: data };
		const markup = ReactDOM.renderToString(
			React.createElement(StaticRouter, { location: req.url, context }, React.createElement(App))
		);
		const helmet = Helmet.renderStatic();
		res.send(
			template({
				helmet,
				markup,
				scripts: { appjs, vendorjs },
				styles: { appcss },
				data: serialize(data)
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
