import React from 'react';
import { Link } from 'react-router-dom';
import Counter from '../counter/Counter';
import styles from './home.css';

class Home extends React.Component {
	constructor(props) {
		super(props);
		let data = props.staticContext && props.staticContext.initialData;
		if (!data) {
			data = window._initialData_;
			delete window._initialData_;
		}
		this.state = { data };
	}

	componentDidMount() {
		if (!this.state.data) {
			Home.requestInitialData().then(data => this.setState({ data }));
		}
	}

	static requestInitialData() {
		return fetch(`http://localhost:3001/api/sample`).then(response => response.json());
	}

	render() {
		const { data } = this.state;
		return (
			<div className={styles.container}>
				<h1>Hello React SSR!</h1>
				<Counter />
				{!!data && <ul>{data.map(item => <li key={item.id}>{item.text}</li>)}</ul>}
				<div>
					<Link to="/about">about</Link>
				</div>
			</div>
		);
	}
}

export default Home;
