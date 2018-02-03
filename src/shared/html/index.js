import React from 'react';
import PropTypes from 'prop-types';

const Html = ({ title, children, scripts, styles, data }) => {
	const { appjs, vendorjs } = scripts;

	return (
		<html>
			<head>
				<title>{title}</title>
				<link rel="icon" href="data:;base64,iVBORw0KGgo=" />
				<link rel="stylesheet" href={'/' + styles.appcss} />
				<script dangerouslySetInnerHTML={{ __html: `window._initialData_ = ${data};` }} />
			</head>
			<body>
				<div id="app">{children}</div>
				<script src={'/' + vendorjs} defer />
				<script src={'/' + appjs} defer />
			</body>
		</html>
	);
};

Html.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node,
	scripts: PropTypes.object,
	styles: PropTypes.object,
	data: PropTypes.string
};

export default Html;
