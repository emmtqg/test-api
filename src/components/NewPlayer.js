/* eslint-disable no-alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import Add from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import green from '@material-ui/core/colors/green';

import './SideBySideComponents.css';
import config from './Config';

const { apiCamelizedLookup } = config;
const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    // marginLeft: theme.spacing.unit * 3,
    // marginRight: theme.spacing.unit * 3,
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
    backgroundColor: green[400],
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

// Values get passed to the API
const handedness = {
  NONE_SPECIFIED: 'none',
  LEFT: 'left',
  RIGHT: 'right',
};

class NewPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      rating: 0,
      handedness: handedness.NONE_SPECIFIED,
      remember: false,
      isAuthorized: false,
      isLoading: false,
      message: '',
      messageSuggest: '',
      labelWidth: 0,
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillMount() {
    // Here is a great place to redirect someone who is already logged in
    if (!this.props.auth.loggedIn()) {
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

  handleCancel = (e) => {
    e.preventDefault();
    this.props.history.replace('/roster');
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    if (!(this.state.handedness in handedness) &&
         (this.state.handedness === handedness.NONE_SPECIFIED)) {
      this.setState({
        message: 'Please make a selection for the perferred paddle hand.',
      });

      return null;
    }

    this.props.auth.newPlayer(this.state)
      .then((response) => {
        if (typeof response === typeof undefined) {
          this.setState({
            message: 'Could not create the player.',
            isLoading: false,
          });
        }
        const { player } = response;
        this.setState({
          message: `New team member ${player.firstName} ${player.lastName} is now on the team!`,
          messageSuggestion: 'Don\'t forget to get the a t-shirt!',
          isLoading: false,
        });

        return this.props.history.replace('/roster');
      })
      .catch((error) => {
        let message = `Adding a new player encountered an error: (${error.status}) ${error.message}.`;
        if (error.status === 409) {
          message = `This player already exsists in our player data. (${error.status}) ${error.message} was returned from the server.`;
        }
        this.setState({
          message,
          messageSuggest: 'Please recheck your player information.',
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
            <Add />
          </Avatar>
          <Typography component="h1" variant="h5">
            New Player
          </Typography>
          <Typography style={{ color: 'red' }} component="h6" variant="h6">
            {this.state.message}<br />
            {this.state.messageSuggest}
          </Typography>
          <form className={classes.form} onSubmit={this.handleFormSubmit}>
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
              <InputLabel htmlFor="email">Rating</InputLabel>
              <Input id="rating" name="rating" autoComplete="rating" onChange={this.handleChange} />
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="handedness">Choose</InputLabel>
              <Select
                value={this.state.handedness}
                onChange={this.handleChange}
                required
                fullWidth
                id="handedness"
                inputProps={{
                  name: 'handedness',
                  id: 'handedness',
                }}
              >
                <MenuItem value="" id="handedness.NONE">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={handedness.RIGHT}>Right</MenuItem>
                <MenuItem value={handedness.LEFT}>Left</MenuItem>
              </Select>
              <FormHelperText>Preferred Paddle Hand</FormHelperText>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onSubmit={this.handleSubmit}
            >
              Add Player
            </Button>
            <br /><br />
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={this.handleCancel}
            >
              Cancel
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

NewPlayer.defaultProps = {
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

NewPlayer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  auth: PropTypes.shape({
    loggedIn: PropTypes.func.isRequired,
    newPlayer: PropTypes.func.isRequired,
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

export default withStyles(styles)(NewPlayer);
