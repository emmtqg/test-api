import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  main: {
    maxWidth: 750,
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    [theme.breakpoints.down('sm')]: {
      marginLeft: 5,
      marginRight: 5,
    },
    [theme.breakpoints.up((400 + theme.spacing.unit) * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      remember: false,
      message: '',
      messageSuggest: '',
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillMount() {
    // Here is a great place to redirect someone who is already logged in
    if (this.props.auth.loggedIn()) {
      this.props.history.replace('/');
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    // Here is where all the login logic will go. Upon clicking the login button,
    // we would like to utilize a login method that will send our entered
    // credentials over to the server for verification. Once verified, it should
    // store your token and send you to the protected route.

    this.props.auth.login(this.state)
      .then((response) => {
        // JWT is returned in response json
        if (typeof response.token === typeof undefined) {
          this.setState({
            message: 'Could not set your security token.',
            messageSuggest: 'Please try logging in again.',
          });
        }
        this.setState({
          message: 'Successful Login!',
          messageSuggest: '',
        });
        return this.props.history.replace('/roster');
      })
      .catch((error) => {
        this.setState({
          message: `Login encountered an error: (${error.status}) ${error.message}.`,
          messageSuggest: 'Please recheck your password.',
        });
      });

    return null;
  }

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          { (this.state.message) ? <div><br /><hr /></div> : null }
          <Typography style={{ color: 'red' }} component="h6" variant="h6">
            {this.state.message}<br />
            {this.state.messageSuggest}
          </Typography>
          <form id="formLogin" className={classes.form} onSubmit={this.handleFormSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input id="email" name="email" autoComplete="email" autoFocus onChange={this.handleChange} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input name="password" type="password" id="password" autoComplete="current-password" onChange={this.handleChange} />
            </FormControl>
            <Button
              type="submit"
              id="login"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onSubmit={this.handleSubmit}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

Login.defaultProps = {
  auth: {},
  // History object passed via Router or a function
  // that passed in unit tests via jest.
  history: PropTypes.oneOfType([
    PropTypes.shape({
      replace: () => {},
    }),
    () => {},
  ]),
};

Login.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  auth: PropTypes.shape({
    loggedIn: PropTypes.func,
    login: PropTypes.func,
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

export default withStyles(styles)(Login);
