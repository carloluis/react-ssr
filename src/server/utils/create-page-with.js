const serialize = require('serialize-javascript');

function createPageWith(config) {
	const { markup, ...headConfig } = config;
	const doc_html_head = createHeadWith(headConfig);

	return `
	${doc_html_head}
	<body>
		<div id="app">${markup}</div>
	</body>
	</html>
	`;
}

function createHeadWith(config) {
	const { title = 'React SSR Streamed', appcss, vendorjs, appjs, data } = config;

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
	</head>`;
}

module.exports = {
	createPageWith,
	createHeadWith
};
