function routes(app) {
	app.use('/api/sample', require('./sample.route'));
	// include router modules here...
}

module.exports = routes;
