import express from 'express';
import path from 'path';
import pageAssets from './utils/page-assets';
import React from 'react';
import ReactDOM from 'react-dom/server';
import App from '../shared';

const DIST_DIR = path.join(__dirname, '../../dist');
const PORT = process.env.PORT || 3000;

const [appjs, vendorjs, appcss] = pageAssets();

const app = express();

app.use(express.static(DIST_DIR));

app.get('/stream', (req, res) => {
	res.write(`<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<title>React SSR Stream</title>
		<link rel="stylesheet" href="/${appcss}">
		<script src="/${vendorjs}" defer></script>
		<script src="/${appjs}" defer></script>
	</head>`);
	res.write('<div id="app">');
	const stream = ReactDOM.renderToNodeStream(<App />);
	stream.pipe(res, { end: false });
	stream.on('end', () => {
		res.write(`</div></body></html>`);
		res.end();
	});
});

app.get('*', (req, res) => {
	res.set('content-type', 'text/html');
	res.send(`<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<title>React SSR</title>
		<link rel="stylesheet" href="/${appcss}">
		<script src="/${vendorjs}" defer></script>
		<script src="/${appjs}" defer></script>
	</head>
	<body>
		<div id="app">${ReactDOM.renderToString(<App />)}</div>
	</body>
	</html>
	`);
	res.end();
});

app.listen(PORT, () => {
	console.info(`server is running on http://localhost:${PORT}`);
});
