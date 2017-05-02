import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import DialogAction from './components/DialogAction';

export default
class SigninBox extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      showModal: false,
      showBanner: false,
    }
  }

  mailChangeHandler = (e) => {
    const email = e.target.value;
    this.setState({...this.state, email});
  }

  passChangeHandler = (e) => {
    const password = e.target.value;
    this.setState({...this.state, password});
  }

  handleSignIn = () => {
    const { email, password } = this.state;
    this.props.submit(email, password);
  }

  handleSignUp = () => {
    const { email, password } = this.state;
    this.props.signUp(email, password);
  }

  notifyAndReset = () => {
    this.setState({
      ...this.state,
      showModal: false,
      showBanner: true,
    })
    setTimeout(() => {
      this.setState({...this.state, showBanner: false})
    }, 1000)
  }

  passwordReset = () => {
    const { email } = this.state;
    this.props.passwordReset(email);
    this.notifyAndReset();
  }

  handleModalClose = () => {
    this.setState({...this.state, showModal: false});
  }

  modalShow = () => {
    this.setState({...this.state, showModal: true});
  }

  render() {
    const { email, password, showBanner, showModal } = this.state;
    return (
      <div className='signin-wrapper'>
        {
          showBanner &&
          <div className='banner'>
            Email sent successfully
          </div>
        }
        <div className='signin'>
          <h2>Apollo Bytes SignIn</h2>
          <div className='wrapper'>
            <TextField
              type='email'
              style={inputStyle}
              value={this.state.email}
              floatingLabelText='Email'
              onChange={this.mailChangeHandler}
            />
            <TextField
              type='password'
              style={inputStyle}
              value={this.state.password}
              floatingLabelText='Password'
              onChange={this.passChangeHandler}
            />
            <div className='buttons'>
              <FlatButton
                label='Sign In'
                onTouchTap={this.handleSignIn}
              />
              <FlatButton
                label='Sign Up'
                onTouchTap={this.handleSignUp}
              />
              <DialogAction
                flat
                email
                primary
                buttonText='Forgot Password?'
                modalAction={this.passwordReset}
                modalButtonText='Send'
                headerText='Enter your email'
                noticeText='We will send you an email with a reset link'
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const inputStyle = {
  width: '100%',
}
