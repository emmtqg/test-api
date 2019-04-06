// @flow
import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Fab from '@material-ui/core/Fab';
import ClearIcon from '@material-ui/icons/Clear';
import { withStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

import './SideBySideComponents.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
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
  icon: {
    colorAction: red[500],
    margin: '0 auto',
  },
  iconHover: {
    color: red[500],
    margin: theme.spacing.unit * 2,
    '&:hover': {
      color: red[800],
    },
  },
  fab: {
    margin: theme.spacing.unit,
    backgroundColor: 'white',
    color: 'red',
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

const RosterPlayer = ({ player, cbRemovePlayer, classes }) => {
  const {
    id,
    firstName,
    lastName,
    rating,
    handedness,
  } = player;

  return (
    <TableRow key={id}>
      <TableCell align="left">{firstName} {lastName}</TableCell>
      <TableCell align="right">{rating}</TableCell>
      <TableCell align="right">{handedness}</TableCell>
      <TableCell align="center" className={classes.icon}>
        <Fab
          aria-label="Delete"
          size="small"
          className={classes.fab}
          onClick={() => cbRemovePlayer(id)}
        >
          <ClearIcon />
        </Fab>
      </TableCell>
    </TableRow>
  );
};

RosterPlayer.defaultProps = {
  player: {},
};

RosterPlayer.propTypes = {
  player: PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    handedness: PropTypes.string.isRequired,
  }),
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  cbRemovePlayer: PropTypes.func.isRequired,
};

export default withStyles(styles)(RosterPlayer);
