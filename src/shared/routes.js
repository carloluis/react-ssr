import Home from './home/Home';
import About from './about/About';

const routes = [
	{
		path: '/',
		component: Home,
		exact: true
	},
	{
		path: '/about',
		component: About
	},
	{
		path: '/stream',
		component: Home
	}
];

export default routes;
