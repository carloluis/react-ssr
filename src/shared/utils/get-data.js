function getData(props) {
	if (props.staticContext) {
		return props.staticContext.initialData;
	}
	const data = window._initialData_;
	delete window._initialData_;
	return data;
}

export default getData;
