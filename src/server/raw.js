const express = require('express');
const path = require('path');
const serialize = require('serialize-javascript');
require('isomorphic-fetch');
const webpackStats = require('../../dist/webpack-stats.json');

const React = require('react');
const ReactDOM = require('react-dom/server');
const App = require('../shared/shared').default;

const DIST_DIR = path.join(__dirname, '../../dist');
const PORT = process.env.PORT || 3000;

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
	App.requestInitialData().then(data => {
		res.set('content-type', 'text/html');
		res.send(`<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<title>React SSR</title>
			<link rel="stylesheet" href="/${appcss}">
			<script src="/${vendorjs}" defer></script>
			<script src="/${appjs}" defer></script>
			<script>window._initialData_ = ${serialize(data)};</script>
		</head>
		<body>
			<div id="app">${ReactDOM.renderToString(React.createElement(App, { initialData: data }))}</div>
		</body>
		</html>
		`);
		res.end();
	});
});

app.listen(PORT, () => {
	console.info(`server is running on http://localhost:${PORT}`);
});
