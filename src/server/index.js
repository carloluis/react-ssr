import express from 'express';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import App from '../shared/app/App';

const DIST_DIR = path.join(__dirname, '../../dist');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(DIST_DIR));

app.get('*', (req, res) => {
	res.set('content-type', 'text/html');
	res.send(`
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<title>React SSR</title>
		<link rel="stylesheet" href="/app.css">
		<script src="/vendor.js" defer></script>
		<script src="/app.js" defer></script>
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
