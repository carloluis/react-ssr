import React from 'react';

const Html = ({ title, children, scripts, styles }) => {
	const { appjs, vendorjs } = scripts;

	return (
		<html>
			<head>
				<title>{title}</title>
				<link rel="stylesheet" href={styles.appcss} />
			</head>
			<body>
				<div id="app">{children}</div>
				<script src={vendorjs} defer />
				<script src={appjs} defer />
			</body>
		</html>
	);
};

export default Html;
