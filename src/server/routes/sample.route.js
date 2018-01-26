const express = require('express');
const router = express.Router();

router.get('/', (request, response, next) => {
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
			text: 'React SSR',
			url: '/'
		},
		{
			id: 4,
			text: 'React SSR Stream',
			url: '/stream'
		}
	]);
});

router.get('/ack', (request, response, next) => {
	response.json(42);
});

module.exports = router;
