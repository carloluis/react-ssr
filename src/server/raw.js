const express = require('express');
const path = require('path');
const serialize = require('serialize-javascript');
require('isomorphic-fetch');
const webpackStats = require('../../dist/webpack-stats.json');
const createPageWith = require('./utils/create-page-with');
const React = require('react');
const ReactDOM = require('react-dom/server');
const { StaticRouter, matchPath } = require('react-router-dom');
const { default: App, routes } = require('../shared/shared');

const DIST_DIR = path.join(__dirname, '../../dist');
const PORT = process.env.PORT || 3001;

const [appjs, vendorjs, appcss] = webpackStats.assets.map(asset => asset.name);

const app = express();

app.use(express.static(DIST_DIR));

app.get('/api/sample', (req, res) => {
	res.json([
		{
			id: 1,
			text: 'React SSR',
			url: '/'
		},
		{
			id: 2,
			text: 'React SSR Stream',
			url: '/stream'
		}
	]);
});

app.get('/stream', (req, res) => {
	App.requestInitialData().then(data => {
		res.write(`<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<title>React SSR Stream</title>
		<link rel="stylesheet" href="/${appcss}">
		<script src="/${vendorjs}" defer></script>
		<script src="/${appjs}" defer></script>
		<script>window._initialData_ = ${JSON.stringify(data)};</script>
	</head>`);
		res.write('<div id="app">');
		const stream = ReactDOM.renderToNodeStream(React.createElement(App, { initialData: data }));
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
