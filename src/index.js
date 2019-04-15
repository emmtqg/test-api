import ReactDOM from 'react-dom';

import { makeMainRoutes } from './components/routes';
import './components/styles/index.scss';

const routes = makeMainRoutes();
ReactDOM.render(routes, document.getElementById('root'));
