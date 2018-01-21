const serialize = require('serialize-javascript');

function createPageWith(config) {
	const { title = 'React SSR', appcss, vendorjs, appjs, data, markup } = config;

	return `
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<title>${title}</title>
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
	`;
}

module.exports = createPageWith;
