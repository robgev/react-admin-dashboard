import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Footer from './components/Footer';
import Header from './components/Header';
import DialogAction from './components/DialogAction';

export default
class User extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      name: '',
      password: '',
      newPassword: '',
      showBanner : false,
      showAccDeleteModal : false,
    }
  }

  notifyAndReset = () => {
    this.setState({
      ...this.state, // Don't need this this time but whatever
      showBanner: true,
      email: '',
      name: '',
      password: '',
      newPassword: ''
    })
    setTimeout(() => {
      this.setState({...this.state, showBanner: false})
    }, 3000)
  }

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

  handleNewPassChange = e => {
    const newPassword = e.target.value;
    this.setState({...this.state, newPassword});
  }

  deleteAccount = () => { // Should think about a way of implementing
    const { deleteUser } = this.props;
    const { password } = this.state;
    deleteUser(password);
    this.delAccModalClose();
  }

  updatePhoto = () => { // Should think about a way of implementing
    const { updatePhoto } = this.props;
  }

  submitData = () => {
    const { changePass, updateName, updateEmail } = this.props;
    const { email, password, newPassword, name } = this.state;
    let shouldShowBanner = false;
    if(email.trim()) {
      updateEmail(email);
      shouldShowBanner = true;
    }
    if(password.trim() && newPassword.trim()) {
      changePass(password, newPassword);
      shouldShowBanner = true;
    }
    if(name.trim()) {
      updateName(name);
      shouldShowBanner = true;
    }
    if(shouldShowBanner) {
      this.notifyAndReset();
    }
  }

  delAccModalClose = () => {
    this.setState({...this.state, showAccDeleteModal: false});
  }

  delAccModalShow = () => {
    this.setState({...this.state, showAccDeleteModal: true});
  }

  render() {
    const { showBanner, showAccDeleteModal } = this.state;
    const { user, admin } = this.props;
    const { displayName, email, emailVerified, photoURL, uid, providerData } = user;
    return (
      <div className='userContainer full-width'>
        <Header
          user={user}
          admin={admin}
          signOut={this.props.signOut}
        />
        {
          showBanner ?
          <div className='banner'>
            Saved Sucessfully
          </div>
          : null
        }
        <div className='user-body'>
          <div className='image'>
            <img src={photoURL} />
            <DialogAction
              secondary
              warningButton
              modalButtonText='Delete'
              modalAction={this.deleteAccount}
              buttonText='Delete Current User'
              headerText='Are you sure you want to delete your account?'
              noticeText='Warning: this action cannot be undone'
            />
          </div>
          <div className='editableData'>
            <div className='form-group'>
              <TextField
                type='text'
                id='displayName'
                style={{width: '100%'}}
                value={this.state.name}
                onChange={this.handleNameChange}
                floatingLabelText='Change display name'
              />
            </div>
            <div className='form-group'>
              <TextField
                id='email'
                type='email'
                style={{width: '100%'}}
                value={this.state.email}
                onChange={this.handleMailChange}
                floatingLabelText='Change e-mail'
              />
            </div>
            <div className='form-group'>
              <TextField
                id='password'
                type='password'
                style={{width: '100%'}}
                onChange={this.handlePassChange}
                floatingLabelText='Current Password'
                value={ showAccDeleteModal ? '' : this.state.password}
              />
            </div>
            <div className='form-group'>
              <TextField
                type='password'
                style={{width: '100%'}}
                floatingLabelText='New Password'
                value={this.state.newPassword}
                onChange={this.handleNewPassChange}
              />
            </div>
            <RaisedButton
              primary
              label={'Save'}
              onTouchTap={this.submitData}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
};
