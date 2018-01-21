import React from 'react';
import { Link } from 'react-router-dom';
import styles from './about.css';

function About() {
	return (
		<div className={styles.container}>
			About
			<div>
				<Link to="/">home</Link>
			</div>
		</div>
	);
}

export default About;
