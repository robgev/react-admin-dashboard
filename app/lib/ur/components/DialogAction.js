import React, {PureComponent} from 'react';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import colors from '../../colors';

export default
class DialogAction extends PureComponent {
  state = {
    open: false,
    email: '',
    name: '',
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

  render() {
    const {
      email,
      password,
      headerText,
      buttonText,
      noticeText,
      modalAction,
      displayName,
      warningButton,
      modalButtonText,
    } = this.props;
    const buttonStyle = warningButton ? {secondary: true} : {primary: true};
    const actions = [
      <RaisedButton
        label="Cancel"
        style={margined}
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        style={margined}
        label={modalButtonText}
        onTouchTap={modalAction}
        {...buttonStyle}
      />,
    ];

    return (
      <div>
        <RaisedButton
          primary
          style={margined}
          label={buttonText}
          onTouchTap={this.handleOpen}
        />
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
              value={this.state.value}
              floatingLabelText='Email'
              onChange={this.handleMailChange}
            />
          }
          { !displayName ? null :
            <TextField
              type='text'
              style={margined}
              value={this.state.value}
              floatingLabelText='Display Name'
              onChange={this.handleNameChange}
            />
          }
          { !password ? null :
            <TextField
              type='password'
              style={margined}
              value={this.state.value}
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
