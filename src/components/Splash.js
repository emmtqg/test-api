import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const Splash = props => (
  <div className="splash">
    <Typography variant="h5" color="inherit">
      {props.title}
    </Typography>
    <Typography variant="h6" color="inherit">
      <p className="lead">Your headquarters for all Office Ping Pong</p>
    </Typography>
  </div>
);

Splash.defaultProps = {
  title: 'Players Mecca',
};

Splash.propTypes = {
  title: PropTypes.string,
};

export default Splash;
