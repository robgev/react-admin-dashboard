import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import LoadingScreen from './components/Loadingscreen';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import _ from 'lodash';

export default
class AdminPanel extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      name: '',
      password: '',
      newPassword: '',
      showBanner: false,
      selectedUser: '',
      bannerText: '',
      activeState: true,
      showDeleteModal: false,
      showAddModal: false,
      showEditModal: false,
    }
  }

  showBanner = (bannerText) => {
    this.setState({...this.state, showBanner: true, bannerText})
    setTimeout(() => {
      this.setState({...this.state, showBanner: false, bannerText: ''})
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
    const { deleteUser } = this.props; // Popup, modal smth else?
  }

  updatePhoto = () => { // Should think about a way of implementing
    const { updatePhoto } = this.props;
  }

  submitData = () => {
    const { changePass, updateName, updateEmail } = this.props;
    const { email, password, newPassword, name } = this.state;
    let shouldShowBanner = true;
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
      this.showBanner();
    }
  }

  toggleUserActiveState = async () => {
    const { toggleUserActiveState } = this.props;
    const { selectedUser, activeState } = this.state;
    await toggleUserActiveState(selectedUser);
    const bannerText = activeState ? 'disabled' : 'enabled';
    this.showBanner(`User was ${bannerText}`);
    this.setState({ ...this.state, activeState: !activeState  })
  }

  handleSelected = async (uid, e) => {
    const { getUserActiveState } = this.props;
    const { selectedUser } = this.state;
    const activeState = await getUserActiveState(uid);
    this.setState({ ...this.state, selectedUser: uid, activeState })
  }

  addNewUser = () => {
    const { email, password } = this.state;
    this.toggleAddModal();
    this.props.addNewUser(email, password);
    this.showBanner(`User was added`);
  }

  toggleAddModal = () => {
    const { showAddModal } = this.state;
    this.setState({...this.state, showAddModal: !showAddModal});
  }

  toggleEditModal = () => {
    const { showEditModal } = this.state;
    this.setState({...this.state, showEditModal: !showEditModal});
  }

  toggleDeleteModal = () => {
    const { showDeleteModal } = this.state;
    this.setState({...this.state, showDeleteModal: !showDeleteModal});
  }

  getUsersData = () => {
    const { user, dbRef } = this.props;
    const promise = dbRef.once('value');
    return (
        <LoadingScreen
          promise={ promise }
          whenPending= { () => {
            return (
              <tbody>
                <tr>
                  <td colSpan="5">
                    <div className="loading-screen users">
                      <img src="/loadingSmall.gif" />
                    </div>
                  </td>
                </tr>
              </tbody>
            )
          }}
          whenResolved={ snapshot => {
            const value = snapshot.val();
            const renderElms = _.map(value, (currentUserData, idx) => {
              const isSelected = this.state.selectedUser === idx ? 'selected' : '';
              return (
                <tr
                  key={idx}
                  onClick={this.handleSelected.bind(this, idx)}
                  className={isSelected}>
                  <td className={'row-cell'}>
                    <div>
                      {currentUserData.username}
                    </div>
                  </td>
                  <td className={'row-cell'}>
                    <div>
                      {currentUserData.created}
                    </div>
                  </td>
                  <td className={'row-cell'}>
                    <div>
                      {currentUserData.email}
                    </div>
                  </td>
                  <td className={'row-cell'}>
                    <div>
                      {currentUserData.password}
                    </div>
                  </td>
                  <td className={'row-cell'}>
                    <div>
                      {currentUserData.isAdmin ? 'true' : 'false'}
                    </div>
                  </td>
                </tr>
              );
            })
            return (
              <tbody>
                {renderElms}
              </tbody>
            );
          }}
        />
    );
  }

  render() {
    const {
      showBanner,
      bannerText,
      activeState,
      showAddModal,
      showEditModal,
      showDeleteModal
    } = this.state;
    console.log(showAddModal)
    const { user } = this.props;
    const { displayName, email, emailVerified, photoURL, uid, providerData } = user;
    return (
      <div className="adminContainer full-width">
        <Header
          user={user}
          admin={true}
          signOut={this.props.signOut}
        />
        <div className="admin-body">
          <div className="buttons">
            {
              showBanner &&
              <div className="success">{bannerText}</div>
            }
            <button onClick={this.toggleUserActiveState}>
              {
                activeState ? 'Deactivate' : 'Activate'
              }
            </button>
            <button onClick={this.toggleAddModal}>Add</button>
            <button onClick={this.toggleEditModal}>Edit</button>
            <button onClick={this.toggleDeleteModal}>Delete</button>
            {
              showAddModal &&
              <ModalContainer onClose={this.toggleAddModal}>
                <ModalDialog onClose={this.toggleAddModal} className="modal-dialog">
                  <h1>Enter Credentials</h1>
                  <p>Enter email and password for a new user</p>
                  <input
                    type='email'
                    placeholder='Email'
                    onChange={this.handleMailChange}
                  />
                  <input
                    type='password'
                    placeholder='Password'
                    onChange={this.handlePassChange}
                  />
                  <button
                    onClick={this.addNewUser}
                    style={{width: '131px'}}
                  >Add New User</button>
                </ModalDialog>
              </ModalContainer>
            }
            {
              showEditModal &&
              <ModalContainer onClose={this.toggleEditModal}>
                <ModalDialog onClose={this.toggleEditModal} className="modal-dialog">
                  <h1>Enter Credentials</h1>
                  <p>Enter email and password for a new user</p>
                  <input
                    type='email'
                    placeholder='Email'
                    onChange={this.mailChangeHandler}
                  />
                  <input
                    type='password'
                    placeholder='Password'
                    onChange={this.passChangeHandler}
                  />
                  <button
                    onClick={this.addNewUser}
                    style={{width: '131px'}}
                  >Add New User</button>
                </ModalDialog>
              </ModalContainer>
            }
            {
              showDeleteModal &&
              <ModalContainer onClose={this.toggleDeleteModal}>
                <ModalDialog onClose={this.toggleDeleteModal} className="modal-dialog">
                  <h1>Enter Credentials</h1>
                  <p>Enter email and password for a new user</p>
                  <input
                    type='email'
                    placeholder='Email'
                    onChange={this.mailChangeHandler}
                  />
                  <input
                    type='password'
                    placeholder='Password'
                    onChange={this.passChangeHandler}
                  />
                  <button
                    onClick={this.addNewUser}
                    style={{width: '131px'}}
                  >Add New User</button>
                </ModalDialog>
              </ModalContainer>
            }
          </div>
          <div className="table-body">
            <div className="toolbar">
              <i className="material-icons">search</i>
              <input
                type='text'
                className='search'
                placeholder=' Search by email address or user UID '
              />
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>
                      <div>
                        Name
                        <i className="material-icons">arrow_downward</i>
                      </div>
                    </th>
                    <th>
                      <div>
                        Created
                        <i className="material-icons">arrow_downward</i>
                      </div>
                    </th>
                    <th>
                      <div>
                        Email
                        <i className="material-icons">arrow_downward</i>
                      </div>
                    </th>
                    <th>
                      <div>
                        Password
                        <i className="material-icons">arrow_downward</i>
                      </div>
                    </th>
                    <th>
                      <div>
                        Is Admin
                        <i className="material-icons">arrow_downward</i>
                      </div>
                    </th>
                  </tr>
                </thead>
                { this.getUsersData() }
              </table>
              <div className="pagination">
                Rows per page:
                <div className="pagination-dropdown">
                  50
                </div>
                1-3 of 3
                <div className="pagination-buttons">
                  <button>
                    <i className="material-icons">chevron_left</i>
                  </button>
                  <button>
                    <i className="material-icons">chevron_right</i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
};
