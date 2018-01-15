import React from 'react';
import styles from './app.css';

import Counter from '../counter/Counter';

function App() {
	return (
		<div className={styles.container}>
			<h1>Hello React SSR!</h1>
			<Counter />
		</div>
	);
}

export default App;
