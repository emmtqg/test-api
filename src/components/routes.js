import React from 'react';
import { Route, Router, Redirect, Switch } from 'react-router-dom';
import App from './App';
import Login from './Login';
import NewPlayer from './NewPlayer';
import Register from './Register';
import Roster from './Roster';
import Splash from './Splash';
import NotFoundURL from './NotFoundURL';
import AuthHelperMethods from './Auth/AuthHelperMethods';
import history from '../history';

const auth = new AuthHelperMethods();

export const makeMainRoutes = () => (
  <Router history={history} component={App}>
    <div className="container">
      <Route path="/" render={props => <App auth={auth} {...props} />} />
      <Switch>
        <Route
          exact
          path="/"
          render={props => (
            auth.loggedIn() ? (
              <div>
                <Roster auth={auth} {...props} />
              </div>
            ) : (
              <Redirect to="/splash" />
              // <Redirect to="/login" /> // Expressway to login
            )
          )}
        />
        <Route path="/login" render={props => <Login auth={auth} {...props} />} />
        <Route path="/player/new" render={props => <NewPlayer auth={auth} {...props} />} />
        <Route path="/register" render={props => <Register auth={auth} {...props} />} />
        <Route path="/roster" render={props => <Roster auth={auth} {...props} />} />
        <Route path="/splash" render={props => <Splash auth={auth} {...props} />} />
        <Route render={() => <NotFoundURL />} />
      </Switch>
    </div>
  </Router>
);

export default makeMainRoutes;
