import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

function Document({ title }) {
	return <Helmet defaultTitle="SSR" title={title} />;
}

Document.propTypes = {
	title: PropTypes.string.isRequired
};

export default Document;
