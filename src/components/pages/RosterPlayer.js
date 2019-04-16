// @flow
import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Fab from '@material-ui/core/Fab';
import ClearIcon from '@material-ui/icons/Clear';
import { withStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

import '../styles/SideBySideComponents.scss';

// Roster table row/icon styles
const styles = theme => ({
  tableCell: {
    fontSize: '1.6rem',
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

  const deleteClass = `${classes.icon} delete`;

  return (
    <TableRow key={id}>
      <TableCell align="left" className={classes.tableCell}>{firstName} {lastName}</TableCell>
      <TableCell align="right" className={classes.tableCell}>{rating}</TableCell>
      <TableCell align="right" className={classes.tableCell}>{handedness}</TableCell>
      <TableCell align="center" className={deleteClass}>
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
