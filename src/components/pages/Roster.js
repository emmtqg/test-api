import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import AlertDialog from './AlertDialog';

import RosterPlayer from './RosterPlayer';
import '../styles/SideBySideComponents.scss';

// Layout styles
const styles = theme => ({
  root: {
    minWidth: 500,
    maxWidth: 720,
    flexGrow: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    overflowX: 'auto',
    fontSize: '1.6rem',
  },
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginTop: 50,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    [theme.breakpoints.up((400 + theme.spacing.unit) * 3 * 2)]: {
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    minWidth: 400,
    maxWidth: 700,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '.3rem',
  },
  table: {
    minWidth: 400,
    maxWidth: 700,
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  tableCell: {
    fontSize: '1.6rem',
  },
  fab: {
    margin: theme.spacing.unit,
    color: 'green',
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  alignTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  col: {
    display: 'inline-block',
    margin: '10 10',
  },
  subTitle: {
    marginBottom: '2rem',
  },
});

class Roster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      message: '',
      dialogShow: false,
      dialogMessage: '',
      yesButtonTxt: 'OK',
      noButtonTxt: '',
      removeId: '',
      cbHandleConfirm: () => {},
    };

    this.addPlayer = this.addPlayer.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
  }

  componentWillMount() {
    if (!this.props.auth.loggedIn()) {
      this.props.history.replace('/login');
    }
  }

  componentDidMount() {
    this.props.auth.getPlayers()
      .then((response) => {
        if (response) {
          const { players } = response;
          const camelizedPlayers = players.map(p =>
            ({
              firstName: p.first_name,
              lastName: p.last_name,
              id: p.id,
              rating: p.rating,
              handedness: p.handedness,
            }));

          this.setState({
            players: camelizedPlayers,
          });

          this.setPlayerCount();
        }
      })
      .catch((error) => {
        this.setState({
          players: [],
          message: error.message,
        });
      });
  }

  setPlayerCount() {
    const nPlayers = this.state.players.length;
    const getPlayersString = (n) => {
      const nplayerString = {
        0: 'are no players',
        1: 'is 1 player',
        default: `are ${nPlayers} players`,
      };
      return (nplayerString[n] || nplayerString.default);
    };
    const playersTxt = getPlayersString(nPlayers);
    this.setState({
      message: `There ${playersTxt} on your roster.`,
    });
  }

  getPlayerById(id) {
    return this.state.players.find(p => p.id === id);
  }

  addPlayer() {
    this.props.history.replace('/player/new');
  }

  showDialog = (id) => {
    let message = '';
    const player = this.getPlayerById(id);
    if (typeof player !== typeof undefined) {
      message = `Please confirm removal of ${player.firstName} ${player.lastName}.`;
      this.setState({
        removeId: id,
        dialogShow: true,
        dialogMessage: message,
        yesButtonTxt: 'Remove',
        noButtonTxt: 'Cancel',
        cbHandleConfirm: this.removePlayer,
      });
    } else {
      message = 'There was a problem removing this player: their ID was not recognized on the current roster.';
      this.setState({
        removeId: id,
        dialogShow: true,
        dialogMessage: message,
        yesButtonTxt: 'OK',
        noButtonTxt: '',
        cbHandleConfirm: this.hideDialog,
      });
    }
  };

  hideDialog = () => {
    this.setState({
      removeId: '',
      dialogShow: false,
      dialogMessage: '',
      yesButtonTxt: 'OK',
      noButtonTxt: '',
      cbHandleConfirm: this.removePlayer,
    });
  };

  removePlayer() {
    this.hideDialog();
    const { removeId } = this.state;
    this.props.auth.removePlayer(removeId)
      .then((response) => {
        if (response.success && response.success === true) {
          this.setState({
            players: this.state.players.filter(player => (player.id !== removeId)),
            removeId: '',
          });
          this.setPlayerCount();
        }
      })
      .catch((error) => {
        this.setState({
          removeId: '',
          dialogShow: true,
          dialogMessage: error.message,
          cbHandleConfirm: this.hideDialog,
          yesButtonTxt: 'OK',
          noButtonTxt: '',
        });
      });
  }

  render() {
    const { classes, ...other } = this.props;
    const { message } = this.state;

    return (
      <main className={classes.main}>
        <div id="Roster">
          <AlertDialog
            show={this.state.dialogShow}
            yesButtonTxt={this.state.yesButtonTxt}
            noButtonTxt={this.state.noButtonTxt}
            cbHandleConfirm={this.state.cbHandleConfirm}
            cbHandleClose={this.hideDialog}
            message={this.state.dialogMessage}
          />
          <div classes={classes.alignTop}>
            <div className={classes.col}>
              <Typography component="h5" variant="h5">
                <em>The</em> Roster
              </Typography>
            </div>
            <div className={classes.col}>
              <Fab size="small" aria-label="Add" className={classes.fab}>
                <AddIcon onClick={this.addPlayer} />
              </Fab>
            </div>
          </div>
          <Typography component="h6" variant="h6" className={classes.subTitle}>
            {message}
          </Typography>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableCell}>Player</TableCell>
                  <TableCell className={classes.tableCell} align="right">Rating</TableCell>
                  <TableCell className={classes.tableCell} align="right">Preferred Hand</TableCell>
                  <TableCell className={classes.tableCell} align="center">Remove</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.players.map(player => (
                  <RosterPlayer
                    {...other}
                    key={player.id}
                    player={player}
                    cbRemovePlayer={this.showDialog}
                      // this.removePlayer(player.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </main>
    );
  }
}

Roster.defaultProps = {
  history: () => {
    this.setState({
      dialogShow: true,
      dialogMessage: 'No history object passed to this page [Roster]',
    });
  },
};

Roster.defaultProps = {
  auth: {},
};

Roster.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func,
  }),
  auth: PropTypes.shape({
    loggedIn: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    getPlayers: PropTypes.func.isRequired,
    removePlayer: PropTypes.func.isRequired,
  }),
};

export default withStyles(styles)(Roster);
