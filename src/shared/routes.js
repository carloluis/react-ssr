import Home from './components/home/Home';
import About from './components/about/About';

const routes = [
	{
		path: '/',
		component: Home,
		exact: true
	},
	{
		path: '/about',
		component: About
	}
];

export default routes;
