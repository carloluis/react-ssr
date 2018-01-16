import React from 'react';
import styles from './app.css';

import Counter from '../counter/Counter';

class App extends React.Component {
	constructor(props) {
		super(props);

		let data = props.initialData;
		if (!data) {
			data = window._initialData_;
			delete window._initialData_;
		}
		this.state = { data };
	}

	componentDidMount() {
		if (!this.state.data) {
			App.requestInitialData().then(data => this.setState({ data }));
		}
	}

	static requestInitialData() {
		return fetch(`http://localhost:3000/api/sample`).then(response => response.json());
	}

	render() {
		return (
			<div className={styles.container}>
				<h1>Hello React SSR!</h1>
				<Counter />
				<ul>{this.state.data.map(item => <li key={item.id}>{item.text}</li>)}</ul>
			</div>
		);
	}
}

export default App;
