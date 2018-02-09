import React from 'react';
import Document from '../document/Document';
import styles from './not-found.scss';

function NotFound() {
	return (
		<div className={styles.container}>
			<Document title="404 | SSR" />
			No page found!
		</div>
	);
}

export default NotFound;
