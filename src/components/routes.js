import React from 'react';
import { Route, Router, Redirect, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import App from './App';
import Login from './pages/Login';
import NewPlayer from './pages/NewPlayer';
import Register from './pages/Register';
import Roster from './pages/Roster';
import Splash from './pages/Splash';
import NotFoundURL from './pages/NotFoundURL';
import AuthHelperMethods from './auth/AuthHelperMethods';
import history from '../history';

const auth = new AuthHelperMethods();

const theme = createMuiTheme({
  typography: {
    // Tell Material-UI what the font-size on the html element is.
    htmlFontSize: 10,
    useNextVariants: true,
  },
});

export const makeMainRoutes = () => (
  <Router history={history} component={App}>
    <MuiThemeProvider theme={theme}>
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
    </MuiThemeProvider>
  </Router>
);

// export default withStyles(styles)(makeMainRoutes);
export default makeMainRoutes;
