import React from 'react';
import styles from './counter.css';

class Counter extends React.Component {
	constructor(props) {
		super(props);
		this.handleDec = this.handleDec.bind(this);
		this.handleInc = this.handleInc.bind(this);
		this.state = { value: 0 };
	}
	handleDec() {
		this.setState({ value: this.state.value - 1 });
	}
	handleInc() {
		this.setState({ value: this.state.value + 1 });
	}
	render() {
		return (
			<div className={styles.container}>
				<button onClick={this.handleDec}>-</button>
				<span>{this.state.value}</span>
				<button onClick={this.handleInc}>+</button>
			</div>
		);
	}
}

export default Counter;
