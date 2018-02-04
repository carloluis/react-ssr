import React from 'react';
import { Link } from 'react-router-dom';
import Counter from '../counter/Counter';
import getData from '../../utils/get-data';
import styles from './home.scss';

class Home extends React.Component {
	constructor(props) {
		super(props);
		const data = getData(props);
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
				<h1>Simple React SSR!</h1>
				<Counter />
				{!!data && <ul className={styles.list}>{data.map(item => <li key={item.id}>{item.text}</li>)}</ul>}
				<nav className={styles.nav}>
					<Link to="/about">about</Link>
				</nav>
			</div>
		);
	}
}

export default Home;
