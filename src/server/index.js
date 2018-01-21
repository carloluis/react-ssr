import express from 'express';
import path from 'path';
import 'isomorphic-fetch';
import pageAssets from './utils/page-assets';
import serialize from 'serialize-javascript';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import routes from '../shared/routes';
import App from '../shared';

const DIST_DIR = path.join(__dirname, '../../dist');
const PORT = process.env.PORT || 3001;

const [appjs, vendorjs, appcss] = pageAssets();

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
		const stream = ReactDOM.renderToNodeStream(<App initialData={data} />);
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
			<StaticRouter location={req.url} context={context}>
				<App />
			</StaticRouter>
		);
		res.set('content-type', 'text/html');
		res.send(`
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<title>React SSR</title>
			<link rel="icon" href="data:;base64,iVBORw0KGgo=">
			<link rel="stylesheet" href="/${appcss}">
			<script src="/${vendorjs}" defer></script>
			<script src="/${appjs}" defer></script>
			<script>window._initialData_ = ${serialize(data)};</script>
		</head>
		<body>
			<div id="app">${markup}</div>
		</body>
		</html>
		`);
		res.end();
	});
});

app.listen(PORT, () => {
	console.info(`server is running on http://localhost:${PORT}`);
});
