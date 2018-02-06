function Template({ helmet, markup, scripts, styles, data }) {
	const { appjs, vendorjs } = scripts;

	return `<!doctype html>
	<html ${helmet.htmlAttributes.toString()}>
	<head>
		${helmet.title.toString()}
		${helmet.meta.toString()}
		<link rel="stylesheet" href="/${styles.appcss}">
		<script>window._initialData_ = ${data};</script>
	</head>
	<body ${helmet.bodyAttributes.toString()}>
		<div id="app">${markup}</div>
		<script src="/${vendorjs}" defer></script>
		<script src="/${appjs}" defer></script>
	</body>
	</html>`;
}

module.exports = Template;
