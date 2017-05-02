import React, {PureComponent} from 'react';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import colors from '../../colors';

export default
class DialogAction extends PureComponent {
  state = {
    name: '',
    email: '',
    open: false,
    password: '',
  };

  handleMailChange = e => {
    const email = e.target.value;
    this.setState({...this.state, email});
  }

  handleNameChange = e => {
    const name = e.target.value;
    this.setState({...this.state, name});
  }

  handlePassChange = e => {
    const password = e.target.value;
    this.setState({...this.state, password});
  }

  handleOpen = () => {
    this.setState({...this.state, open: true});
  };

  handleClose = () => {
    this.setState({...this.state, open: false});
  };

  touchTapHandler = () => {
    const {
      name,
      email,
      password,
    } = this.state;
    const {
      modalAction,
    } = this.props;
    modalAction(email, password, name);
    this.handleClose();
  }

  render() {
    const {
      flat,
      email,
      primary,
      disabled,
      password,
      secondary,
      headerText,
      buttonText,
      noticeText,
      buttonStyle,
      displayName,
      warningButton,
      modalButtonText,
    } = this.props;
    const actionButtonStyle = warningButton ? {secondary: true} : {primary: true};
    const defaultStyle = buttonStyle || null;
    const isPrimaryStyle = primary ? {primary: true} : defaultStyle;
    const modalOpeningButtonStyle = secondary ? {secondary: true} : isPrimaryStyle;
    const actions = [
      <RaisedButton
        label="Cancel"
        style={margined}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        style={margined}
        label={modalButtonText}
        onTouchTap={this.touchTapHandler}
        {...actionButtonStyle}
      />,
    ];

    return (
      <div>
        { flat ?
          <FlatButton
            style={margined}
            label={buttonText}
            onTouchTap={this.handleOpen}
            {...modalOpeningButtonStyle}
          />
          :
          <RaisedButton
            style={margined}
            label={buttonText}
            onTouchTap={this.handleOpen}
            {...modalOpeningButtonStyle}
          />
        }
        <Dialog
          title={headerText}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <p>{noticeText}</p>
          { !email ? null :
            <TextField
              type='email'
              style={margined}
              value={this.state.email}
              floatingLabelText='Email'
              onChange={this.handleMailChange}
            />
          }
          { !displayName ? null :
            <TextField
              type='text'
              style={margined}
              value={this.state.name}
              floatingLabelText='Display Name'
              onChange={this.handleNameChange}
            />
          }
          { !password ? null :
            <TextField
              type='password'
              style={margined}
              value={this.state.password}
              floatingLabelText='Password'
              onChange={this.handlePassChange}
            />
          }
        </Dialog>
      </div>
    );
  }
}

const margined = {
  margin: '5px',
}
