import Home from './components/home/Home';
import About from './components/about/About';
import Counter from './components/counter/Counter';

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
		component: Counter
	}
];

export default routes;
