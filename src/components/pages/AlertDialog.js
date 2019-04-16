import React, { Component } from 'react';
import PropTypes from 'prop-types'; import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AlertDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      show,
      yesButtonTxt,
      noButtonTxt,
      cbHandleConfirm,
      cbHandleClose,
      message,
    } = this.props;

    return (
      <div id="Dialog">
        <Dialog
          open={show}
          onClose={cbHandleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          TransitionComponent={Transition}
        >
          <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cbHandleConfirm} color="primary" className="btnYes" autoFocus>
              {yesButtonTxt}
            </Button>
            {(noButtonTxt !== '') ?
              <Button onClick={this.props.cbHandleClose} className="btnNo" color="primary">
                {noButtonTxt}
              </Button> : null
            }
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AlertDialog.defaultProps = {
  title: 'Players',
  message: '',
  yesButtonTxt: 'OK',
  noButtonTxt: '',
};

AlertDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  yesButtonTxt: PropTypes.string,
  noButtonTxt: PropTypes.string,
  cbHandleConfirm: PropTypes.func.isRequired,
  cbHandleClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
};

export default AlertDialog;
