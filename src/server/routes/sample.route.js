const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
	response.json([
		{
			id: 1,
			text: 'NodeJS',
			url: 'https://nodejs.org'
		},
		{
			id: 2,
			text: 'Express',
			url: 'http://expressjs.com'
		},
		{
			id: 3,
			text: 'React',
			url: 'https://reactjs.org'
		},
		{
			id: 4,
			text: 'SSR',
			url: 'https://reactjs.org/docs/react-dom-server.html'
		}
	]);
});

router.get('/ack', (request, response) => {
	response.json(42);
});

module.exports = router;
