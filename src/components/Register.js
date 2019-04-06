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

import config from './Config';
import './SideBySideComponents.css';

const styles = theme => ({
  main: {
    maxWidth: 800,
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

const { apiCamelizedLookup } = config;
class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      remember: false,
      isLoading: false,
      error: false,
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
    // 'normalize' the underscore id's with the
    // state property fields to both satify project
    // API requirements and ESLINT rules.
    const { name } = event.target;
    const stateName = apiCamelizedLookup[name];
    this.setState({
      [stateName]: event.target.value,
    });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    /* confirm that password and password confirm are the same */
    if (!Object.is(this.state.password, this.state.confirmPassword)) {
      this.setState({
        message: 'Your confirmed password does not match the original password.',
        messageSuggest: 'Please recheck your password entry.',
      });
      return null;
    }

    // Here is where all the login logic will go. Upon clicking the login
    // button, a login method is invoked that will send the entered
    // credentials over to the server for verification. Once verified, it should
    // store the user's token and send you to the protected route.
    // this.props.auth.register(this.state);
    this.props.auth.register(this.state)
      .then(() => {
        this.setState({
          message: '',
          messageSuggest: '',
          isLoading: false,
        });

        return this.props.history.replace('/');
      })
      .catch((error) => {
        this.setState({
          message: `Registration encountered an error: (${error.status}) ${error.message}.`,
          messageSuggest: 'Please recheck your information.',
        });
      });

    return null;
  }

  render() {
    const { classes } = this.props;
    const { message } = this.state;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          { (this.state.message) ? <div><br /><hr /></div> : null }
          <Typography style={{ color: 'red' }} component="h5" variant="h5">
            {message}<br />
            {this.state.messageSuggest}
          </Typography>
          <form id="Register" className={classes.form} onSubmit={this.handleFormSubmit}>
            <div className="flexGrid">
              <div className="col">
                <FormControl margin="normal" required className="almostWidth">
                  <InputLabel htmlFor="first_name">First Name</InputLabel>
                  <Input id="first_name" name="first_name" autoComplete="first_name" autoFocus onChange={this.handleChange} />
                </FormControl>
              </div>
              <div className="col">
                <FormControl margin="normal" required className="justifyEnd">
                  <InputLabel htmlFor="last_name">Last Name</InputLabel>
                  <Input id="last_name" name="last_name" autoComplete="last_name" onChange={this.handleChange} />
                </FormControl>
              </div>
            </div>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input id="email" name="email" autoComplete="email" onChange={this.handleChange} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input name="password" type="password" id="password" autoComplete="current-password" onChange={this.handleChange} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="confirm_password">Confirm Password</InputLabel>
              <Input name="confirm_password" type="password" id="confirm_password" onChange={this.handleChange} />
            </FormControl>
            <Button
              id="btnRegister"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onSubmit={this.handleSubmit}
            >
              Register Me!
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

Register.defaultProps = {
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

Register.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  auth: PropTypes.shape({
    loggedIn: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
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

export default withStyles(styles)(Register);
