import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

const Html = ({ children, scripts, styles, data }) => {
	const { appjs, vendorjs } = scripts;
	const helmet = Helmet.renderStatic();

	return (
		<html>
			<head>
				{helmet.title.toComponent()}
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
	children: PropTypes.node,
	scripts: PropTypes.object,
	styles: PropTypes.object,
	data: PropTypes.string
};

export default Html;
