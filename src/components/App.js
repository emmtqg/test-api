// @flow
import React from 'react';
import AuthHelperMethods from './Auth/AuthHelperMethods';
import PlayersAppBar from './PlayersAppBar';
import './App.css';

const auth = new AuthHelperMethods();

// Props are route { auth, history, location, match } from BrowserRouter
const App = props => <PlayersAppBar {...props} auth={auth} />;

export default App;
