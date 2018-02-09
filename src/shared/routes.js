import Home from './components/home/Home';
import About from './components/about/About';
import NotFound from './components/not-found/NotFound';

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
		component: NotFound
	}
];

export default routes;
