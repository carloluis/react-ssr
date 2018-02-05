import React from 'react';
import { Link } from 'react-router-dom';
import Document from '../document/Document';
import styles from './about.scss';

function About() {
	return (
		<div className={styles.container}>
			<Document title="About | SSR" />
			About
			<div>
				<Link to="/">home</Link>
			</div>
		</div>
	);
}

export default About;
