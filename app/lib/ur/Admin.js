import React, { Component } from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import {map} from 'lodash';
import { generate_request } from '../utils';

export default
class AdminPanel extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      name: '',
      password: '',
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

  deleteAccount = async () => {
    const { selectedUser } = this.state;
    this.toggleDeleteModal();
    const send_to_server = generate_request({uid: selectedUser});
    const answer = await fetch(`/manageusers/delete`, send_to_server);
    const answer_json = await answer.json();
    this.showBanner(`User was deleted`);
  }

  updatePhoto = () => { // Should think about a way of implementing
    const { updatePhoto } = this.props;
  }

  updateUserData = async () => {
    const { email, password, name, selectedUser } = this.state;
    let shouldShowBanner = true;
    const updatedData = {}
    if(email.trim()) {
      updatedData.email = email;
      shouldShowBanner = true;
    }
    if(password.trim()) {
      updatedData.password = password;
      shouldShowBanner = true;
    }
    if(name.trim()) {
      updatedData.name = name;
      shouldShowBanner = true;
    }
    const send_to_server = generate_request({...updatedData, uid: selectedUser});
    const answer = await fetch(`/manageusers/edit`, send_to_server);
    const answer_json = await answer.json();
    if(shouldShowBanner) {
      this.showBanner(`User info was updated`);
    }
  }

  toggleUserActiveState = async () => {
    const { selectedUser, activeState } = this.state;
    const send_to_server = generate_request({uid: selectedUser});
    const answer = await fetch(`/manageusers/deactivate`, send_to_server);
    const answer_json = await answer.json();
    const bannerText = activeState ? 'disabled' : 'enabled';
    this.showBanner(`User was ${bannerText}`);
    this.setState({ ...this.state, activeState: !activeState  })
  }

  handleSelected = async (uid, e) => {
    const send_to_server = generate_request({uid});
    const data = await fetch(`/manageusers/activestatus`, send_to_server);
    const answer = await data.json();
    this.setState({ ...this.state, selectedUser: uid, activeState: !answer.disabled})
  }

  addNewUser = async () => {
    const { email, password } = this.state;
    this.toggleAddModal();
    const send_to_server = generate_request({email, password});
    const answer = await fetch(`/manageusers/add`, send_to_server);
    const answer_json = await answer.json();
    this.showBanner(`User was added`);
  }

  // Toggles

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

  // End

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
                  <td colSpan='5'>
                    <div className='loading-screen users'>
                      <img src='/images/loadingSmall.gif' />
                    </div>
                  </td>
                </tr>
              </tbody>
            )
          }}
          whenResolved={ snapshot => {
            const value = snapshot.val();
            const renderElms = map(value, (currentUserData, uid) => {
              const isSelected = this.state.selectedUser === uid ? 'selected' : '';
              return (
                <tr
                  key={uid}
                  onClick={this.handleSelected.bind(this, uid)}
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
    const { user } = this.props;
    const { displayName, email, emailVerified, photoURL, uid, providerData } = user;
    return (
      <div className='adminContainer full-width'>
        <Header
          user={user}
          admin={true}
          signOut={this.props.signOut}
        />
      <div className='admin-body'>
          <div className='buttons'>
            {
              showBanner &&
              <div className='success'>{bannerText}</div>
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
                <ModalDialog onClose={this.toggleAddModal} className='modal-dialog'>
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
                <ModalDialog onClose={this.toggleEditModal} className='modal-dialog'>
                  <h1>Enter Credentials</h1>
                  <p>Enter credentials you want to change</p>
                  <input
                    type='email'
                    placeholder='Email'
                    onChange={this.handleMailChange}
                  />
                  <input
                    type='text'
                    placeholder='Display Name'
                    onChange={this.handleNameChange}
                  />
                  <input
                    type='password'
                    placeholder='Password'
                    onChange={this.handlePassChange}
                  />
                  <button
                    onClick={this.updateUserData}
                    style={{width: '131px'}}
                  >Edit</button>
                </ModalDialog>
              </ModalContainer>
            }
            {
              showDeleteModal &&
              <ModalContainer onClose={this.toggleDeleteModal}>
                <ModalDialog onClose={this.toggleDeleteModal} className='modal-dialog'>
                  <h1>Are you sure you want to delete this user?</h1>
                  <p>Warning: this action cannot be undone</p>
                  <button
                    onClick={this.deleteAccount}
                    style={{width: '131px'}}
                  >Yes</button>
                  <button
                    onClick={this.toggleDeleteModal}
                    style={{width: '131px'}}
                  >No</button>
                </ModalDialog>
              </ModalContainer>
            }
          </div>
          <div className='table-body'>
            <div className='toolbar'>
              <i className='material-icons'>search</i>
              <input
                type='text'
                className='search'
                placeholder=' Search by email address or user UID '
              />
            </div>
            <div className='table-container'>
              <table>
                <thead>
                  <tr>
                    <th>
                      <div>
                        Name
                        <i className='material-icons'>arrow_downward</i>
                      </div>
                    </th>
                    <th>
                      <div>
                        Created
                        <i className='material-icons'>arrow_downward</i>
                      </div>
                    </th>
                    <th>
                      <div>
                        Email
                        <i className='material-icons'>arrow_downward</i>
                      </div>
                    </th>
                    <th>
                      <div>
                        Password
                        <i className='material-icons'>arrow_downward</i>
                      </div>
                    </th>
                    <th>
                      <div>
                        Is Admin
                        <i className='material-icons'>arrow_downward</i>
                      </div>
                    </th>
                  </tr>
                </thead>
                { this.getUsersData() }
              </table>
              <div className='pagination'>
                Rows per page:
                <div className='pagination-dropdown'>
                  50
                </div>
                1-3 of 3
                <div className='pagination-buttons'>
                  <button>
                    <i className='material-icons'>chevron_left</i>
                  </button>
                  <button>
                    <i className='material-icons'>chevron_right</i>
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
