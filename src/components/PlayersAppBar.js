import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import logo from '../assets/logo-alchemy-white.svg';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  left: {
    textAlign: 'left',
  },
  right: {
    float: 'right',
  },
  menuButtonRight: {
    float: 'right',
    marginLeft: 10,
  },
};

class PlayersAppBar extends Component {
  constructor(props) {
    super(props);

    this.goTo = this.goTo.bind(this);
    this.logout = this.logout.bind(this);
  }

  goTo(route) {
    this.props.history.replace(`/${route}`);
  }

  logout() {
    this.props.auth.logout();
    this.goTo('');
  }

  render() {
    const { classes, auth } = this.props;
    const isAuthenticated = auth.loggedIn();

    return (
      <div className={classes.root}>
        <AppBar
          position="fixed"
          style={{ background: '#3f51b5' }}
        >
          <Toolbar>
            <img src={logo} alt="Alchemy Logo" height="50" width="136" />
            {
              !isAuthenticated && (
                <div style={{ float: 'right', width: '100%' }}>
                  <Button
                    id="Login"
                    color="secondary"
                    variant="contained"
                    className={classes.menuButtonRight}
                    onClick={() => this.goTo('login')}
                  >
                    Login
                  </Button>
                  <Button
                    id="Register"
                    color="secondary"
                    variant="contained"
                    className={classes.menuButtonRight}
                    onClick={() => this.goTo('register')}
                  >
                    Register
                  </Button>
                </div>
              )
            }
            {
              isAuthenticated && (
                <div style={{ width: '100%' }}>
                  <div style={{ float: 'right' }}>
                    <Button
                      color="secondary"
                      variant="contained"
                      className={classes.menuButtonRight}
                      onClick={this.logout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              )
            }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

PlayersAppBar.defaultProps = {
  auth: {},
  history: () => {
    this.setState({
      dialogOpen: true,
      dialogMessage: 'No history object passed to this page [Roster]',
    });
  },
};

PlayersAppBar.propTypes = {
  // Material-UI needs to see this defined as object -
  // the classes get wrapped with the styles via withStyles HOC.
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  auth: PropTypes.shape({
    loggedIn: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  }),
  // History object passed via Router or a function
  // that passed in unit tests via jest.
  history: PropTypes.oneOfType([
    PropTypes.shape({
      replace: PropTypes.func,
    }),
    PropTypes.func,
  ]),
};

export default withStyles(styles)(PlayersAppBar);
